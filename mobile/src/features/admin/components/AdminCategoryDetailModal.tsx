import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category, CategoryProduct } from "../../../services/api/category.api";
import { resolveImageUrl, formatCurrency } from "../../../shared/utils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AdminCategoryDetailModalProps {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  fetchDetailFn: (id: string) => Promise<Category | null>;
}

export const AdminCategoryDetailModal: React.FC<
  AdminCategoryDetailModalProps
> = ({ visible, category, onClose, onEdit, onDelete, fetchDetailFn }) => {
  const [detail, setDetail] = useState<Category | null>(category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && category?.id) {
      setDetail(category);
      setLoading(true);
      fetchDetailFn(category.id)
        .then((fullData) => {
          if (fullData) {
            setDetail(fullData);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [visible, category]);

  if (!category) return null;

  const currentCategory = detail || category;
  const imageUrl = currentCategory.image
    ? resolveImageUrl(currentCategory.image)
    : null;
  const products: CategoryProduct[] = currentCategory.products || [];
  const productCount =
    currentCategory._count?.products ?? products.length ?? 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1"
        />

        <View
          className="bg-[#FDFCF7] rounded-t-[36px] overflow-hidden"
          style={{
            height: SCREEN_HEIGHT * 0.82,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 20,
          }}
        >
          {/* Header Bar */}
          <View className="flex-row items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 bg-white">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-orange-50 items-center justify-center mr-3 border border-orange-200">
                <MaterialCommunityIcons
                  name="tag-text-outline"
                  size={22}
                  color="#E07B39"
                />
              </View>
              <View>
                <Text className="text-gray-900 font-extrabold text-lg">
                  Chi tiết danh mục
                </Text>
                <Text className="text-gray-400 text-[11px] font-medium">
                  Thông tin & danh sách món liên kết
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          >

            {/* Banner Image */}
            <View className="w-full h-44 rounded-3xl bg-orange-50 border border-orange-100 overflow-hidden items-center justify-center mb-5 relative">
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center justify-center">
                  <MaterialCommunityIcons
                    name="image-filter-hdr"
                    size={48}
                    color="#FDBA74"
                  />
                  <Text className="text-orange-400 text-xs mt-2 font-medium">
                    Chưa có ảnh đại diện
                  </Text>
                </View>
              )}

              {/* Order Badge */}
              <View className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex-row items-center">
                <MaterialCommunityIcons
                  name="sort-numeric-ascending"
                  size={14}
                  color="#FFFFFF"
                />
                <Text className="text-white text-xs font-bold ml-1">
                  Thứ tự: {currentCategory.order ?? 0}
                </Text>
              </View>
            </View>

            {/* Title & Metadata */}
            <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4">
              <Text className="text-2xl font-black text-gray-900 mb-2">
                {currentCategory.name}
              </Text>

              {currentCategory.slug && (
                <View className="flex-row items-center mb-3">
                  <Text className="text-gray-400 text-xs font-semibold mr-2">
                    Slug định danh:
                  </Text>
                  <View className="bg-gray-100 px-2.5 py-0.5 rounded-lg">
                    <Text className="text-gray-700 text-xs font-mono font-bold">
                      {currentCategory.slug}
                    </Text>
                  </View>
                </View>
              )}

              <Text className="text-gray-400 text-xs font-semibold mb-1">
                Mô tả:
              </Text>
              <Text className="text-gray-700 text-sm leading-5">
                {currentCategory.description || "Chưa có mô tả cho danh mục này."}
              </Text>
            </View>

            {/* Dishes list */}
            <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="silverware-fork-knife"
                    size={18}
                    color="#E07B39"
                  />
                  <Text className="text-base font-extrabold text-gray-900 ml-2">
                    Món ăn trong danh mục
                  </Text>
                </View>
                <View className="bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                  <Text className="text-[#E07B39] text-xs font-black">
                    {productCount} món
                  </Text>
                </View>
              </View>

              {loading ? (
                <View className="py-8 items-center justify-center">
                  <ActivityIndicator size="small" color="#E07B39" />
                  <Text className="text-gray-400 text-xs mt-2">
                    Đang tải danh sách món ăn...
                  </Text>
                </View>
              ) : products.length > 0 ? (
                <View className="space-y-3">
                  {products.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row items-center p-3 rounded-2xl bg-[#FDFCF7] border border-gray-100"
                    >
                      <Image
                        source={{
                          uri: resolveImageUrl(item.images),
                        }}
                        className="w-12 h-12 rounded-xl bg-gray-100 mr-3"
                        resizeMode="cover"
                      />
                      <View className="flex-1 mr-2">
                        <Text
                          className="text-gray-900 font-bold text-sm"
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-[#E07B39] font-extrabold text-xs mt-0.5">
                          {formatCurrency(item.price)}
                        </Text>
                      </View>
                      <View
                        className={`px-2 py-0.5 rounded-full ${
                          item.isAvailable ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            item.isAvailable
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {item.isAvailable ? "Đang bán" : "Tạm hết"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="py-6 items-center justify-center">
                  <MaterialCommunityIcons
                    name="food-off-outline"
                    size={36}
                    color="#D1D5DB"
                  />
                  <Text className="text-gray-400 text-xs mt-2 font-medium">
                    Danh mục này chưa có món ăn nào
                  </Text>
                </View>
              )}
            </View>

            {/* Action Bar */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onEdit(currentCategory);
                }}
                className="flex-1 bg-[#E07B39] py-3.5 rounded-2xl items-center justify-center flex-row shadow-sm"
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  color="white"
                />
                <Text className="text-white font-black text-sm ml-2">
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onDelete(currentCategory);
                }}
                className="flex-1 bg-red-500 py-3.5 rounded-2xl items-center justify-center flex-row shadow-sm"
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="white"
                />
                <Text className="text-white font-black text-sm ml-2">
                  Xóa danh mục
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AdminCategoryDetailModal;
