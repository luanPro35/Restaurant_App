import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminNotification } from "@/services/api/admin-notification";

interface DetailNotificationProps {
  item: AdminNotification;
  onClose?: () => void;
}

export default function DetailNotification({
  item,
  onClose,
}: DetailNotificationProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
        <Text className="text-xl font-bold text-[#2D2D2D]">Thông báo</Text>
        <TouchableOpacity
          onPress={onClose}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-[#E91E6310] items-center justify-center">
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={40}
              color="#E91E63"
            />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-2xl font-bold text-[#1A1A1A] mb-3 leading-9">
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#9CA3AF"
            />
            <Text className="text-sm text-gray-400 ml-1.5 font-medium">
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>

        <View className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <Text className="text-[16px] text-[#4A4A4A] leading-7 font-normal">
            {item.content || item.description}
          </Text>
        </View>

        <View className="mt-12 items-center">
          <View className="w-12 h-1 bg-gray-100 rounded-full mb-4" />
          <Text className="text-xs text-gray-300">
            Res Booking Notification System
          </Text>
        </View>
      </ScrollView>

      <View className="p-6 border-t border-gray-50">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.8}
          className="bg-[#E91E63] py-4 rounded-2xl items-center shadow-sm shadow-[#E91E63]"
        >
          <Text className="text-white font-bold text-lg">Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
