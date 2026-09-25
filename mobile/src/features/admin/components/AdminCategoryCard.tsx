import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Category } from "../../../services/api/category.api";
import { resolveImageUrl } from "../../../shared/utils";

interface AdminCategoryCardProps {
  category: Category;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AdminCategoryCard: React.FC<AdminCategoryCardProps> = ({
  category,
  onPress,
  onEdit,
  onDelete,
}) => {
  const imageUrl = category.image ? resolveImageUrl(category.image) : null;
  const productCount = category._count?.products ?? (category.products?.length || 0);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-[24px] mb-4 p-4 border border-gray-100 shadow-sm flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Category Image / Fallback Icon */}
      <View className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 overflow-hidden items-center justify-center mr-4 shrink-0">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={32}
            color="#E07B39"
          />
        )}
      </View>

      {/* Info */}
      <View className="flex-1 justify-center mr-2">
        <View className="flex-row items-center space-x-2 mb-1">
          <Text
            className="text-gray-900 font-extrabold text-base flex-1"
            numberOfLines={1}
          >
            {category.name}
          </Text>
          {category.order !== undefined && (
            <View className="bg-gray-100 px-2 py-0.5 rounded-full">
              <Text className="text-gray-500 text-[10px] font-bold">
                #{category.order}
              </Text>
            </View>
          )}
        </View>

        {category.description ? (
          <Text
            className="text-gray-500 text-xs mb-2 leading-4"
            numberOfLines={2}
          >
            {category.description}
          </Text>
        ) : (
          <Text className="text-gray-400 text-xs italic mb-2">
            Chưa có mô tả chi tiết
          </Text>
        )}

        <View className="flex-row items-center space-x-3">
          <View className="flex-row items-center bg-orange-50 px-2.5 py-1 rounded-lg">
            <MaterialCommunityIcons
              name="food-outline"
              size={13}
              color="#E07B39"
            />
            <Text className="text-[#E07B39] text-xs font-bold ml-1">
              {productCount} món
            </Text>
          </View>

          {category.slug && (
            <Text
              className="text-gray-400 text-[11px] font-medium"
              numberOfLines={1}
            >
              /{category.slug}
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="items-center justify-center space-y-2">
        <TouchableOpacity
          onPress={onPress}
          className="w-8 h-8 rounded-xl bg-blue-50 items-center justify-center border border-blue-100"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <MaterialCommunityIcons name="eye-outline" size={16} color="#2563EB" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onEdit}
          className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center border border-orange-100"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={16}
            color="#E07B39"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          className="w-8 h-8 rounded-xl bg-red-50 items-center justify-center border border-red-100"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={16}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};


export default AdminCategoryCard;
