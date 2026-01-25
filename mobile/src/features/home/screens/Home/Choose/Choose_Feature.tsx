import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const List_Feature = [
  {
    name: "Tại quán",
    icon: "silverware-fork-knife",
    color: "#FF7A00",
    onPress: () => console.log("Tại quán"),
  },
  {
    name: "Giao hàng",
    icon: "truck-delivery",
    color: "#4CAF50",
    onPress: () => console.log("Giao hàng"),
  },
  {
    name: "Menu",
    icon: "book-open-variant",
    color: "#3F51B5",
    onPress: () => console.log("Menu"),
  },
  {
    name: "Bán chạy",
    icon: "fire",
    color: "#F44336",
    onPress: () => console.log("Bán chạy"),
  },
  {
    name: "Khuyến mãi",
    icon: "ticket-percent",
    color: "#E91E63",
    onPress: () => console.log("Khuyến mãi"),
  },
  {
    name: "Đơn hàng",
    icon: "receipt-text",
    color: "#795548",
    onPress: () => console.log("Đơn hàng"),
  },
  {
    name: "Lịch sử",
    icon: "history",
    color: "#607D8B",
    onPress: () => console.log("Lịch sử"),
  },
  {
    name: "Tất cả",
    icon: "apps",
    color: "#9C27B0",
    onPress: () => console.log("Tất cả"),
  },
];

export default function Choose_Feature() {
  return (
    <View className="px-1 flex-row flex-wrap">
      {List_Feature.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className="w-1/4 p-2"
        >
          <View className="bg-white rounded-2xl p-4 items-center justify-center border border-[#E5D5C3] shadow-sm">
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={item.color}
            />
            <Text
              numberOfLines={1}
              className="text-[10px] text-center text-[#2D2D2D] font-medium"
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
