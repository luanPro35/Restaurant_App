import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TableOrderItem } from "./table.types";

interface TableOrderDetailsCardProps {
  orderItems: TableOrderItem[];
  loadingOrder: boolean;
  totalPrice: number;
  onOpenAddModal: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
}

export default function TableOrderDetailsCard({
  orderItems,
  loadingOrder,
  totalPrice,
  onOpenAddModal,
  onUpdateQuantity,
  onRemoveItem,
}: TableOrderDetailsCardProps) {
  return (
    <View className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm mb-6">
      {/* Header chi tiết đơn hàng */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-orange-50 rounded-full items-center justify-center mr-3">
            <MaterialCommunityIcons
              name="food-outline"
              size={18}
              color="#E07B39"
            />
          </View>
          <Text className="text-gray-800 font-black text-sm uppercase tracking-wider">
            Chi tiết đơn hàng ({orderItems.length} món)
          </Text>
        </View>

        {/* Nút thêm món */}
        <TouchableOpacity
          onPress={onOpenAddModal}
          className="flex-row items-center px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200"
        >
          <MaterialCommunityIcons name="plus" size={15} color="#E07B39" />
          <Text className="text-[#E07B39] font-black text-xs ml-1">
            Thêm món
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung danh sách món */}
      {loadingOrder ? (
        <View className="py-6 items-center justify-center">
          <ActivityIndicator size="small" color="#E07B39" />
          <Text className="text-xs text-gray-400 font-medium mt-2">
            Đang tải đơn của bàn...
          </Text>
        </View>
      ) : orderItems.length === 0 ? (
        <TouchableOpacity
          onPress={onOpenAddModal}
          activeOpacity={0.7}
          className="p-6 border-2 border-dashed border-orange-200 rounded-2xl items-center justify-center bg-orange-50/20 mb-4"
        >
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={32}
            color="#E07B39"
          />
          <Text className="text-gray-600 font-bold text-sm mt-2">
            Bàn này chưa có món nào
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Chạm để mở thực đơn và thêm món cho khách
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="space-y-2.5 mb-4">
          {orderItems.map((item, index) => (
            <View
              key={`${item.productId}-${index}`}
              className="flex-row items-center justify-between p-3 rounded-2xl bg-gray-50/90 border border-gray-100"
            >
              {/* Ảnh món ăn */}
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  className="w-12 h-12 rounded-xl mr-2.5 bg-gray-200 border border-orange-100"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-12 h-12 rounded-xl mr-2.5 bg-orange-50 items-center justify-center border border-orange-100">
                  <MaterialCommunityIcons
                    name="food"
                    size={20}
                    color="#E07B39"
                  />
                </View>
              )}

              <View className="flex-1 mr-2">
                <Text
                  className="text-gray-900 font-black text-sm"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-[#E07B39] font-bold text-xs mt-0.5">
                  {(item.price || 0).toLocaleString("vi-VN")}₫
                  <Text className="text-gray-400 font-normal"> / phần</Text>
                </Text>
              </View>

              {/* Bộ điều khiển số lượng [-] QTY [+] */}
              <View className="flex-row items-center bg-white rounded-xl border border-gray-200 px-1 py-0.5 shadow-2xs mr-2">
                <TouchableOpacity
                  onPress={() => onUpdateQuantity(index, -1)}
                  className="w-7 h-7 rounded-lg items-center justify-center bg-gray-50"
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={14}
                    color="#4B5563"
                  />
                </TouchableOpacity>
                <Text className="w-7 text-center font-black text-xs text-gray-800">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => onUpdateQuantity(index, 1)}
                  className="w-7 h-7 rounded-lg items-center justify-center bg-orange-50"
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={14}
                    color="#E07B39"
                  />
                </TouchableOpacity>
              </View>

              {/* Nút xóa món */}
              <TouchableOpacity
                onPress={() => onRemoveItem(index)}
                className="w-8 h-8 rounded-xl bg-red-50 items-center justify-center border border-red-100"
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Nút thêm món phụ */}
      {orderItems.length > 0 && (
        <TouchableOpacity
          onPress={onOpenAddModal}
          className="py-3 rounded-2xl border border-dashed border-orange-300 bg-orange-50/40 flex-row items-center justify-center mb-4"
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={18}
            color="#E07B39"
          />
          <Text className="text-[#E07B39] font-black text-xs ml-1.5 uppercase">
            Thêm món khác từ thực đơn
          </Text>
        </TouchableOpacity>
      )}

      {/* Khối tổng tiền tự động tính */}
      <View className="flex-row justify-between items-center bg-[#FAF7F2] p-4 rounded-2xl border border-orange-100">
        <View>
          <Text className="text-gray-500 font-bold text-xs">
            Tổng tiền tạm tính
          </Text>
          <Text className="text-gray-400 text-[10px]">
            Tự động cập nhật theo món
          </Text>
        </View>
        <Text className="text-[#E07B39] font-black text-xl">
          {totalPrice.toLocaleString("vi-VN")}₫
        </Text>
      </View>
    </View>
  );
}
