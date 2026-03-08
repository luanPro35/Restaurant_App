import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { packageApi, Package } from "../../../services/api/package-api";

interface PackageItemProps {
  pack: Package;
  onRefresh?: () => void;
}

const STEPS = [
  { id: "PENDING", title: "Đang trên đường", icon: "clock-outline" },
  { id: "CONFIRMED", title: "Đã giao hàng", icon: "package-variant" }
];

export default function PackageItem({
  pack,
  onRefresh,
}: PackageItemProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (pack.status === "CONFIRMED" || loading) return;
    
    setLoading(true);
    try {
      await packageApi.update(pack.id, { status: "CONFIRMED" });
      onRefresh?.();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setLoading(false);
    }
  };

  const isConfirmed = pack.status === "CONFIRMED";
  const currentStepIndex = isConfirmed ? 1 : 0;

  return (
    <View className="bg-white rounded-2xl mx-4 mb-4 shadow-lg elevation-4 overflow-hidden border border-gray-100">
      <View className="flex-row justify-center gap-x-16 py-6">
        {STEPS.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <View
              key={step.id}
              className="items-center"
              style={{ width: 80 }}
            >
              <View
                className={`w-10 h-10 rounded-full justify-center items-center mb-2 z-10 ${isActive ? "bg-[#E07B39]" : "bg-gray-200"} ${isCurrent ? "border-4 border-[#FFDbb5]" : ""}`}
              >
                <MaterialCommunityIcons
                  name={step.icon as any}
                  size={18}
                  color={isActive ? "white" : "#9ca3af"}
                />
              </View>
              <Text
                className={`text-[12px] font-bold text-center mb-1 ${isActive ? "text-[#E07B39]" : "text-gray-400"}`}
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        onPress={handleComplete} 
        disabled={isConfirmed || loading}
        className={`w-full h-12 justify-center items-center ${isConfirmed ? "bg-green-500" : "bg-[#E07B39]"}`}
      >
        <Text className="text-white text-lg font-bold">
          {loading ? "Đang xử lý..." : isConfirmed ? "Đã giao hàng" : "Hoàn thành"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}