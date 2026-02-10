import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../../app/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function AdminSettingsScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#FDFCF7] mt-8">
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2D2D2D" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Cài đặt Admin</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-8">
        <Text className="text-gray-400 font-bold uppercase tracking-wider mb-6 text-xs">
          Tài khoản & Bảo mật
        </Text>

        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.7}
          className="bg-red-50 py-4 rounded-2xl items-center border border-red-100"
        >
          <Text className="text-red-500 font-bold text-base">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
