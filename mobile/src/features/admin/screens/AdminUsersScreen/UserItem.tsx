import { AdminUser, UserRole } from "../../types/admin-user.types";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface UserItemProps {
  user: AdminUser;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (user: AdminUser) => void;
}

export const UserItem = ({ user, onEdit, onDelete }: UserItemProps) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Quản trị";
      default:
        return "Người dùng";
    }
  };

  return (
    <View
      className="bg-white rounded-3xl mb-4 p-4 flex-row items-center border border-gray-100 shadow-sm"
      style={{ elevation: 2 }}
    >
      <View className="w-12 h-12 rounded-2xl items-center justify-center bg-gray-50 mr-4">
        <MaterialCommunityIcons
          name="account-outline"
          size={28}
          color="#374151"
        />
      </View>

      <View className="flex-1">
        <Text
          className="text-gray-900 font-bold text-base mb-1"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <Text className="text-gray-500 text-xs mb-2" numberOfLines={1}>
          {user.email}
        </Text>

        <View className="flex-row">
          <View
            className="px-2 py-0.5 rounded-lg flex-row items-center"
            style={{ backgroundColor: `${getRoleColor(user.role)}15` }}
          >
            <View
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: getRoleColor(user.role) }}
            />
            <Text
              className="text-[10px] font-bold"
              style={{ color: getRoleColor(user.role) }}
            >
              {getRoleLabel(user.role)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onEdit?.(user)}
          className="p-2 bg-orange-50 rounded-xl mr-2"
        >
          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color="#E07B39"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete?.(user)}
          className="p-2 bg-red-50 rounded-xl"
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color="#EF4444"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
