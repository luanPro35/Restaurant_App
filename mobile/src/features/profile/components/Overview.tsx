import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Overview() {
  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-gray-800 mb-4 px-1">
        Tổng quan
      </Text>
      <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-rose-100 items-center justify-center">
              <Ionicons name="heart-outline" size={22} color="#f43f5e" />
            </View>
            <Text className="ml-4 text-gray-700 font-medium text-base">
              Yêu thích
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-400 mr-2">12 món</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-2xl bg-indigo-100 items-center justify-center">
              <Ionicons name="language-outline" size={22} color="#6366f1" />
            </View>
            <Text className="ml-4 text-gray-700 font-medium text-base">
              Ngôn ngữ
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-400 mr-2">Tiếng Việt</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
