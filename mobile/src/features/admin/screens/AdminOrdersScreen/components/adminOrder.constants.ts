import { PackageStatusType } from "../../../../../services/api/package-api";

export interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  badgeColor: string;
}

export const STATUS_MAP: Record<string, StatusConfig> = {
  CONFIRMED: {
    label: "ĐÃ TIẾP NHẬN",
    bg: "bg-orange-50",
    text: "text-[#E07B39]",
    border: "border-orange-200",
    icon: "clipboard-check-outline",
    badgeColor: "#E07B39",
  },
  COOKING: {
    label: "ĐANG NẤU",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: "pot-steam-outline",
    badgeColor: "#D97706",
  },
  DELIVERING: {
    label: "ĐANG GIAO",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: "truck-delivery-outline",
    badgeColor: "#2563EB",
  },
  RECEIVED: {
    label: "ĐÃ GIAO HÀNG",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    icon: "package-variant-closed",
    badgeColor: "#7C3AED",
  },
  COMPLETED: {
    label: "HOÀN THÀNH",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: "check-decagram",
    badgeColor: "#059669",
  },
  CANCELED: {
    label: "ĐÃ HỦY",
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-200",
    icon: "close-circle-outline",
    badgeColor: "#EF4444",
  },
};

export interface NextActionConfig {
  nextStatus: PackageStatusType;
  nextLabel: string;
  icon: string;
  colors: [string, string];
}

export const NEXT_ACTION_MAP: Record<string, NextActionConfig> = {
  CONFIRMED: {
    nextStatus: "COOKING",
    nextLabel: "Bắt đầu nấu món",
    icon: "pot-steam-outline",
    colors: ["#F59E0B", "#D97706"],
  },
  COOKING: {
    nextStatus: "DELIVERING",
    nextLabel: "Bàn giao giao hàng",
    icon: "truck-delivery-outline",
    colors: ["#3B82F6", "#2563EB"],
  },
  DELIVERING: {
    nextStatus: "RECEIVED",
    nextLabel: "Xác nhận đã giao",
    icon: "package-variant-closed",
    colors: ["#8B5CF6", "#7C3AED"],
  },
  RECEIVED: {
    nextStatus: "COMPLETED",
    nextLabel: "Hoàn tất đơn hàng",
    icon: "check-decagram",
    colors: ["#10B981", "#059669"],
  },
};

export interface OrderItem {
  quantity: string | null;
  name: string;
}

// Hàm phân tích chuỗi món ăn từ description
export function parseOrderItems(description?: string): OrderItem[] {
  if (!description) return [];
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((item) => {
      const match = item.match(/^(\d+)\s*x\s*(.+)$/i);
      if (match) {
        return { quantity: match[1], name: match[2] };
      }
      return { quantity: null, name: item };
    });
}
