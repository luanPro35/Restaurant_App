import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PaymentMethodItemProps {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isSelected?: boolean;
  onPress: () => void;
}

export default function PaymentMethodItem({
  name,
  icon,
  description,
  isSelected,
  onPress,
}: PaymentMethodItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 mb-3 rounded-2xl border ${
        isSelected
          ? "bg-orange-50 border-[#E07B39]"
          : "bg-white border-gray-100"
      } shadow-sm`}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
          isSelected ? "bg-white" : "bg-gray-50"
        }`}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={isSelected ? "#E07B39" : "#6B7280"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-bold text-base ${
            isSelected ? "text-[#E07B39]" : "text-gray-800"
          }`}
        >
          {name}
        </Text>
        {description && (
          <Text className="text-gray-500 text-xs mt-0.5">{description}</Text>
        )}
      </View>
      <View
        className={`w-5 h-5 rounded-full border items-center justify-center ${
          isSelected ? "border-[#E07B39] bg-[#E07B39]" : "border-gray-300"
        }`}
      >
        {isSelected && (
          <MaterialCommunityIcons name="check" size={14} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}
