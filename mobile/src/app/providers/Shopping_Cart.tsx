import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Shopping_CartProps {
  itemCount?: number;
  onPress?: () => void;
}

export default function Shopping_Cart({
  itemCount = 0,
  onPress,
}: Shopping_CartProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#E07B39] p-4 rounded-full shadow-lg border-2 border-white"
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name="cart" size={28} color="white" />
      {itemCount > 0 && (
        <View className="absolute right-2 top-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-[10px] font-bold">
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
