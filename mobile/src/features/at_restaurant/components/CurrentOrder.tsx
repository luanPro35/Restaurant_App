import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: "pending" | "preparing" | "ready" | "served";
}

interface CurrentOrderProps {
  items?: OrderItem[];
  tableNumber?: string;
}

export default function CurrentOrder({
  items = [],
  tableNumber = "A1",
}: CurrentOrderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "clock-outline";
      case "preparing":
        return "chef-hat";
      case "ready":
        return "check-circle";
      case "served":
        return "silverware-fork-knife";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "preparing":
        return "#3B82F6";
      case "ready":
        return "#10B981";
      case "served":
        return "#6B7280";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "preparing":
        return "Đang làm";
      case "ready":
        return "Sẵn sàng";
      case "served":
        return "Đã phục vụ";
      default:
        return "";
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mx-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="table-furniture"
            size={24}
            color="#E07B39"
          />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Bàn {tableNumber}
          </Text>
        </View>
        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-600 font-semibold">
            {items.length} món
          </Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View className="items-center py-8">
          <MaterialCommunityIcons name="food-off" size={48} color="#D1D5DB" />
          <Text className="text-gray-400 mt-2">Chưa có món nào</Text>
        </View>
      ) : (
        <>
          <ScrollView className="max-h-64">
            {items.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MaterialCommunityIcons
                      name={getStatusIcon(item.status) as any}
                      size={14}
                      color={getStatusColor(item.status)}
                    />
                    <Text
                      className="text-xs ml-1"
                      style={{ color: getStatusColor(item.status) }}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-gray-600">x{item.quantity}</Text>
                  <Text className="text-orange-600 font-semibold">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="flex-row items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Tổng cộng</Text>
            <Text className="text-xl font-bold text-orange-600">
              {totalAmount.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <TouchableOpacity
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl py-3 mt-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-base">
              Thanh toán
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
