import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const List_Navbar = [
  {
    id: 1,
    name: "Trang chủ",
    icon: "home-variant",
  },
  {
    id: 2,
    name: "Thanh toán",
    icon: "credit-card-outline",
  },
  {
    id: 3,
    name: "Hoạt động",
    icon: "history",
  },
  {
    id: 4,
    name: "Tin nhắn",
    icon: "message",
  },
];

import { useNavigation } from "@react-navigation/native";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(1);
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-around items-center bg-white py-3 px-2 rounded-3xl shadow-2xl border border-gray-100">
      {List_Navbar.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => setActiveTab(item.id)}
          className="items-center justify-center flex-1"
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={24}
            color={activeTab === item.id ? "#E07B39" : "#9CA3AF"}
          />
          <Text
            className={`text-[10px] mt-1 font-bold ${
              activeTab === item.id ? "text-[#E07B39]" : "text-gray-400"
            }`}
          >
            {item.name}
          </Text>
          {activeTab === item.id && (
            <View className="absolute -bottom-1 w-1 h-1 bg-[#E07B39] rounded-full" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
