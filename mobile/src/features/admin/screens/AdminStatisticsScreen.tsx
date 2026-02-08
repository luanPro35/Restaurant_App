import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function AdminStatisticsScreen() {
  return (
    <ScrollView className="flex-1 bg-[#F9F6E7] p-4">
      <View className="mt-8 mb-6">
        <Text className="text-2xl font-bold text-gray-800">
          Thống kê & Báo cáo
        </Text>
        <Text className="text-gray-500">
          Xem doanh thu và hiệu suất của nhà hàng
        </Text>
      </View>

      {/* Placeholder for Charts */}
      <View className="bg-white p-6 rounded-2xl shadow-sm mb-4 h-64 items-center justify-center border border-gray-100">
        <Text className="text-gray-400">Biểu đồ doanh thu (Revenue Chart)</Text>
      </View>

      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-4 rounded-2xl shadow-sm w-[48%] border border-gray-100">
          <Text className="text-gray-500 text-xs">Tổng đơn hàng</Text>
          <Text className="text-xl font-bold text-blue-600">1,250</Text>
        </View>
        <View className="bg-white p-4 rounded-2xl shadow-sm w-[48%] border border-gray-100">
          <Text className="text-gray-500 text-xs">Doanh thu tháng</Text>
          <Text className="text-xl font-bold text-green-600">45.5Mđ</Text>
        </View>
      </View>
    </ScrollView>
  );
}
