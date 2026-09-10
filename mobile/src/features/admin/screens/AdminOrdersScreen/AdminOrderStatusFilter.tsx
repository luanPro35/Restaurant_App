import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Package } from "../../../../services/api/package-api";

export const FILTER_TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "CONFIRMED", label: "Tiếp nhận" },
  { id: "COOKING", label: "Đang nấu" },
  { id: "DELIVERING", label: "Đang giao" },
  { id: "RECEIVED", label: "Đã giao" },
  { id: "COMPLETED", label: "Hoàn thành" },
  { id: "CANCELED", label: "Đã hủy" },
];

interface AdminOrderStatusFilterProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  packages: Package[];
}

export default function AdminOrderStatusFilter({
  activeTab,
  onSelectTab,
  packages,
}: AdminOrderStatusFilterProps) {
  // Đếm số lượng đơn theo từng trạng thái
  const countByStatus = (statusId: string) => {
    if (statusId === "ALL") return packages.length;
    if (statusId === "CONFIRMED") {
      return packages.filter(
        (p) => p.status === "CONFIRMED" || p.status === "PENDING"
      ).length;
    }
    return packages.filter((p) => p.status === statusId).length;
  };

  return (
    <View className="py-3 bg-[#FDFCF7]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = countByStatus(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2.5 border ${
                isActive
                  ? "bg-[#E07B39] border-[#E07B39]"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/30" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-black ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
