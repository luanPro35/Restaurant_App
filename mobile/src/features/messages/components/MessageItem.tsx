import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminNotification } from "@/services/api/admin-notification";

interface MessageItemProps {
  notification: AdminNotification;
  onPress: (id: string) => void;
}

export default function MessageItem({
  notification,
  onPress,
}: MessageItemProps) {
  const isRead = (notification as any).isRead ?? false;
  const type = (notification as any).type || "system";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getIcon = () => {
    switch (type) {
      case "promotion":
        return "ticket-percent";
      case "order":
        return "food";
      case "system":
      default:
        return "bell";
    }
  };

  const getColor = () => {
    switch (type) {
      case "promotion":
        return "#E07B39";
      case "order":
        return "#4CAF50";
      default:
        return "#3B82F6";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(notification.id)}
      activeOpacity={0.7}
      className={`flex-row p-4 mb-3 rounded-2xl border ${
        isRead ? "bg-white border-gray-100" : "bg-orange-50 border-orange-100"
      } shadow-sm`}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${getColor()}15` }}
      >
        <MaterialCommunityIcons name={getIcon()} size={24} color={getColor()} />
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row justify-between items-start mb-1">
          <Text
            className={`text-base flex-1 mr-2 ${
              isRead
                ? "font-bold text-gray-800"
                : "font-extrabold text-[#2D2D2D]"
            }`}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {formatDate(notification.createdAt)}
          </Text>
        </View>
        <Text
          className={`text-sm ${isRead ? "text-gray-500" : "text-gray-800"}`}
          numberOfLines={2}
        >
          {notification.description || notification.content}
        </Text>
      </View>

      {!isRead && (
        <View className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </TouchableOpacity>
  );
}
