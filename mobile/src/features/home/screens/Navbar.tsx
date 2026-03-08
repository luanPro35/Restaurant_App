import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const List_Navbar = [
  {
    id: 1,
    name: "Trang chủ",
    icon: "home-variant",
  },
  {
    id: 2,
    name: "hanh toán",
    icon: "credit-card-outline",
  },
  {
    id: 3,
    name: "Hoạt động",
    icon: "history",
  },
  {
    id: 4,
    name: "Thông báo",
    icon: "bell",
  },
];

import { useNavigation } from "@react-navigation/native";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(1);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handlePress = (id: number) => {
    setActiveTab(id);
    if (id === 1) {
      navigation.navigate("Home");
    } else if (id === 2) {
      navigation.navigate("Payment");
    } else if (id === 3) {
      navigation.navigate("History");
    } else if (id === 4) {
      navigation.navigate("Messages");
    }
  };

  return (
    <View
      className="flex-row justify-around items-center bg-white pt-4 px-2 rounded-t-[32px] shadow-2xl border-t border-gray-100"
      style={{ paddingBottom: Math.max(insets.bottom, 15) }}
    >
      {List_Navbar.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item.id)}
          className="items-center justify-center flex-1"
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={26}
            color={activeTab === item.id ? "#E07B39" : "#9CA3AF"}
          />
          <Text
            className={`text-[11px] mt-1.5 font-bold ${activeTab === item.id ? "text-[#E07B39]" : "text-gray-400"
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
