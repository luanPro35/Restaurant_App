import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminPromotion } from "../types/admin.types";

export interface AdminPromotionCardProps {
  promotion: AdminPromotion;
  onPress?: () => void;
  onDelete?: (id: string) => void;
}

export const AdminPromotionCard = ({
  promotion,
  onPress,
  onDelete,
}: AdminPromotionCardProps) => {
  const isActive = promotion.isActive;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          width: 5,
          backgroundColor: isActive ? "#22C55E" : "#E5E7EB",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      />

      <View style={{ flex: 1, padding: 14 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className="text-gray-900 font-black text-base flex-1 mr-3"
            numberOfLines={1}
          >
            {promotion.name}
          </Text>
          <View
            className={`px-2 py-[3px] rounded-full ${isActive ? "bg-green-50" : "bg-gray-100"}`}
          >
            <Text
              className={`text-[10px] font-bold ${isActive ? "text-green-600" : "text-gray-400"}`}
            >
              {isActive ? "● Hoạt động" : "● Tạm dừng"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3">
          <View className="bg-orange-50 rounded-lg px-3 py-1 mr-3 flex-row items-center">
            <MaterialCommunityIcons
              name="ticket-percent-outline"
              size={14}
              color="#E07B39"
            />
            <Text className="text-[#E07B39] font-black text-sm ml-1">
              -{promotion.discount}%
            </Text>
          </View>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={13}
            color="#9CA3AF"
          />
          <Text className="text-gray-400 text-xs ml-1">
            {promotion.until ? promotion.until.slice(0, 10) : "—"}
          </Text>
        </View>

        {promotion.description ? (
          <Text className="text-gray-400 text-xs mb-3" numberOfLines={1}>
            {promotion.description}
          </Text>
        ) : null}

        <View className="h-[1px] bg-gray-100 mb-2" />

        <View className="flex-row items-center justify-between">
          <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
            #{promotion.id.slice(-6).toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => onDelete?.(promotion.id)}
            activeOpacity={0.7}
            className="flex-row items-center bg-red-50 px-3 py-1 rounded-full"
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={13}
              color="#EF4444"
            />
            <Text className="text-red-400 text-[11px] font-bold ml-1">Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
