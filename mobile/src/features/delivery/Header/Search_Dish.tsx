import React from "react";
import { View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Search_DishProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  placeholder?: string;
}

export default function Search_Dish({
  searchQuery = "",
  onSearchChange,
  placeholder = "Bạn đang thèm món gì nào",
}: Search_DishProps) {
  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
        <MaterialIcons name="search" size={24} color="#999" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchChange}
          className="flex-1 ml-2 text-base text-[#2D2D2D]"
        />
      </View>
    </View>
  );
}
