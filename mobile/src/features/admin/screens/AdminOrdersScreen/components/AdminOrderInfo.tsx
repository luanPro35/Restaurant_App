import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AdminOrderInfoProps {
  formattedDate: string;
  address?: string;
  paymentMethod?: string;
  price: number;
}

export default function AdminOrderInfo({
  formattedDate,
  address,
  paymentMethod,
  price,
}: AdminOrderInfoProps) {
  const isBankTransfer =
    paymentMethod?.toLowerCase().includes("vietqr") ||
    paymentMethod?.toLowerCase().includes("bank");

  return (
    <>
      {/* Khối thông tin chi tiết: Thời gian, Địa chỉ, Thanh toán */}
      <View className="bg-gray-50/80 rounded-2xl p-3 mb-3 border border-gray-100/80 space-y-1.5">
        {/* Thời gian */}
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock-time-four-outline" size={13} color="#9CA3AF" />
          <Text className="text-gray-500 text-[11px] ml-2 font-medium">
            Thời gian: <Text className="text-gray-700 font-semibold">{formattedDate}</Text>
          </Text>
        </View>

        {/* Địa chỉ giao */}
        {address ? (
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="map-marker-outline" size={13} color="#9CA3AF" />
            <Text className="text-gray-500 text-[11px] ml-2 flex-1" numberOfLines={1}>
              Địa chỉ: <Text className="text-gray-700 font-semibold">{address}</Text>
            </Text>
          </View>
        ) : null}

        {/* Phương thức thanh toán */}
        <View className="flex-row items-center justify-between pt-0.5">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="wallet-outline" size={13} color="#9CA3AF" />
            <Text className="text-gray-500 text-[11px] ml-2 font-medium">Thanh toán:</Text>
          </View>
          <View
            className={`px-2.5 py-0.5 rounded-full border ${
              isBankTransfer
                ? "bg-emerald-50 border-emerald-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <Text
              className={`text-[10px] font-black uppercase ${
                isBankTransfer ? "text-emerald-700" : "text-orange-700"
              }`}
            >
              {paymentMethod || "Tiền mặt"}
            </Text>
          </View>
        </View>
      </View>

      {/* Dòng tổng thanh toán */}
      <View className="flex-row justify-between items-center bg-white px-2 py-1 mb-3.5">
        <Text className="text-gray-400 font-bold text-xs">Tổng thanh toán</Text>
        <Text className="text-[#E07B39] font-black text-xl tracking-tight">
          {(price || 0).toLocaleString("vi-VN")}₫
        </Text>
      </View>
    </>
  );
}
