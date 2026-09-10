import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusConfig } from "./adminOrder.constants";

interface AdminOrderHeaderProps {
  name?: string;
  orderId: string;
  totalItemCount: number;
  statusInfo: StatusConfig;
}

export default function AdminOrderHeader({
  name,
  orderId,
  totalItemCount,
  statusInfo,
}: AdminOrderHeaderProps) {
  const customerInitial = (name || "K").trim().charAt(0).toUpperCase();
  const shortId = (orderId || "").slice(-8).toUpperCase();

  return (
    <View className="flex-row justify-between items-center mb-3.5">
      <View className="flex-row items-center flex-1 mr-2">
        {/* Avatar chữ cái đại diện */}
        <LinearGradient
          colors={["#FFEAD9", "#FED7AA"]}
          className="w-12 h-12 rounded-2xl items-center justify-center mr-3 border border-orange-200/60 shadow-xs"
        >
          <Text className="text-[#C96A2E] font-black text-lg">
            {customerInitial}
          </Text>
        </LinearGradient>

        <View className="flex-1">
          <Text className="text-gray-900 font-black text-base" numberOfLines={1}>
            {name || "Khách hàng"}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-gray-400 text-[11px] font-bold tracking-wider uppercase">
              #{shortId}
            </Text>
            {totalItemCount > 0 && (
              <View className="ml-2 px-2 py-0.5 rounded-full bg-gray-100">
                <Text className="text-gray-600 text-[10px] font-bold">
                  {totalItemCount} món
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Badge trạng thái phong cách Pill */}
      <View
        className={`flex-row items-center px-3 py-1.5 rounded-full border ${statusInfo.bg} ${statusInfo.border}`}
      >
        <MaterialCommunityIcons
          name={statusInfo.icon as any}
          size={13}
          color={statusInfo.badgeColor}
          style={{ marginRight: 4 }}
        />
        <Text className={`text-[10px] font-black uppercase ${statusInfo.text}`}>
          {statusInfo.label}
        </Text>
      </View>
    </View>
  );
}
