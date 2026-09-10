import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PackageStatusType } from "../../../services/api/package-api";

export const ALL_STATUSES: { id: PackageStatusType; label: string; icon: string; color: string }[] = [
  { id: "CONFIRMED", label: "ĐÃ TIẾP NHẬN", icon: "clipboard-check-outline", color: "#E07B39" },
  { id: "COOKING", label: "ĐANG NẤU", icon: "pot-steam-outline", color: "#F59E0B" },
  { id: "DELIVERING", label: "ĐANG GIAO HÀNG", icon: "truck-delivery-outline", color: "#3B82F6" },
  { id: "RECEIVED", label: "ĐÃ GIAO HÀNG", icon: "package-variant-closed", color: "#8B5CF6" },
  { id: "COMPLETED", label: "ĐÃ HOÀN THÀNH", icon: "check-decagram", color: "#10B981" },
  { id: "CANCELED", label: "ĐÃ HỦY ĐƠN", icon: "close-circle-outline", color: "#EF4444" },
];

interface PackageStatusModalProps {
  visible: boolean;
  currentStatus: string;
  packageId: string;
  onClose: () => void;
  onSelectStatus: (status: PackageStatusType) => void;
}

export default function PackageStatusModal({
  visible,
  currentStatus,
  packageId,
  onClose,
  onSelectStatus,
}: PackageStatusModalProps) {
  const shortId = (packageId || "").slice(-8).toUpperCase();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center px-6"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="w-full bg-white rounded-3xl p-5 shadow-2xl"
        >
          {/* Header Modal */}
          <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="order-bool-ascending-variant"
                size={22}
                color="#E07B39"
              />
              <Text className="text-base font-black text-gray-800 ml-2">
                Cập nhật trạng thái đơn
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-400 mb-3 font-medium">
            Chọn nấc trạng thái để cập nhật cho đơn hàng #{shortId}:
          </Text>

          {/* Danh sách 6 trạng thái */}
          {ALL_STATUSES.map((statusItem) => {
            const isSelected = currentStatus === statusItem.id;
            return (
              <TouchableOpacity
                key={statusItem.id}
                onPress={() => onSelectStatus(statusItem.id)}
                activeOpacity={0.7}
                className={`flex-row items-center p-3 rounded-2xl mb-2 border ${
                  isSelected
                    ? "bg-orange-50 border-orange-300"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${statusItem.color}20` }}
                >
                  <MaterialCommunityIcons
                    name={statusItem.icon as any}
                    size={18}
                    color={statusItem.color}
                  />
                </View>
                <Text
                  className={`flex-1 text-xs font-black uppercase ${
                    isSelected ? "text-[#E07B39]" : "text-gray-700"
                  }`}
                >
                  {statusItem.label}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#E07B39"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
