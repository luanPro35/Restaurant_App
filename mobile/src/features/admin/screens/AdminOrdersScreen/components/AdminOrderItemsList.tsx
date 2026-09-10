import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderItem } from "./adminOrder.constants";

interface AdminOrderItemsListProps {
  orderItems: OrderItem[];
}

export default function AdminOrderItemsList({ orderItems }: AdminOrderItemsListProps) {
  if (orderItems.length === 0) return null;

  return (
    <View className="bg-[#FAF7F2] rounded-2xl p-3 mb-3 border border-orange-100/50">
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="silverware-fork-knife" size={13} color="#C96A2E" />
        <Text className="text-[#C96A2E] font-black text-[11px] uppercase tracking-wider ml-1.5">
          Món ăn đã đặt ({orderItems.length})
        </Text>
      </View>
      <View className="space-y-1.5">
        {orderItems.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between py-0.5">
            <View className="flex-row items-center flex-1 mr-2">
              {item.quantity ? (
                <View className="bg-orange-200/70 px-2 py-0.5 rounded-md mr-2">
                  <Text className="text-orange-900 font-black text-[11px]">
                    {item.quantity}x
                  </Text>
                </View>
              ) : (
                <View className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2" />
              )}
              <Text className="text-gray-800 font-bold text-xs flex-1" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
