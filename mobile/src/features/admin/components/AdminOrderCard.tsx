import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminOrder } from "../types/admin.types";
import { formatCurrency } from "../utils/admin.utils";

export interface AdminOrderCardProps {
  order: AdminOrder;
  onPress?: () => void;
}

export const AdminOrderCard = ({ order, onPress }: AdminOrderCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-[24px] mb-4 overflow-hidden border border-gray-100 shadow-sm"
      style={{ elevation: 2 }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-2">
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={16}
                color="#E07B39"
              />
            </View>
            <Text className="text-gray-500 font-bold text-xs uppercase tracking-wider">
              #{order.id.slice(-6).toUpperCase()}
            </Text>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${order.isAvailable ? "bg-green-50" : "bg-red-50"}`}
          >
            <Text
              className={`text-[10px] font-black uppercase ${order.isAvailable ? "text-green-600" : "text-red-600"}`}
            >
              {order.isAvailable ? "Hoàn thành" : "Đang xử lý"}
            </Text>
          </View>
        </View>

        <View className="mb-4">
          <Text
            className="text-gray-900 font-black text-lg mb-1"
            numberOfLines={1}
          >
            {order.name}
          </Text>
          <Text className="text-[#E07B39] font-bold text-base">
            {formatCurrency(order.price)}
          </Text>
        </View>

        <View className="h-[1px] bg-gray-50 mb-4" />

        <View className="space-y-2">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#9CA3AF"
            />
            <Text className="text-gray-500 text-xs ml-2 font-medium">
              Giao trước: {order.until}
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={14}
              color="#9CA3AF"
            />
            <Text
              className="text-gray-400 text-xs ml-2 flex-1"
              numberOfLines={1}
            >
              {order.address}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
