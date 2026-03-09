import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "../../../shared/utils";

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
    <View className="bg-white rounded-3xl mx-4 mb-6 shadow-xl elevation-5 overflow-hidden border border-gray-50">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-50 bg-gray-50/30">
        <View>
          <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mã đơn hàng</Text>
          <Text className="text-sm font-black text-slate-800">#{pack.id.slice(-8).toUpperCase()}</Text>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Tổng thanh toán</Text>
          <Text className="text-base font-black text-[#E07B39]">{formatCurrency(pack.price)}</Text>
        </View>
      </View>

      <View className="py-8 px-10 relative">
        <View
          className="absolute bg-gray-100"
          style={{ top: 55, left: 70, right: 70, height: 2 }}
        />
        <View
          className="absolute bg-[#E07B39]"
          style={{ top: 55, left: 70, width: isConfirmed ? '62%' : 0, height: 2 }}
        />

        <View className="flex-row justify-between relative">
          {STEPS.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <View
                key={step.id}
                className="items-center"
                style={{ width: 85 }}
              >
                <View
                  className={`w-12 h-12 rounded-full justify-center items-center mb-2 shadow-sm z-10 
                    ${isActive ? "bg-[#E07B39]" : "bg-white border-2 border-gray-100"}`}
                >
                  <MaterialCommunityIcons
                    name={step.icon as any}
                    size={22}
                    color={isActive ? "white" : "#94a3b8"}
                  />
                  {isCurrent && !isConfirmed && (
                    <View className="absolute -inset-1 rounded-full border-2 border-[#E07B39]/20" />
                  )}
                </View>
                <Text
                  className={`text-[10px] font-black uppercase tracking-tighter text-center leading-tight
                    ${isActive ? "text-[#E07B39]" : "text-gray-400"}`}
                  numberOfLines={2}
                >
                  {step.title}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleComplete}
        disabled={isConfirmed || loading}
        activeOpacity={0.8}
        className="mx-4 mb-4 overflow-hidden rounded-2xl"
      >
        <LinearGradient
          colors={isConfirmed ? ["#10B981", "#059669"] : ["#E91E63", "#E07B39"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}
        >
          {isConfirmed && (
            <MaterialCommunityIcons name="check-decagram" size={20} color="white" style={{ marginRight: 8 }} />
          )}
          <Text
            style={{ color: 'white', fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {loading ? "Đang xử lý..." : isConfirmed ? "Giao hàng thành công" : "Xác nhận đã nhận hàng"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}