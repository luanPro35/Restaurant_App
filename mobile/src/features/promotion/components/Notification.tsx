import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminNotification } from "@/services/api/admin-notification";

interface NotificationProps {
  item: AdminNotification;
  onPress?: (id: string) => void;
}

const RANDOM_ICONS = [
  { name: "bell-outline", color: "#E91E63" },
  { name: "ticket-percent-outline", color: "#FF9800" },
  { name: "bullhorn-outline", color: "#2196F3" },
  { name: "star-outline", color: "#FFC107" },
  { name: "information-outline", color: "#607D8B" },
  { name: "tag-outline", color: "#4CAF50" },
];

export default function Notification({ item, onPress }: NotificationProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Vừa xong";
      if (minutes < 60) return `${minutes} phút trước`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} giờ trước`;

      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  };

  const iconConfig = useMemo(() => {
    const index =
      (item.id.length + (item.title?.length || 0)) % RANDOM_ICONS.length;
    return RANDOM_ICONS[index];
  }, [item.id, item.title]);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.7}
      className="flex-row p-4 border-b border-gray-100 items-start bg-white"
    >
      <View
        className="w-12 h-12 rounded-full justify-center items-center mr-4"
        style={{ backgroundColor: `${iconConfig.color}15` }}
      >
        <MaterialCommunityIcons
          name={iconConfig.name as any}
          size={24}
          color={iconConfig.color}
        />
      </View>

      <View className="flex-1">
        <Text
          className="text-[15px] font-bold text-[#2D2D2D] mb-1 leading-5"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text
          className="text-sm text-gray-500 mb-2 leading-5"
          numberOfLines={2}
        >
          {item.content || item.description || "Bấm để xem chi tiết"}
        </Text>

        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color="#9CA3AF"
          />
          <Text className="text-[11px] text-gray-400 ml-1">
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
