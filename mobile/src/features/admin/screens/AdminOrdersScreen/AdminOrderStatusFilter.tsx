import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Package } from "../../../../services/api/package-api";

export const FILTER_TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xác nhận" },
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

function AdminOrderStatusFilter({
  activeTab,
  onSelectTab,
  packages,
}: AdminOrderStatusFilterProps) {
  // Đếm số lượng đơn theo từng trạng thái trong một lượt duyệt duy nhất O(N)
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: packages.length,
      PENDING: 0,
      CONFIRMED: 0,
      COOKING: 0,
      DELIVERING: 0,
      RECEIVED: 0,
      COMPLETED: 0,
      CANCELED: 0,
    };

    for (let i = 0; i < packages.length; i++) {
      const status = packages[i]?.status;
      if (status === "PENDING") {
        counts.PENDING++;
      } else if (status === "CONFIRMED") {
        counts.CONFIRMED++;
      } else if (status && counts[status] !== undefined) {
        counts[status]++;
      }
    }

    return counts;
  }, [packages]);

  return (
    <View className="py-3 bg-[#FDFCF7]">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = statusCounts[tab.id] || 0;

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

export default React.memo(AdminOrderStatusFilter);
