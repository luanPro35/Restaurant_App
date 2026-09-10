import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PACKAGE_STEPS } from "./PackageProgressStep";

export const STATUS_CONFIG: Record<
  string,
  { desc: string; icon: string; color: string; badgeText: string; gradientColors: [string, string] }
> = {
  CONFIRMED: {
    desc: "Nhà hàng đã tiếp nhận đơn và đang chuẩn bị nguyên liệu.",
    icon: "clock-check-outline",
    color: "#E07B39",
    badgeText: "Đã tiếp nhận đơn hàng",
    gradientColors: ["#E07B39", "#C96A2E"],
  },
  COOKING: {
    desc: "Đầu bếp đang chế biến các món ăn nóng hổi cho bạn.",
    icon: "chef-hat",
    color: "#F59E0B",
    badgeText: "Bếp đang nấu món...",
    gradientColors: ["#F59E0B", "#D97706"],
  },
  DELIVERING: {
    desc: "Tài xế đang giao đơn hàng đến địa chỉ của bạn.",
    icon: "moped-outline",
    color: "#3B82F6",
    badgeText: "Đang giao hàng tới bạn",
    gradientColors: ["#3B82F6", "#2563EB"],
  },
  RECEIVED: {
    desc: "Đơn hàng đã được giao đến nơi. Chúc bạn ngon miệng!",
    icon: "gift-outline",
    color: "#8B5CF6",
    badgeText: "Đã giao hàng thành công",
    gradientColors: ["#8B5CF6", "#7C3AED"],
  },
  COMPLETED: {
    desc: "Đơn hàng đã hoàn tất thành công. Cảm ơn bạn đã ủng hộ!",
    icon: "check-circle-outline",
    color: "#10B981",
    badgeText: "Đơn hàng đã hoàn thành",
    gradientColors: ["#10B981", "#059669"],
  },
  CANCELED: {
    desc: "Đơn hàng này đã bị hủy.",
    icon: "close-circle-outline",
    color: "#EF4444",
    badgeText: "Đơn hàng đã bị hủy",
    gradientColors: ["#9CA3AF", "#6B7280"],
  },
};

interface PackageStatusCardProps {
  status: string;
  isAdminOrStaff: boolean;
  loading: boolean;
  onOpenStatusModal: () => void;
  onNextStep: () => void;
}

export default function PackageStatusCard({
  status,
  isAdminOrStaff,
  loading,
  onOpenStatusModal,
  onNextStep,
}: PackageStatusCardProps) {
  const statusKey = (status === "PENDING" ? "CONFIRMED" : status) || "CONFIRMED";
  const isCanceled = statusKey === "CANCELED";
  const stepOrder = ["CONFIRMED", "COOKING", "DELIVERING", "RECEIVED", "COMPLETED"];
  const currentStepIndex = isCanceled ? -1 : Math.max(0, stepOrder.indexOf(statusKey));
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.CONFIRMED;

  return (
    <View className="mx-4 mb-4">
      {/* Hộp mô tả trạng thái đơn hàng */}
      <View className="mb-3 p-3.5 bg-orange-50/60 rounded-2xl border border-orange-100 flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-3 shadow-xs">
          <MaterialCommunityIcons name={config.icon as any} size={18} color={config.color} />
        </View>
        <Text className="flex-1 text-xs text-gray-700 font-medium leading-4">
          {config.desc}
        </Text>
      </View>

      {/* Hiển thị nút bấm / Banner trạng thái */}
      {isAdminOrStaff ? (
        /* Giao diện dành riêng cho Admin / Nhân viên: Có quyền chuyển trạng thái */
        <View>
          <View className="flex-row items-center justify-between mb-2 px-1">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="shield-account" size={14} color="#E07B39" />
              <Text className="text-[11px] font-bold text-gray-500 ml-1">
                Quyền Nhân viên / Quản lý
              </Text>
            </View>
            <TouchableOpacity
              onPress={onOpenStatusModal}
              className="flex-row items-center"
            >
              <Text className="text-[11px] font-black text-[#E07B39] mr-0.5">
                Chọn trạng thái
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={14} color="#E07B39" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={currentStepIndex < stepOrder.length - 1 && !isCanceled ? onNextStep : onOpenStatusModal}
            disabled={loading}
            activeOpacity={0.8}
            className="overflow-hidden rounded-2xl shadow-sm"
          >
            <LinearGradient
              colors={config.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="update"
                    size={18}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                    numberOfLines={1}
                  >
                    {isCanceled
                      ? "Đổi trạng thái đơn hủy"
                      : currentStepIndex < stepOrder.length - 1
                      ? `Chuyển sang: ${PACKAGE_STEPS[currentStepIndex + 1]?.title}`
                      : "Cập nhật trạng thái đơn"}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        /* Giao diện dành cho Khách hàng (USER): Hiển thị Banner trạng thái nổi bật (Read-Only) */
        <View className="overflow-hidden rounded-2xl shadow-xs">
          <LinearGradient
            colors={config.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 48,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              opacity: 0.95,
            }}
          >
            <MaterialCommunityIcons
              name={config.icon as any}
              size={18}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 12.5,
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
              numberOfLines={1}
            >
              {config.badgeText}
            </Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}
