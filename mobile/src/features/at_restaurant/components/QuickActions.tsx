import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ActionButton {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

export interface QuickActionsProps {
  onRequestBill?: () => void;
}

export default function QuickActions({
  onRequestBill,
}: QuickActionsProps) {
  const actions: ActionButton[] = [
    {
      icon: "receipt",
      label: "Yêu cầu bill",
      color: "#10B981",
      onPress() {
        onRequestBill?.();
      },
    },
  ];

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mx-4 mb-4">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Thao tác nhanh
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={action.onPress}
            activeOpacity={0.7}
            className="items-center mr-4"
            style={{ width: 80 }}
          >
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center shadow-sm"
              style={{ backgroundColor: action.color }}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={28}
                color="white"
              />
            </View>
            <Text className="text-xs text-gray-700 mt-2 text-center">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
