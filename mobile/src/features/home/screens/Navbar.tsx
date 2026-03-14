import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const List_Navbar = [
  {
    id: 1,
    name: "Trang chủ",
    icon: "home-variant",
    activeIcon: "home-variant",
  },
  {
    id: 2,
    name: "AI",
    icon: "robot-outline",
    activeIcon: "robot",
  },
  {
    id: 3,
    name: "Hoạt động",
    icon: "history",
    activeIcon: "history",
  },
  {
    id: 4,
    name: "Thông báo",
    icon: "bell-outline",
    activeIcon: "bell",
  },
];

export default function Navbar({ navigation }: { navigation: any }) {
  const [activeTab, setActiveTab] = useState(1);
  const insets = useSafeAreaInsets();

  const handlePress = (id: number) => {
    setActiveTab(id);
    if (id === 1) {
      navigation.navigate("Home");
    } else if (id === 2) {
      navigation.navigate("AI");
    } else if (id === 3) {
      navigation.navigate("History");
    } else if (id === 4) {
      navigation.navigate("Messages");
    }
  };

  return (
    <View
      className="flex-row justify-around items-center bg-white/95 py-3 px-4 rounded-[32px] shadow-2xl border border-gray-100/50"
      style={{
        elevation: 10,
      }}
    >
      {List_Navbar.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePress(item.id)}
            className="items-center justify-center flex-1"
            activeOpacity={0.7}
          >
            <View
              className={`p-1.5 rounded-2xl items-center justify-center ${isActive ? "bg-orange-50" : ""
                }`}
            >
              <MaterialCommunityIcons
                name={(isActive ? item.activeIcon : item.icon) as any}
                size={isActive ? 24 : 22}
                color={isActive ? "#E07B39" : "#9CA3AF"}
              />
            </View>
            <Text
              className={`text-[9px] mt-1 font-bold tracking-tight uppercase ${isActive ? "text-[#E07B39]" : "text-gray-400"
                }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
