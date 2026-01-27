import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AllChooseSearchBar() {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5 mb-6">
      <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
      <Text className="text-gray-400 ml-2 text-sm">
        Tìm kiếm tính năng, món ăn...
      </Text>
    </View>
  );
}
