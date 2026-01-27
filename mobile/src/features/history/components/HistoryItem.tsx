import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type OrderStatus = "completed" | "cancelled";

interface HistoryItemProps {
  id: string;
  date: string;
  total: string;
  items: string;
  status: OrderStatus;
  image: string;
  onReorder: () => void;
  onViewDetail: () => void;
}

export default function HistoryItem({
  id,
  date,
  total,
  items,
  status,
  image,
  onReorder,
  onViewDetail,
}: HistoryItemProps) {
  const getStatusColor = (status: OrderStatus) => {
    return status === "completed"
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  const getStatusText = (status: OrderStatus) => {
    return status === "completed" ? "Hoàn tất" : "Đã hủy";
  };

  return (
    <View className="bg-white rounded-xl mb-4 p-4 shadow-sm elevation-2">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row">
          <Image
            source={{ uri: image }}
            className="w-16 h-16 rounded-lg bg-gray-100 mr-3"
            resizeMode="cover"
          />
          <View>
            <Text className="text-base font-bold text-[#2D2D2D] mb-1">
              Đơn hàng #{id}
            </Text>
            <Text className="text-xs text-gray-500 mb-1">{date}</Text>
            <View
              className={`self-start px-2 py-1 rounded-full ${status === "completed" ? "bg-green-100" : "bg-red-100"}`}
            >
              <Text
                className={`text-xs font-medium ${status === "completed" ? "text-green-600" : "text-red-600"}`}
              >
                {getStatusText(status)}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-base font-bold text-[#E07B39]">{total}</Text>
      </View>

      <View className="border-t border-gray-100 pt-3 flex-row justify-between items-center">
        <Text className="text-sm text-gray-600 flex-1 mr-4" numberOfLines={1}>
          {items}
        </Text>

        <View className="flex-row">
          <TouchableOpacity
            onPress={onViewDetail}
            className="px-3 py-1.5 border border-gray-300 rounded-lg mr-2"
          >
            <Text className="text-xs font-medium text-gray-600">Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReorder}
            className="px-3 py-1.5 bg-[#E07B39] rounded-lg shadow-sm"
          >
            <Text className="text-xs font-medium text-white">Đặt lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
