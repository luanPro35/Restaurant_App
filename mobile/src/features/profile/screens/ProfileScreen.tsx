import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HeaderProfile from "../components/HeaderProfile";
import DiscountsSaving from "../components/Discounts-Saving";
import Overview from "../components/Overview";
import { useAuth } from "../../../app/context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const ProfileMenuItem = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-0"
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-2xl ${color} items-center justify-center shadow-sm`}
        >
          <Ionicons name={icon} size={22} color="white" />
        </View>
        <Text className="ml-4 text-gray-700 font-medium text-base">
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-white p-2 rounded-full shadow-sm border border-gray-100"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-12">
          <HeaderProfile />
          <Overview />

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-10 flex-row items-center justify-center bg-white py-4 rounded-3xl border border-rose-100 shadow-sm active:bg-rose-50"
          >
            <Ionicons name="log-out-outline" size={24} color="#f43f5e" />
            <Text className="ml-3 text-rose-500 font-bold text-lg">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
