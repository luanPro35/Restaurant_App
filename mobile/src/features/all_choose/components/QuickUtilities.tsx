import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function QuickUtilities() {
  return (
    <View className="mb-6">
      <Text className="text-sm font-bold text-gray-800 mb-3 px-1">
        Tiện ích nhanh
      </Text>
      <View className="flex-row justify-between bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
        <View className="items-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-1">
            <MaterialCommunityIcons
              name="star-circle"
              size={22}
              color="#F59E0B"
            />
          </View>
          <Text className="text-[10px] text-gray-600 font-medium">
            Đánh giá
          </Text>
        </View>
        <View className="items-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-1">
            <MaterialCommunityIcons
              name="ticket-confirmation"
              size={22}
              color="#EF4444"
            />
          </View>
          <Text className="text-[10px] text-gray-600 font-medium">Voucher</Text>
        </View>
        <View className="items-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-1">
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={22}
              color="#10B981"
            />
          </View>
          <Text className="text-[10px] text-gray-600 font-medium">Gần đây</Text>
        </View>
        <View className="items-center">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-1">
            <MaterialCommunityIcons
              name="headphones"
              size={22}
              color="#3B82F6"
            />
          </View>
          <Text className="text-[10px] text-gray-600 font-medium">Hỗ trợ</Text>
        </View>
      </View>
    </View>
  );
}
