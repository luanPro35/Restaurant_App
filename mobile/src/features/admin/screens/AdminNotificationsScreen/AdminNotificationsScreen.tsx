import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function AdminNotificationsScreen() {
  return (
    <View className="flex-1 bg-[#F9F6E7] p-4">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-bold text-gray-800">Gửi thông báo</Text>
        <Text className="text-gray-500">
          Gửi tin nhắn đẩy (Push) đến khách hàng
        </Text>
      </View>

      <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <Text className="font-bold mb-2">Tiêu đề</Text>
        <TextInput
          className="bg-gray-50 p-3 rounded-xl mb-4"
          placeholder="Nhập tiêu đề thông báo..."
        />

        <Text className="font-bold mb-2">Nội dung</Text>
        <TextInput
          className="bg-gray-50 p-3 rounded-xl mb-6 h-32"
          placeholder="Nhập nội dung chi tiết..."
          multiline
        />

        <TouchableOpacity className="bg-[#E07B39] py-4 rounded-xl items-center">
          <Text className="text-white font-bold">Gửi thông báo ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
