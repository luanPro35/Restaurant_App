import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PromoBanner() {
  return (
    <View className="mb-6 bg-[#2D2D2D] rounded-xl p-4 flex-row items-center overflow-hidden relative">
      <View className="flex-1 z-10">
        <Text className="text-white font-bold text-base mb-1">
          Thành viên Gold
        </Text>
        <Text className="text-gray-300 text-xs">Nâng hạng để nhận ưu đãi</Text>
      </View>
      <MaterialCommunityIcons
        name="crown"
        size={48}
        color="#FFD700"
        className="opacity-20 absolute -right-2 -bottom-2"
      />
      <View className="bg-[#E07B39] px-3 py-1.5 rounded-lg z-10">
        <Text className="text-white text-xs font-bold">Khám phá</Text>
      </View>
    </View>
  );
}
