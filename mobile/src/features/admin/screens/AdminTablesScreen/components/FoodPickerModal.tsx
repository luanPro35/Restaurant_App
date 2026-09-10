import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProductItemData, TableOrderItem, getProductImage } from "./table.types";

interface FoodPickerModalProps {
  visible: boolean;
  products: ProductItemData[];
  loadingProducts: boolean;
  orderItems: TableOrderItem[];
  onClose: () => void;
  onAddProduct: (product: ProductItemData) => void;
}

export default function FoodPickerModal({
  visible,
  products,
  loadingProducts,
  orderItems,
  onClose,
  onAddProduct,
}: FoodPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [products, searchQuery]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[36px] h-[82%] p-6">
          {/* Header Modal */}
          <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={22}
                color="#E07B39"
              />
              <Text className="text-lg font-black text-gray-900 ml-2">
                Thực đơn món ăn
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Ô tìm kiếm món */}
          <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-3.5 py-1 mb-3">
            <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 p-2.5 font-medium text-gray-800 text-xs"
              placeholder="Tìm món ăn, đồ uống..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Danh sách món ăn từ thực đơn */}
          {loadingProducts ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#E07B39" />
              <Text className="text-xs text-gray-400 mt-2 font-medium">
                Đang tải thực đơn...
              </Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <MaterialCommunityIcons
                name="food-off-outline"
                size={44}
                color="#D1D5DB"
              />
              <Text className="text-gray-500 font-bold text-sm mt-2">
                Không tìm thấy món nào
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const imageUri = getProductImage(item);
                const alreadyInTable = orderItems.find(
                  (oi) => oi.productId === item.id || oi.name === item.name
                );

                return (
                  <View className="flex-row items-center justify-between p-3 mb-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                    {/* Hình ảnh món ăn thực tế */}
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        className="w-14 h-14 rounded-2xl mr-3 bg-gray-200 border border-orange-100/60"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-14 h-14 rounded-2xl mr-3 bg-orange-50 items-center justify-center border border-orange-100">
                        <MaterialCommunityIcons
                          name="food"
                          size={24}
                          color="#E07B39"
                        />
                      </View>
                    )}

                    <View className="flex-1 mr-2">
                      <Text
                        className="text-gray-900 font-bold text-sm"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-[#E07B39] font-black text-xs mt-0.5">
                        {item.price.toLocaleString("vi-VN")}₫
                      </Text>
                      {alreadyInTable && (
                        <Text className="text-emerald-600 font-bold text-[10px] mt-0.5">
                          Đã chọn: {alreadyInTable.quantity} phần
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => onAddProduct(item)}
                      className="px-3.5 py-2 rounded-xl bg-[#E07B39] flex-row items-center shadow-xs"
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        size={15}
                        color="white"
                      />
                      <Text className="text-white font-black text-xs ml-1">
                        Thêm
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}

          {/* Nút Hoàn tất chọn món */}
          <TouchableOpacity
            onPress={onClose}
            className="mt-3 bg-gray-900 py-3.5 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-black text-sm uppercase tracking-wider">
              Xong (Đã chọn {orderItems.length} món)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
