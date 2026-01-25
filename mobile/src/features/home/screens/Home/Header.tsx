import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg">
      <View className="flex-row items-center justify-between gap-3">
        <TouchableOpacity className="p-2">
          <MaterialCommunityIcons name="qrcode-scan" size={28} color="white" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-white rounded-xl px-3 py-1">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#999"
            className="flex-1 ml-2 text-[#2D2D2D] text-sm"
          />
        </View>

        <TouchableOpacity className="p-2">
          <MaterialCommunityIcons
            name="cash-multiple"
            size={24}
            color="#FFD700"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="p-2 bg-white rounded-full"
          onPress={onLogout}
        >
          <MaterialCommunityIcons name="account" size={24} color="#E07B39" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
