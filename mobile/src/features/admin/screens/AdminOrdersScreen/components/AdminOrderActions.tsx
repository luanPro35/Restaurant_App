import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NextActionConfig } from "./adminOrder.constants";
import { PackageStatusType } from "../../../../../services/api/package-api";

interface AdminOrderActionsProps {
  nextAction?: NextActionConfig;
  isUpdating: boolean;
  isCompleted: boolean;
  isCanceled: boolean;
  onNextStep: (status: PackageStatusType) => void;
  onOpenModal: () => void;
  onCancel: () => void;
}

export default function AdminOrderActions({
  nextAction,
  isUpdating,
  isCompleted,
  isCanceled,
  onNextStep,
  onOpenModal,
  onCancel,
}: AdminOrderActionsProps) {
  return (
    <View>
      {/* Tầng 1: Nút bấm chuyển nhanh sang nấc tiếp theo (To, Rõ ràng, Nổi bật) */}
      {nextAction && (
        <TouchableOpacity
          onPress={() => onNextStep(nextAction.nextStatus)}
          disabled={isUpdating}
          activeOpacity={0.85}
          className="rounded-2xl overflow-hidden mb-2.5 shadow-sm"
          style={{ elevation: 2 }}
        >
          <LinearGradient
            colors={nextAction.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-3 px-4 flex-row items-center justify-center"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name={nextAction.icon as any} size={18} color="white" />
                <Text className="text-white font-black text-xs uppercase tracking-wider ml-2">
                  {nextAction.nextLabel}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color="rgba(255, 255, 255, 0.8)"
                  style={{ marginLeft: 4 }}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Tầng 2: Hàng nút phụ - Đổi trạng thái & Hủy đơn */}
      <View className="flex-row items-center justify-between">
        {/* Nút chọn trạng thái linh hoạt qua Modal */}
        <TouchableOpacity
          onPress={onOpenModal}
          disabled={isUpdating}
          activeOpacity={0.7}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100/90 mr-2 flex-row items-center justify-center border border-gray-200/70"
        >
          <MaterialCommunityIcons name="tune-variant" size={15} color="#4B5563" />
          <Text className="text-gray-700 font-bold text-xs ml-1.5">
            Đổi trạng thái khác
          </Text>
        </TouchableOpacity>

        {/* Nút Hủy đơn */}
        {!isCompleted && !isCanceled && (
          <TouchableOpacity
            onPress={onCancel}
            disabled={isUpdating}
            activeOpacity={0.7}
            className="py-2.5 px-4 rounded-xl bg-red-50 border border-red-200/80 flex-row items-center justify-center"
          >
            <MaterialCommunityIcons name="close-circle-outline" size={15} color="#EF4444" />
            <Text className="text-red-500 font-bold text-xs ml-1">
              Hủy đơn
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Thông báo kết thúc nếu đơn đã COMPLETED hoặc CANCELED */}
      {isCompleted && (
        <View className="mt-2 flex-row items-center justify-center py-1">
          <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
          <Text className="text-emerald-600 font-bold text-[11px] ml-1">
            Đơn hàng đã hoàn thành trọn vẹn
          </Text>
        </View>
      )}
      {isCanceled && (
        <View className="mt-2 flex-row items-center justify-center py-1">
          <MaterialCommunityIcons name="alert-circle-outline" size={14} color="#EF4444" />
          <Text className="text-red-500 font-bold text-[11px] ml-1">
            Đơn hàng này đã bị hủy
          </Text>
        </View>
      )}
    </View>
  );
}
