import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DiscountsSaving() {
  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-gray-800 mb-4 px-1">
        Ưu đãi và tiết kiệm
      </Text>
      <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-orange-100 items-center justify-center">
              <Ionicons name="gift-outline" size={22} color="#f97316" />
            </View>
            <View className="ml-4">
              <Text className="text-gray-700 font-medium text-base">
                Xu tiết kiệm
              </Text>
              <Text className="text-orange-600 font-bold">1,250 Xu</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-blue-100 items-center justify-center">
              <Ionicons name="ribbon-outline" size={22} color="#3b82f6" />
            </View>
            <View className="ml-4">
              <Text className="text-gray-700 font-medium text-base">
                Hạng thành viên
              </Text>
              <Text className="text-blue-600 font-bold">Thành viên Vàng</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
