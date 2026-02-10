import { AdminTable } from "../types/admin.types";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/admin.utils";

export interface AdminTableCardProps {
  table: AdminTable;
  onEdit?: (table: AdminTable) => void;
  onDelete?: (table: AdminTable) => void;
  onToggleAvailability?: (id: string, isAvailable: boolean) => void;
}

export const AdminTableCard = ({
  table,
  onEdit,
  onDelete,
}: AdminTableCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "#10B981";
      case "occupied":
        return "#EF4444";
      default:
        return "#E07B39";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "Trống";
      case "occupied":
        return "Có khách";
      default:
        return status;
    }
  };

  return (
    <View
      className="bg-white rounded-[28px] mb-4 overflow-hidden border border-gray-100 shadow-sm w-[48%]"
      style={{ elevation: 3 }}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-50">
            <MaterialCommunityIcons
              name="table-chair"
              size={24}
              color={getStatusColor(table.status)}
            />
          </View>
          <View className="bg-gray-50 px-2 py-1 rounded-lg">
            <Text className="text-[10px] font-bold text-gray-500">
              {table.capacity} chỗ
            </Text>
          </View>
        </View>

        <Text className="text-gray-900 font-bold text-lg mb-1">
          {table.name}
        </Text>
        <View className="flex-row items-center mb-4">
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: getStatusColor(table.status) }}
          />
          <Text className="text-gray-500 text-xs font-medium">
            {getStatusText(table.status)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
          <TouchableOpacity
            onPress={() => onEdit?.(table)}
            className="p-2 bg-orange-50 rounded-lg"
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color="#E07B39"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete?.(table)}
            className="p-2 bg-red-50 rounded-lg"
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="#EF4444"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 bg-blue-50 rounded-lg"
            onPress={() => console.log("View detail")}
          >
            <MaterialCommunityIcons
              name="eye-outline"
              size={18}
              color="#3B82F6"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
