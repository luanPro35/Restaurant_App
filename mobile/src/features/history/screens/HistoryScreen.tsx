import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HistoryItem from "../components/HistoryItem";

type TabType = "all" | "completed" | "cancelled";

const ORDERS = [
  {
    id: "10234",
    date: "20/05/2026 18:30",
    total: "450.000đ",
    items: "2x Lẩu Thái, 1x Combo nướng, 4x Pepsi...",
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "10233",
    date: "15/05/2026 12:15",
    total: "125.000đ",
    items: "1x Cơm gà, 1x Canh rong biển",
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "10232",
    date: "10/05/2026 19:00",
    total: "890.000đ",
    items: "Set Sashimi tổng hợp, 2x Sake...",
    status: "cancelled" as const,
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "10231",
    date: "01/05/2026 20:45",
    total: "320.000đ",
    items: "Pizza Hải sản, Mì Ý Carbonara...",
    status: "completed" as const,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
  },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const getFilteredOrders = () => {
    if (activeTab === "all") return ORDERS;
    return ORDERS.filter((order) => order.status === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#795548" />

      {/* Header */}
      <View className="bg-[#795548] pt-12 pb-4 rounded-b-3xl shadow-lg elevation-8 z-10">
        <View className="flex-row justify-between items-center px-4 mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">
              Lịch Sử Đơn Hàng
            </Text>
          </View>
          <View className="bg-white/20 p-2 rounded-full">
            <Text className="text-white font-bold">{ORDERS.length}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 mt-2">
          <TouchableOpacity
            onPress={() => setActiveTab("all")}
            className={`mr-4 px-4 py-2 rounded-full border ${activeTab === "all" ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
          >
            <Text
              className={`font-bold ${activeTab === "all" ? "text-[#795548]" : "text-white"}`}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            className={`mr-4 px-4 py-2 rounded-full border ${activeTab === "completed" ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
          >
            <Text
              className={`font-bold ${activeTab === "completed" ? "text-[#795548]" : "text-white"}`}
            >
              Hoàn tất
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("cancelled")}
            className={`px-4 py-2 rounded-full border ${activeTab === "cancelled" ? "bg-white border-white" : "border-white/50 bg-transparent"}`}
          >
            <Text
              className={`font-bold ${activeTab === "cancelled" ? "text-[#795548]" : "text-white"}`}
            >
              Đã hủy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <HistoryItem
              key={order.id}
              {...order}
              onReorder={() => console.log("Reorder", order.id)}
              onViewDetail={() => console.log("Detail", order.id)}
            />
          ))
        ) : (
          <View className="items-center justify-center mt-20 opacity-50">
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={80}
              color="#795548"
            />
            <Text className="text-gray-500 mt-4 text-lg">
              Chưa có đơn hàng nào
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
