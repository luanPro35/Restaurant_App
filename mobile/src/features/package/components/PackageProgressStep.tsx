import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const PACKAGE_STEPS = [
  { id: "CONFIRMED", title: "Tiếp nhận", icon: "clipboard-check-outline" },
  { id: "COOKING", title: "Đang nấu", icon: "pot-steam-outline" },
  { id: "DELIVERING", title: "Đang giao", icon: "truck-delivery-outline" },
  { id: "RECEIVED", title: "Đã giao", icon: "package-variant-closed" },
  { id: "COMPLETED", title: "Hoàn thành", icon: "check-decagram" },
];

interface PackageProgressStepProps {
  status: string;
}

export default function PackageProgressStep({ status }: PackageProgressStepProps) {
  const statusKey = (status === "PENDING" ? "CONFIRMED" : status) || "CONFIRMED";
  const isCanceled = statusKey === "CANCELED";

  const stepOrder = ["CONFIRMED", "COOKING", "DELIVERING", "RECEIVED", "COMPLETED"];
  const currentStepIndex = isCanceled ? -1 : Math.max(0, stepOrder.indexOf(statusKey));

  // Tỷ lệ % thanh tiến trình từ bước 0 đến bước 4
  const progressPercent = isCanceled
    ? 0
    : (currentStepIndex / (PACKAGE_STEPS.length - 1)) * 100;

  if (isCanceled) {
    return (
      <View className="py-6 px-6 items-center justify-center">
        <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-2 border border-red-100">
          <MaterialCommunityIcons name="close-circle-outline" size={32} color="#EF4444" />
        </View>
        <Text className="text-sm font-black text-red-500 uppercase tracking-wider">
          Đơn hàng đã bị hủy
        </Text>
      </View>
    );
  }

  return (
    <View className="py-6 px-2">
      <View className="relative flex-row justify-between items-center px-3">
        {/* Đường nối xám nền */}
        <View
          className="absolute bg-gray-200"
          style={{
            top: 18,
            left: 36,
            right: 36,
            height: 3,
            borderRadius: 2,
          }}
        />
        {/* Đường nối cam tiến trình đã hoàn thành */}
        <View
          className="absolute bg-[#E07B39]"
          style={{
            top: 18,
            left: 36,
            width: `${progressPercent * 0.78}%`,
            height: 3,
            borderRadius: 2,
          }}
        />

        {PACKAGE_STEPS.map((step, index) => {
          const isPast = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isActive = index <= currentStepIndex;

          return (
            <View key={step.id} className="flex-1 items-center px-0.5">
              <View
                className={`w-9 h-9 rounded-full justify-center items-center mb-1.5 shadow-sm z-10 ${
                  isActive
                    ? "bg-[#E07B39]"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <MaterialCommunityIcons
                  name={(isPast ? "check" : step.icon) as any}
                  size={18}
                  color={isActive ? "white" : "#94a3b8"}
                />
                {isCurrent && (
                  <View className="absolute -inset-1 rounded-full border-2 border-[#E07B39]/30" />
                )}
              </View>
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 11,
                  color: isActive ? "#E07B39" : "#9ca3af",
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
