import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { AdminProduct } from "../types/admin.types";
import { formatCurrency } from "../utils/admin.utils";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 64) / 2; // Accounting for screen padding and gap

export interface AdminProductCardCategoriesProps {
  product: AdminProduct;
}

export const AdminProductCardCategories = ({
  product,
}: AdminProductCardCategoriesProps) => {
  return (
    <View
      className="bg-white rounded-[28px] mb-4 overflow-hidden border border-gray-100 shadow-sm"
      style={{ width: CARD_WIDTH, elevation: 3 }}
    >
      {/* Image Section */}
      <View className="relative w-full aspect-square bg-gray-50">
        <Image
          source={{
            uri:
              product.images ||
              "https://img.freepik.com/free-photo/delicious-vietnamese-food-including-pho-ga-spring-rolls_23-2148133543.jpg",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {!product.isAvailable && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <View className="bg-red-500 px-2 py-0.5 rounded-full">
              <Text className="text-white text-[8px] font-black uppercase">
                Tạm hết
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="p-3">
        <Text
          className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5"
          numberOfLines={1}
        >
          {product.category?.name || "Món ăn"}
        </Text>
        <Text
          className="text-gray-900 font-bold text-sm leading-tight mb-2"
          numberOfLines={2}
          style={{ height: 34 }} // Fixed height for 2 lines to keep grid aligned
        >
          {product.name}
        </Text>

        <View className="flex-row items-baseline">
          <Text className="text-[#E07B39] font-black text-base">
            {formatCurrency(product.price).replace("đ", "")}
          </Text>
          <Text className="text-[#E07B39] text-[10px] font-bold ml-0.5">đ</Text>
          <Text className="text-gray-400 text-[9px] font-medium ml-1">
            /{product.unit || "phần"}
          </Text>
        </View>
      </View>
    </View>
  );
};
