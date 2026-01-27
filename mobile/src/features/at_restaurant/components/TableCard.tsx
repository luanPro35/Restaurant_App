import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface TableCardProps {
  tableNumber: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  onPress?: () => void;
}

export default function TableCard({
  tableNumber,
  capacity,
  status,
  onPress,
}: TableCardProps) {
  const getStatusColor = (): [string, string] => {
    switch (status) {
      case "available":
        return ["#10B981", "#059669"];
      case "occupied":
        return ["#EF4444", "#DC2626"];
      case "reserved":
        return ["#F59E0B", "#D97706"];
      default:
        return ["#6B7280", "#4B5563"];
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return "Trống";
      case "occupied":
        return "Đang dùng";
      case "reserved":
        return "Đã đặt";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-[48%] mb-4"
    >
      <LinearGradient
        colors={getStatusColor()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-4 shadow-lg"
      >
        <View className="items-center">
          <MaterialCommunityIcons
            name="table-furniture"
            size={40}
            color="white"
          />
          <Text className="text-white text-2xl font-bold mt-2">
            {tableNumber}
          </Text>
          <View className="flex-row items-center mt-2">
            <MaterialCommunityIcons
              name="account-multiple"
              size={16}
              color="white"
            />
            <Text className="text-white ml-1">{capacity} chỗ</Text>
          </View>
          <View className="bg-white/20 px-3 py-1 rounded-full mt-2">
            <Text className="text-white text-xs font-semibold">
              {getStatusText()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
