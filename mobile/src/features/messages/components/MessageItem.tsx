import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MessageItemProps {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "promotion" | "system" | "order";
  isRead?: boolean;
  onPress: () => void;
}

export default function MessageItem({
  title,
  description,
  time,
  type,
  isRead = false,
  onPress,
}: MessageItemProps) {
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
        return "#E07B39"; // Orange for promo
      case "order":
        return "#4CAF50"; // Green for order
      default:
        return "#3B82F6"; // Blue for system
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
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
                : "font-extrabold text-[#E07B39]"
            }`}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">{time}</Text>
        </View>
        <Text
          className={`text-sm ${isRead ? "text-gray-500" : "text-gray-800"}`}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
      {!isRead && (
        <View className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </TouchableOpacity>
  );
}
