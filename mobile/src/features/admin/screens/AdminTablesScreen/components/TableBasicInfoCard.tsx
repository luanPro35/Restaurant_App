import React from "react";
import { View, Text, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TableBasicInfoCardProps {
  name: string;
  onChangeName: (name: string) => void;
  capacity: string;
  onChangeCapacity: (capacity: string) => void;
}

export default function TableBasicInfoCard({
  name,
  onChangeName,
  capacity,
  onChangeCapacity,
}: TableBasicInfoCardProps) {
  return (
    <View className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm mb-5">
      <View className="flex-row items-center mb-4">
        <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3">
          <MaterialCommunityIcons
            name="information-outline"
            size={18}
            color="#3B82F6"
          />
        </View>
        <Text className="text-gray-800 font-black text-sm uppercase tracking-wider">
          Thông tin cơ bản
        </Text>
      </View>

      {/* Tên bàn */}
      <View className="mb-4">
        <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
          Tên bàn
        </Text>
        <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
          <MaterialCommunityIcons
            name="tag-outline"
            size={20}
            color="#9CA3AF"
          />
          <TextInput
            className="flex-1 p-3.5 font-semibold text-gray-800"
            value={name}
            onChangeText={onChangeName}
            placeholder="Nhập tên bàn..."
          />
        </View>
      </View>

      {/* Sức chứa */}
      <View className="mb-1">
        <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
          Sức chứa (người)
        </Text>
        <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
          <MaterialCommunityIcons
            name="account-group-outline"
            size={20}
            color="#9CA3AF"
          />
          <TextInput
            className="flex-1 p-3.5 font-semibold text-gray-800"
            value={capacity}
            onChangeText={onChangeCapacity}
            keyboardType="numeric"
            placeholder="Nhập sức chứa..."
          />
        </View>
      </View>
    </View>
  );
}
