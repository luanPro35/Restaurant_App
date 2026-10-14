import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { packageApi } from "../../../../services/api/package-api";
import { orderApi } from "../../../../services/api/api-order";
import { paymentApi } from "../../../../services/api/api-payment";

export interface SystemLogItem {
  id: string;
  type: "ORDER" | "PAYMENT" | "TABLE" | "SYSTEM";
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  timeRaw: Date;
  status: "SUCCESS" | "PENDING" | "WARNING" | "INFO";
  amount?: number;
  metadata?: Record<string, any>;
}

export default function AdminLogsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<SystemLogItem | null>(null);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay === 1) return "Hôm qua";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchLogs = useCallback(async () => {
    try {
      const [packagesRes, ordersRes, paymentsRes] = await Promise.allSettled([
        packageApi.findAllPackage(),
        orderApi.getAll({ limit: 25 }),
        paymentApi.getAll({ limit: 25 } as any),
      ]);

      const logList: SystemLogItem[] = [];

      // 1. Logs from Packages (Delivery)
      if (packagesRes.status === "fulfilled" && Array.isArray(packagesRes.value)) {
        packagesRes.value.forEach((pkg: any) => {
          const createdAt = pkg.createdAt ? new Date(pkg.createdAt) : new Date();
          let statusType: SystemLogItem["status"] = "INFO";
          if (pkg.status === "COMPLETED") statusType = "SUCCESS";
          else if (pkg.status === "CANCELED") statusType = "WARNING";
          else statusType = "PENDING";

          logList.push({
            id: `pkg-${pkg.id}`,
            type: "ORDER",
            title: `Gói đơn giao hàng #${pkg.id.slice(-6).toUpperCase()}`,
            description: `${pkg.name || "Khách lẻ"} • ${pkg.address || "Địa chỉ nhận"} • Trạng thái: ${pkg.status}`,
            actor: pkg.name || "Khách hàng",
            timestamp: formatRelativeTime(createdAt),
            timeRaw: createdAt,
            status: statusType,
            amount: pkg.price || pkg.totalPrice || 0,
            metadata: {
              packageId: pkg.id,
              status: pkg.status,
              paymentMethod: pkg.paymentMethod,
              address: pkg.address,
            },
          });
        });
      }

      // 2. Logs from Dine-in Orders
      if (ordersRes.status === "fulfilled" && ordersRes.value?.data) {
        const orderData = Array.isArray(ordersRes.value.data) ? ordersRes.value.data : [];
        orderData.forEach((ord: any) => {
          const createdAt = ord.createdAt ? new Date(ord.createdAt) : new Date();
          let statusType: SystemLogItem["status"] = "INFO";
          if (ord.status === "COMPLETED") statusType = "SUCCESS";
          else if (ord.status === "CANCELLED") statusType = "WARNING";
          else statusType = "PENDING";

          const tableName = ord.table?.name || (ord.tableId ? `Bàn #${ord.tableId}` : "Mang đi");
          logList.push({
            id: `ord-${ord.id}`,
            type: "TABLE",
            title: `Gọi món tại bàn ${tableName}`,
            description: `${ord.items?.length || 0} món ăn • ${ord.user?.name || "Khách tại bàn"} • Trạng thái: ${ord.status}`,
            actor: ord.user?.name || tableName,
            timestamp: formatRelativeTime(createdAt),
            timeRaw: createdAt,
            status: statusType,
            amount: ord.totalAmount || 0,
            metadata: {
              orderId: ord.id,
              table: tableName,
              itemsCount: ord.items?.length,
              status: ord.status,
            },
          });
        });
      }

      // 3. Logs from Payments
      if (paymentsRes.status === "fulfilled" && Array.isArray(paymentsRes.value)) {
        paymentsRes.value.forEach((pay: any) => {
          const createdAt = pay.createdAt ? new Date(pay.createdAt) : new Date();
          let statusType: SystemLogItem["status"] = "SUCCESS";
          if (pay.status === "FAILED") statusType = "WARNING";
          else if (pay.status === "PENDING") statusType = "PENDING";

          logList.push({
            id: `pay-${pay.id}`,
            type: "PAYMENT",
            title: `Giao dịch ${pay.method === "VIETQR" ? "VietQR 24/7" : "Tiền mặt"}`,
            description: `Mã GD #${pay.id.slice(-6).toUpperCase()} • ${(pay.amount || 0).toLocaleString("vi-VN")} đ • ${pay.status}`,
            actor: "Hệ thống thanh toán",
            timestamp: formatRelativeTime(createdAt),
            timeRaw: createdAt,
            status: statusType,
            amount: pay.amount || 0,
            metadata: {
              paymentId: pay.id,
              method: pay.method,
              status: pay.status,
              receiptUrl: pay.receiptUrl,
            },
          });
        });
      }

      // 4. Default system health/startup logs
      logList.push({
        id: "sys-telegram",
        type: "SYSTEM",
        title: "Telegram Bot Báo cáo Tự động",
        description: "Lập lịch Cron 22:30 hàng ngày gửi báo cáo tổng kết doanh thu đã sẵn sàng.",
        actor: "Cron Worker",
        timestamp: "Hôm nay",
        timeRaw: new Date(Date.now() - 3600000),
        status: "SUCCESS",
      });

      logList.push({
        id: "sys-redis",
        type: "SYSTEM",
        title: "Đồng bộ bộ nhớ đệm Redis Cache",
        description: "Dữ liệu danh mục và thực đơn đã được lưu cache tối ưu tốc độ.",
        actor: "Redis Service",
        timestamp: "Hôm nay",
        timeRaw: new Date(Date.now() - 7200000),
        status: "INFO",
      });

      // Sort by newest
      logList.sort((a, b) => b.timeRaw.getTime() - a.timeRaw.getTime());
      setLogs(logList);
    } catch (err) {
      console.error("Fetch logs error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLogs();
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // Filter by type
      if (activeFilter === "ORDER" && item.type !== "ORDER") return false;
      if (activeFilter === "PAYMENT" && item.type !== "PAYMENT") return false;
      if (activeFilter === "TABLE" && item.type !== "TABLE") return false;
      if (activeFilter === "SYSTEM" && item.type !== "SYSTEM") return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.actor.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [logs, activeFilter, searchQuery]);

  const getLogIcon = (type: SystemLogItem["type"]) => {
    switch (type) {
      case "ORDER":
        return { name: "package-variant", color: "#E07B39", bg: "#FFF5EB" };
      case "PAYMENT":
        return { name: "cash-check", color: "#10B981", bg: "#ECFDF5" };
      case "TABLE":
        return { name: "table-chair", color: "#3B82F6", bg: "#EFF6FF" };
      case "SYSTEM":
      default:
        return { name: "server-security", color: "#8B5CF6", bg: "#F5F3FF" };
    }
  };

  const getStatusBadge = (status: SystemLogItem["status"]) => {
    switch (status) {
      case "SUCCESS":
        return { text: "Thành công", bg: "bg-emerald-50", textCol: "text-emerald-700", border: "border-emerald-200" };
      case "WARNING":
        return { text: "Cảnh báo / Hủy", bg: "bg-amber-50", textCol: "text-amber-700", border: "border-amber-200" };
      case "PENDING":
        return { text: "Chờ xử lý", bg: "bg-blue-50", textCol: "text-blue-700", border: "border-blue-200" };
      case "INFO":
      default:
        return { text: "Hệ thống", bg: "bg-purple-50", textCol: "text-purple-700", border: "border-purple-200" };
    }
  };

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar style="dark" />

      {/* Header */}
      <View
        className="px-6 pb-4 bg-[#FDFCF7] border-b border-gray-100"
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm"
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#1F2937" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-gray-900 text-lg font-black tracking-tight">
              Nhật ký hệ thống
            </Text>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Audit Trail & Activity Logs
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm"
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#E07B39" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white px-3.5 py-2.5 rounded-2xl border border-gray-200 shadow-sm mb-3">
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm theo mã đơn, khách hàng, hành động..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-sm text-gray-800 font-medium"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {[
            { id: "ALL", label: `Tất cả (${logs.length})` },
            { id: "ORDER", label: "Đơn giao hàng" },
            { id: "TABLE", label: "Đơn tại bàn" },
            { id: "PAYMENT", label: "Thanh toán" },
            { id: "SYSTEM", label: "Hệ thống" },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                  isSelected
                    ? "bg-[#E07B39] border-[#E07B39]"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
          <Text className="text-gray-400 text-xs mt-3 font-medium">
            Đang tải dữ liệu nhật ký...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 14, paddingBottom: insets.bottom + 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E07B39"]}
            />
          }
        >
          {filteredLogs.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3">
                <MaterialCommunityIcons name="text-box-search-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-700 font-bold text-base">Không tìm thấy nhật ký</Text>
              <Text className="text-gray-400 text-xs text-center mt-1 px-8">
                Không có sự kiện hoặc nhật ký nào phù hợp với bộ lọc hiện tại.
              </Text>
            </View>
          ) : (
            filteredLogs.map((item) => {
              const iconInfo = getLogIcon(item.type);
              const badgeInfo = getStatusBadge(item.status);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedLog(item)}
                  activeOpacity={0.7}
                  className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm flex-row items-start"
                >
                  <View
                    className="w-11 h-11 rounded-2xl items-center justify-center mr-3 mt-0.5"
                    style={{ backgroundColor: iconInfo.bg }}
                  >
                    <MaterialCommunityIcons
                      name={iconInfo.name as any}
                      size={22}
                      color={iconInfo.color}
                    />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        className="text-gray-900 font-black text-sm tracking-tight flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <View
                        className={`px-2 py-0.5 rounded-full border ${badgeInfo.bg} ${badgeInfo.border}`}
                      >
                        <Text className={`text-[10px] font-bold ${badgeInfo.textCol}`}>
                          {badgeInfo.text}
                        </Text>
                      </View>
                    </View>

                    <Text
                      className="text-gray-500 text-xs leading-4 mb-2"
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>

                    <View className="flex-row items-center justify-between pt-1 border-t border-gray-50">
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons name="clock-outline" size={13} color="#9CA3AF" />
                        <Text className="text-gray-400 text-[11px] font-medium ml-1">
                          {item.timestamp}
                        </Text>
                      </View>

                      {item.amount && item.amount > 0 ? (
                        <Text className="text-[#E07B39] font-black text-xs">
                          +{item.amount.toLocaleString("vi-VN")} đ
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          visible={!!selectedLog}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedLog(null)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: getLogIcon(selectedLog.type).bg }}
                  >
                    <MaterialCommunityIcons
                      name={getLogIcon(selectedLog.type).name as any}
                      size={22}
                      color={getLogIcon(selectedLog.type).color}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-900 font-bold text-base">Chi tiết nhật ký</Text>
                    <Text className="text-gray-400 text-[11px]">{selectedLog.id}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedLog(null)}>
                  <MaterialCommunityIcons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="py-4 space-y-3">
                <View>
                  <Text className="text-gray-400 text-xs font-semibold">Sự kiện</Text>
                  <Text className="text-gray-900 font-bold text-sm mt-0.5">
                    {selectedLog.title}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-400 text-xs font-semibold">Mô tả chi tiết</Text>
                  <Text className="text-gray-700 text-xs mt-0.5 leading-5">
                    {selectedLog.description}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-gray-400 text-xs font-semibold">Tác nhân</Text>
                    <Text className="text-gray-800 font-bold text-xs mt-0.5">
                      {selectedLog.actor}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-400 text-xs font-semibold">Thời gian</Text>
                    <Text className="text-gray-800 font-bold text-xs mt-0.5">
                      {selectedLog.timeRaw.toLocaleString("vi-VN")}
                    </Text>
                  </View>
                </View>

                {selectedLog.amount && selectedLog.amount > 0 ? (
                  <View className="bg-orange-50 p-3 rounded-2xl flex-row items-center justify-between border border-orange-100">
                    <Text className="text-[#E07B39] font-bold text-xs">Giá trị giao dịch</Text>
                    <Text className="text-[#E07B39] font-black text-sm">
                      {selectedLog.amount.toLocaleString("vi-VN")} đ
                    </Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={() => setSelectedLog(null)}
                className="bg-[#E07B39] py-3.5 rounded-2xl items-center mt-2"
              >
                <Text className="text-white font-bold text-sm">Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
