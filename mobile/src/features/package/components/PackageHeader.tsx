import React from "react";
import { View, Text } from "react-native";
import { formatCurrency } from "../../../shared/utils";
import { Package } from "../../../services/api/package-api";

interface PackageHeaderProps {
  pack: Package;
}

export default function PackageHeader({ pack }: PackageHeaderProps) {
  const shortId = (pack.id || "").slice(-8).toUpperCase();

  return (
    <View className="flex-row justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
      <View>
        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Mã đơn hàng
        </Text>
        <Text className="text-sm font-black text-slate-800">
          #{shortId}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">
          Tổng thanh toán
        </Text>
        <Text className="text-base font-black text-[#E07B39]">
          {formatCurrency(pack.price || 0)}
        </Text>
      </View>
    </View>
  );
}
