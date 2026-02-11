import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../../app/navigation/MainNavigator";
import { useNavigation } from "@react-navigation/native";
import { AdminOrder } from "../../types/admin.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminOrderCard } from "../../components/AdminOrderCard";

export const dummyOrders: AdminOrder[] = [
  {
    id: "ORD-001",
    name: "Bún bò Huế đặc biệt",
    price: 100000,
    isAvailable: true,
    until: "12:00",
    address: "123 Main St, District 1, HCMC",
  },
  {
    id: "ORD-002",
    name: "Phở tái lăn",
    price: 85000,
    isAvailable: false,
    until: "12:45",
    address: "456 Le Lai St, District 3, HCMC",
  },
  {
    id: "ORD-003",
    name: "Bún chả Hà Nội",
    price: 65000,
    isAvailable: true,
    until: "13:15",
    address: "789 Pasteur St, District 1, HCMC",
  },
];

export default function AdminOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 pt-14 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <Text className="text-xl font-black text-gray-800">
            Quản lý Đơn hàng
          </Text>
          <TouchableOpacity className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100">
            <MaterialCommunityIcons
              name="filter-variant"
              size={20}
              color="#1F2937"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {dummyOrders.map((order) => (
          <AdminOrderCard
            key={order.id}
            order={order}
            onPress={() => navigation.navigate("AdminDetailOrder", { order })}
          />
        ))}
      </ScrollView>
    </View>
  );
}
