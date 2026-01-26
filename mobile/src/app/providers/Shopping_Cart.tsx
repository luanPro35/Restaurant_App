import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Shopping_Cart() {
  return (
    <TouchableOpacity className="bg-[#E07B39] p-4 rounded-full shadow-lg border-2 border-white">
      <MaterialCommunityIcons name="cart" size={28} color="white" />
      <View className="absolute right-2 top-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
        <Text className="text-white text-[10px] font-bold">0</Text>
      </View>
    </TouchableOpacity>
  );
}
