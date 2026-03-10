import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-[#E07B39] pb-10 px-4 rounded-b-[48px] shadow-2xl"
      style={{ paddingTop: Math.max(insets.top, 20) + 15 }}
    >
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          className="p-2 mr-1"
          onPress={() => navigation.navigate("QRScanner")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="white" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-white/95 rounded-2xl px-5 py-3.5 shadow-md">
          <Ionicons name="search" size={24} color="#999" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#999"
            className="flex-1 ml-3 text-[#2D2D2D] text-[16px] font-medium"
          />
        </View>

        <View className="flex-row items-center ml-2">
            <TouchableOpacity className="p-2 mr-2">
            <MaterialCommunityIcons
                name="cash-multiple"
                size={28}
                color="#FFD700"
            />
            </TouchableOpacity>

            <TouchableOpacity
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md active:opacity-80"
            onPress={() => navigation.navigate("Profile")}
            >
            <MaterialCommunityIcons name="account" size={28} color="#E07B39" />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
