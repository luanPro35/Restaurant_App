import React from "react";
import { View, Text, TouchableOpacity, Image, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AdminProduct } from "../types/admin.types";
import { formatCurrency } from "../utils/admin.utils";

export interface AdminProductCardProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

export const AdminProductCard = ({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
}: AdminProductCardProps) => {
  return (
    <View
      className="bg-white rounded-[32px] mb-4 overflow-hidden border border-gray-100 shadow-sm"
      style={{ elevation: 2 }}
    >
      <View className="flex-row p-4">
        <View className="relative">
          <Image
            source={{
              uri: product.images || "https://via.placeholder.com/150",
            }}
            className="w-24 h-24 rounded-2xl bg-gray-100"
          />
          {!product.isAvailable && (
            <View className="absolute inset-0 bg-black/40 rounded-2xl items-center justify-center">
              <Text className="text-white text-[10px] font-bold uppercase">
                Hết hàng
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 ml-4 justify-between">
          <View>
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-2">
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  {product.category?.name || "Chưa phân loại"}
                </Text>
                <Text
                  className="text-gray-800 font-bold text-base"
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
              </View>
              <Switch
                value={product.isAvailable}
                onValueChange={(value) =>
                  onToggleAvailability(product.id, value)
                }
                trackColor={{ false: "#D1D5DB", true: "#E07B39" }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
            <Text className="text-[#E07B39] font-bold text-lg mt-1">
              {formatCurrency(product.price)}
              <Text className="text-gray-400 text-xs font-medium">
                /{product.unit || "phần"}
              </Text>
            </Text>
          </View>

          <View className="flex-row justify-end items-center space-x-2">
            <TouchableOpacity
              onPress={() => onDelete(product.id)}
              className="p-2 bg-red-50 rounded-xl"
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color="#EF4444"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEdit(product)}
              className="p-2 bg-blue-50 rounded-xl ml-2"
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#3B82F6"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
