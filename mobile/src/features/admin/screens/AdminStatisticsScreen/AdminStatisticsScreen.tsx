import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { paymentApi, Payment, PaymentAnalytics } from "../../../../services/api/api-payment";
import adminUserApi from "../../../../services/api/admin-user.api";
import { tableApi } from "../../../../services/api/api-table";

const { width } = Dimensions.get("window");

// Formatting helpers
const formatCurrency = (amount: number) =>
  (amount || 0).toLocaleString("vi-VN") + " đ";

const formatShortCurrency = (amount: number) => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + "M";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(0) + "k";
  }
  return String(amount);
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type TimeFilterType = "TODAY" | "7DAYS" | "30DAYS" | "ALL";

interface DailyPoint {
  dateLabel: string;
  dayName: string;
  revenue: number;
  ordersCount: number;
  rawDate: string;
}

interface TopDishItem {
  id: string;
  name: string;
  salesCount: number;
  price: number;
  totalRevenue: number;
  categoryName?: string;
  tag: "STAR" | "POTENTIAL" | "POPULAR";
}

export default function AdminStatisticsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const insets = useSafeAreaInsets();

  // Screen Tab: 8.2 (Biểu đồ & Top Món) vs 8.1 (Chỉ số KPI)
  const [activeMainTab, setActiveMainTab] = useState<"CHARTS" | "KPIS">("CHARTS");

  // 8.2.1.1 Time Filter & Metric Switch
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("7DAYS");
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders">("revenue");

  // Raw data from API
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);

  // 8.1 KPIs
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalTables, setTotalTables] = useState<number>(0);
  const [occupiedTables, setOccupiedTables] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      const [
        analyticsRes,
        usersRes,
        tablesRes,
      ] = await Promise.allSettled([
        paymentApi.getAnalytics(timeFilter),
        adminUserApi.getUsers({ limit: 1 }),
        tableApi.getAdminTables({ limit: 1000 } as any),
      ]);

      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value);
        setPayments(analyticsRes.value.recentPayments || []);
        setAnalyticsError(null);
      } else {
        setAnalytics(null);
        setPayments([]);
        setAnalyticsError("Không tải được số liệu từ máy chủ. Vui lòng kiểm tra kết nối và làm mới.");
      }

      if (usersRes.status === "fulfilled") {
        setTotalUsers((usersRes.value as any)?.pagination?.total ?? 0);
      }

      if (tablesRes.status === "fulfilled") {
        const res = tablesRes.value as any;
        const tblList = res?.data || [];
        setTotalTables(res?.pagination?.total ?? tblList.length ?? 0);
        setOccupiedTables(
          tblList.filter((t: any) => t.status === "OCCUPIED" || t.status === "RESERVED").length
        );
      }

    } catch (err) {
      console.error("Error loading statistics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const dailyChartData = useMemo<DailyPoint[]>(() => analytics?.daily || [], [analytics]);

  const maxChartValue = useMemo(() => {
    if (chartMetric === "revenue") {
      const max = Math.max(...dailyChartData.map((d) => d.revenue), 100000);
      return max;
    } else {
      const max = Math.max(...dailyChartData.map((d) => d.ordersCount), 5);
      return max;
    }
  }, [dailyChartData, chartMetric]);

  const peakDay = useMemo(() => {
    if (!dailyChartData.length) return null;
    const peak = [...dailyChartData].sort((a, b) =>
      chartMetric === "revenue" ? b.revenue - a.revenue : b.ordersCount - a.ordersCount
    )[0];
    return (chartMetric === "revenue" ? peak.revenue : peak.ordersCount) > 0 ? peak : null;
  }, [dailyChartData, chartMetric]);

  const avgDailyRevenue = useMemo(() => {
    if (!dailyChartData.length) return 0;
    const total = dailyChartData.reduce((sum, d) => sum + d.revenue, 0);
    return Math.round(total / dailyChartData.length);
  }, [dailyChartData]);

  // --- 8.2.1.2 BIỂU ĐỒ CƠ CẤU PHƯƠNG THỨC THANH TOÁN (VIETQR VS TIỀN MẶT) ---
  const paymentBreakdown = analytics?.paymentBreakdown || {
    vietQr: { total: 0, count: 0, percent: 0 },
    cash: { total: 0, count: 0, percent: 0 },
    bank: { total: 0, count: 0, percent: 0 },
    grandTotal: 0,
    totalTransactions: 0,
  };

  // --- 8.2.2.1 & 8.2.2.2 BẢNG XẾP HẠNG MÓN ĂN BÁN CHẠY VÀ ĐÁNH GIÁ TỐI ƯU ---
  const topSellingDishes: TopDishItem[] = analytics?.topDishes || [];

  const maxDishSales = useMemo(() => {
    if (!topSellingDishes.length) return 1;
    return Math.max(...topSellingDishes.map((d) => d.salesCount), 1);
  }, [topSellingDishes]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#FDFCF7] items-center justify-center">
        <ActivityIndicator size="large" color="#E07B39" />
        <Text className="text-gray-400 mt-3 text-sm font-medium">
          Đang tính toán biểu đồ & phân tích...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar style="light" />

      {/* TOP HEADER */}
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          paddingBottom: 18,
          paddingHorizontal: 20,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons name="chevron-left" size={26} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white text-lg font-black tracking-tight">
              Báo cáo & Phân tích
            </Text>
            <Text className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Phân hệ 8.2 • Executive Analytics
            </Text>
          </View>
          <TouchableOpacity
            onPress={onRefresh}
            className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Segmented Switcher: 8.2 vs 8.1 */}
        <View className="flex-row bg-black/20 p-1 rounded-2xl border border-white/20">
          <TouchableOpacity
            onPress={() => setActiveMainTab("CHARTS")}
            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${
              activeMainTab === "CHARTS" ? "bg-white shadow-sm" : ""
            }`}
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={16}
              color={activeMainTab === "CHARTS" ? "#E07B39" : "rgba(255,255,255,0.8)"}
            />
            <Text
              className={`text-xs font-black ml-1.5 ${
                activeMainTab === "CHARTS" ? "text-[#E07B39]" : "text-white"
              }`}
            >
              Biểu đồ & Top món (8.2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveMainTab("KPIS")}
            className={`flex-1 py-2 rounded-xl items-center flex-row justify-center ${
              activeMainTab === "KPIS" ? "bg-white shadow-sm" : ""
            }`}
          >
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={16}
              color={activeMainTab === "KPIS" ? "#E07B39" : "rgba(255,255,255,0.8)"}
            />
            <Text
              className={`text-xs font-black ml-1.5 ${
                activeMainTab === "KPIS" ? "text-[#E07B39]" : "text-white"
              }`}
            >
              Chỉ số KPI (8.1)
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* TIME RANGE FILTER (Hôm nay, 7 ngày, 30 ngày, Tất cả) */}
      <View className="py-2.5 px-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-wider">
          Mốc thời gian:
        </Text>
        <View className="flex-row items-center space-x-1.5">
          {[
            { id: "TODAY", label: "Hôm nay" },
            { id: "7DAYS", label: "7 ngày qua" },
            { id: "30DAYS", label: "30 ngày" },
            { id: "ALL", label: "Tất cả" },
          ].map((item) => {
            const isSelected = timeFilter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setTimeFilter(item.id as TimeFilterType)}
                className={`px-3 py-1 rounded-full border ${
                  isSelected
                    ? "bg-[#E07B39] border-[#E07B39]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: insets.bottom + 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E07B39"]}
          />
        }
      >
        {analyticsError && (
          <View className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3">
            <Text className="text-red-700 text-xs font-semibold">{analyticsError}</Text>
          </View>
        )}
        {activeMainTab === "CHARTS" ? (
          <>
            {/* ======================================================== */}
            {/* 8.2.1.1 BIỂU ĐỒ CỘT THỂ HIỆN BIẾN ĐỘNG DOANH THU THEO THỜI GIAN */}
            {/* ======================================================== */}
            <View className="bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-sm">
              {/* Header section with Metric Toggle */}
              <View className="flex-row items-center justify-between pb-3 border-b border-gray-50 mb-4">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-10 h-10 rounded-2xl bg-orange-50 items-center justify-center mr-3 border border-orange-100">
                    <MaterialCommunityIcons name="chart-bell-curve" size={22} color="#E07B39" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-black text-sm tracking-tight mr-1.5">
                        Biến động Doanh thu
                      </Text>
                      <View className="bg-orange-100 px-1.5 py-0.2 rounded">
                        <Text className="text-[#E07B39] font-black text-[9px]">8.2.1.1</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-medium">
                      Biểu đồ cột theo chu kỳ {timeFilter === "7DAYS" ? "7 ngày" : timeFilter}
                    </Text>
                  </View>
                </View>

                {/* Metric toggle */}
                <View className="flex-row bg-gray-100 p-1 rounded-xl">
                  <TouchableOpacity
                    onPress={() => setChartMetric("revenue")}
                    className={`px-2.5 py-1 rounded-lg ${
                      chartMetric === "revenue" ? "bg-white shadow-xs" : ""
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-black ${
                        chartMetric === "revenue" ? "text-[#E07B39]" : "text-gray-500"
                      }`}
                    >
                      Tiền (VNĐ)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setChartMetric("orders")}
                    className={`px-2.5 py-1 rounded-lg ${
                      chartMetric === "orders" ? "bg-white shadow-xs" : ""
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-black ${
                        chartMetric === "orders" ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      Đơn hàng
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* BAR CHART GRAPH */}
              <View className="py-2">
                <View
                  className="flex-row items-end justify-between pt-6 pb-2"
                  style={{ height: 170 }}
                >
                  {dailyChartData.map((item, idx) => {
                    const currentVal =
                      chartMetric === "revenue" ? item.revenue : item.ordersCount;
                    const heightPercent = currentVal > 0
                      ? Math.max(10, Math.min(100, (currentVal / maxChartValue) * 100))
                      : 0;
                    const isPeak =
                      peakDay &&
                      (chartMetric === "revenue"
                        ? item.revenue === peakDay.revenue
                        : item.ordersCount === peakDay.ordersCount);

                    return (
                      <View
                        key={idx}
                        className="items-center flex-1"
                        style={{ height: "100%", justifyContent: "flex-end" }}
                      >
                        {/* Top Value Label */}
                        <Text
                          className={`text-[9px] font-black mb-1 ${
                            isPeak
                              ? chartMetric === "revenue"
                                ? "text-[#E07B39]"
                                : "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {chartMetric === "revenue"
                            ? formatShortCurrency(currentVal)
                            : currentVal}
                        </Text>

                        {/* Bar Pillar with LinearGradient */}
                        <View
                          className="w-7 rounded-t-xl overflow-hidden"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: "#F3F4F6",
                          }}
                        >
                          <LinearGradient
                            colors={
                              isPeak
                                ? chartMetric === "revenue"
                                  ? ["#E07B39", "#EA580C"]
                                  : ["#3B82F6", "#2563EB"]
                                : chartMetric === "revenue"
                                ? ["#FDBA74", "#FB923C"]
                                : ["#93C5FD", "#60A5FA"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="w-full h-full rounded-t-xl"
                          />
                        </View>

                        {/* Date underneath */}
                        <Text className="text-gray-800 font-bold text-[10px] mt-1.5">
                          {item.dayName}
                        </Text>
                        <Text className="text-gray-400 text-[8px] font-medium">
                          {item.dateLabel}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Chart Insights Footer */}
              <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-between bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                <View>
                  <Text className="text-gray-500 text-[10px] font-bold">{timeFilter === "ALL" ? "Tháng cao điểm" : chartMetric === "revenue" ? "Ngày doanh thu cao nhất" : "Ngày nhiều đơn nhất"}</Text>
                  <Text className="text-gray-900 font-black text-xs mt-0.5">
                    {peakDay ? `${peakDay.dayName} (${peakDay.dateLabel})` : "N/A"}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-[10px] font-bold">{chartMetric === "revenue" ? "Doanh thu cao nhất" : "Số đơn cao nhất"}</Text>
                  <Text className="text-[#E07B39] font-black text-xs mt-0.5">
                    {peakDay ? (chartMetric === "revenue" ? formatCurrency(peakDay.revenue) : `${peakDay.ordersCount} đơn`) : "Chưa có dữ liệu"}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-500 text-[10px] font-bold">{timeFilter === "ALL" ? "TB tháng" : "TB ngày"}</Text>
                  <Text className="text-gray-900 font-black text-xs mt-0.5">
                    {formatShortCurrency(avgDailyRevenue)} đ
                  </Text>
                </View>
              </View>
            </View>

            {/* ======================================================== */}
            {/* 8.2.1.2 BIỂU ĐỒ CƠ CẤU PHƯƠNG THỨC THANH TOÁN (VIETQR VS TIỀN MẶT) */}
            {/* ======================================================== */}
            <View className="bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-between pb-3 border-b border-gray-50 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center mr-3 border border-emerald-100">
                    <MaterialCommunityIcons name="chart-pie" size={22} color="#10B981" />
                  </View>
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-black text-sm tracking-tight mr-1.5">
                        Cơ cấu thanh toán
                      </Text>
                      <View className="bg-emerald-100 px-1.5 py-0.2 rounded">
                        <Text className="text-emerald-700 font-black text-[9px]">8.2.1.2</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-medium">
                      Tỷ trọng VietQR NAPAS 24/7 và Tiền mặt
                    </Text>
                  </View>
                </View>
                <Text className="text-emerald-700 font-black text-xs">
                  {formatCurrency(paymentBreakdown.grandTotal)}
                </Text>
              </View>

              {/* Multi-Color Ratio Progress Bar */}
              <View className="w-full h-4 bg-gray-100 rounded-full flex-row overflow-hidden mb-4 p-0.5 border border-gray-200">
                {/* VietQR Segment */}
                <View
                  style={{ width: `${paymentBreakdown.vietQr.percent}%` }}
                  className="h-full bg-emerald-500 rounded-l-full"
                />
                {/* Cash Segment */}
                <View
                  style={{ width: `${paymentBreakdown.cash.percent}%` }}
                  className="h-full bg-[#E07B39]"
                />
                {/* Bank Transfer Segment */}
                {paymentBreakdown.bank.percent > 0 && (
                  <View
                    style={{ width: `${paymentBreakdown.bank.percent}%` }}
                    className="h-full bg-blue-500 rounded-r-full"
                  />
                )}
              </View>

              {/* Method Detail Rows */}
              <View className="space-y-2.5">
                {/* VietQR */}
                <View className="bg-emerald-50/70 p-3 rounded-2xl flex-row items-center justify-between border border-emerald-100 mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-xl bg-emerald-500 items-center justify-center mr-3">
                      <MaterialCommunityIcons name="qrcode-scan" size={16} color="white" />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <Text className="text-gray-900 font-bold text-xs mr-2">
                          VietQR NAPAS 24/7
                        </Text>
                        <View className="bg-emerald-200 px-1.5 py-0.2 rounded">
                          <Text className="text-emerald-800 font-black text-[9px]">TỰ ĐỘNG</Text>
                        </View>
                      </View>
                      <Text className="text-gray-500 text-[10px]">
                        {paymentBreakdown.vietQr.count} giao dịch chuyển khoản
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-emerald-700 font-black text-xs">
                      {formatCurrency(paymentBreakdown.vietQr.total)}
                    </Text>
                    <Text className="text-emerald-600 font-black text-[10px]">
                      {paymentBreakdown.vietQr.percent}%
                    </Text>
                  </View>
                </View>

                {/* Tiền mặt */}
                <View className="bg-orange-50/70 p-3 rounded-2xl flex-row items-center justify-between border border-orange-100 mb-2">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-xl bg-[#E07B39] items-center justify-center mr-3">
                      <MaterialCommunityIcons name="cash" size={18} color="white" />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-bold text-xs">
                        Tiền mặt tại quán (Cash)
                      </Text>
                      <Text className="text-gray-500 text-[10px]">
                        {paymentBreakdown.cash.count} lượt thanh toán tại quầy
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-[#E07B39] font-black text-xs">
                      {formatCurrency(paymentBreakdown.cash.total)}
                    </Text>
                    <Text className="text-[#E07B39] font-black text-[10px]">
                      {paymentBreakdown.cash.percent}%
                    </Text>
                  </View>
                </View>

                {/* Chuyển khoản ngân hàng khác */}
                {paymentBreakdown.bank.count > 0 && (
                  <View className="bg-blue-50/70 p-3 rounded-2xl flex-row items-center justify-between border border-blue-100 mb-2">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-xl bg-blue-500 items-center justify-center mr-3">
                        <MaterialCommunityIcons name="bank" size={16} color="white" />
                      </View>
                      <View>
                        <Text className="text-gray-900 font-bold text-xs">
                          Chuyển khoản / Khác
                        </Text>
                        <Text className="text-gray-500 text-[10px]">
                          {paymentBreakdown.bank.count} lượt thanh toán
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-blue-700 font-black text-xs">
                        {formatCurrency(paymentBreakdown.bank.total)}
                      </Text>
                      <Text className="text-blue-600 font-black text-[10px]">
                        {paymentBreakdown.bank.percent}%
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Đối soát note */}
              <View className="mt-2 bg-gray-50 p-2.5 rounded-xl flex-row items-center">
                <MaterialCommunityIcons name="shield-check" size={16} color="#10B981" />
                <Text className="text-gray-500 text-[10px] ml-1.5 font-medium flex-1">
                  Chỉ tính giao dịch đã được xác nhận thanh toán trong khoảng thời gian đã chọn.
                </Text>
              </View>
            </View>

            {/* ======================================================== */}
            {/* 8.2.2.1 BẢNG XẾP HẠNG MÓN ĂN BÁN CHẠY NHẤT */}
            {/* ======================================================== */}
            <View className="bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-between pb-3 border-b border-gray-50 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-amber-50 items-center justify-center mr-3 border border-amber-100">
                    <MaterialCommunityIcons name="trophy-award" size={22} color="#D97706" />
                  </View>
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-black text-sm tracking-tight mr-1.5">
                        Top Món ăn bán chạy
                      </Text>
                      <View className="bg-amber-100 px-1.5 py-0.2 rounded">
                        <Text className="text-amber-800 font-black text-[9px]">8.2.2.1</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-medium">
                      Món trong đơn tại bàn đã hoàn tất
                    </Text>
                  </View>
                </View>
                <View className="bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Text className="text-amber-800 font-black text-[10px]">
                    TOP {topSellingDishes.length}
                  </Text>
                </View>
              </View>

              {/* Dishes list */}
              <View className="space-y-3">
                {topSellingDishes.length === 0 && (
                  <Text className="text-gray-500 text-xs py-3">Chưa có món trong đơn hoàn tất ở khoảng thời gian này.</Text>
                )}
                {topSellingDishes.map((dish, idx) => {
                  const sharePercent = Math.round((dish.salesCount / maxDishSales) * 100);

                  return (
                    <View
                      key={dish.id}
                      className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 mb-2"
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        {/* Rank Badge + Name */}
                        <View className="flex-row items-center flex-1 mr-2">
                          <View
                            className={`w-7 h-7 rounded-xl items-center justify-center mr-2.5 ${
                              idx === 0
                                ? "bg-amber-400"
                                : idx === 1
                                ? "bg-slate-300"
                                : idx === 2
                                ? "bg-amber-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <Text className="text-white font-black text-xs">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-gray-900 font-black text-xs tracking-tight"
                              numberOfLines={1}
                            >
                              {dish.name}
                            </Text>
                            <Text className="text-gray-400 text-[10px]">
                              Đơn giá: {formatCurrency(dish.price)}
                            </Text>
                          </View>
                        </View>

                        {/* Revenue & Sales count */}
                        <View className="items-end">
                          <Text className="text-[#E07B39] font-black text-xs">
                            {formatCurrency(dish.totalRevenue)}
                          </Text>
                          <Text className="text-gray-600 font-bold text-[10px]">
                            {dish.salesCount} suất đã bán
                          </Text>
                        </View>
                      </View>

                      {/* Share progress bar */}
                      <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View
                          style={{ width: `${sharePercent}%` }}
                          className={`h-full rounded-full ${
                            idx === 0
                              ? "bg-amber-500"
                              : idx === 1
                              ? "bg-slate-500"
                              : "bg-[#E07B39]"
                          }`}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ======================================================== */}
            {/* 8.2.2.2 ĐÁNH GIÁ MÓN ĂN ĐƯỢC ƯA CHUỘNG ĐỂ TỐI ƯU THỰC ĐƠN */}
            {/* ======================================================== */}
            <View className="bg-white rounded-3xl p-5 mb-5 border border-gray-100 shadow-sm">
              <View className="flex-row items-center justify-between pb-3 border-b border-gray-50 mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center mr-3 border border-indigo-100">
                    <MaterialCommunityIcons name="lightbulb-on" size={22} color="#6366F1" />
                  </View>
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-black text-sm tracking-tight mr-1.5">
                        Tối ưu thực đơn (Menu Engineering)
                      </Text>
                      <View className="bg-indigo-100 px-1.5 py-0.2 rounded">
                        <Text className="text-indigo-700 font-black text-[9px]">8.2.2.2</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-medium">
                      Đánh giá món ưa chuộng & Gợi ý kinh doanh
                    </Text>
                  </View>
                </View>
              </View>

              {/* 3 Strategic Matrix Cards */}
              <View className="space-y-3">
                {/* 1. Món Ngôi Sao (Stars) */}
                <View className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 mb-2.5">
                  <View className="flex-row items-center mb-1.5">
                    <View className="w-6 h-6 rounded-full bg-amber-500 items-center justify-center mr-2">
                      <MaterialCommunityIcons name="star" size={14} color="white" />
                    </View>
                    <Text className="text-amber-900 font-black text-xs">
                      Món Ngôi Sao (Có số lượng bán cao)
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-[11px] leading-4 mb-2">
                    Các món như{" "}
                    <Text className="font-bold text-amber-900">
                      {topSellingDishes[0]?.name || "Chưa có dữ liệu món bán"}
                    </Text>{" "}
                    {topSellingDishes.length ? "dẫn đầu về số lượng bán trong kỳ." : "Chưa có đơn tại bàn hoàn tất để phân tích."}
                  </Text>
                  <View className="bg-white/80 p-2.5 rounded-xl border border-amber-100">
                    <Text className="text-amber-800 font-bold text-[10px]">
                      💡 Đề xuất: Duy trì chuẩn chất lượng nguyên liệu, đặt hình ảnh nổi bật ở Banner đầu menu trên Mobile & Web.
                    </Text>
                  </View>
                </View>

                {/* 2. Món Tiềm Năng (Opportunities) */}
                <View className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 mb-2.5">
                  <View className="flex-row items-center mb-1.5">
                    <View className="w-6 h-6 rounded-full bg-indigo-500 items-center justify-center mr-2">
                      <MaterialCommunityIcons name="trending-up" size={14} color="white" />
                    </View>
                    <Text className="text-indigo-900 font-black text-xs">
                      Món Tiềm Năng (Đơn giá cao)
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-[11px] leading-4 mb-2">
                    Món có đơn giá từ 80.000đ trở lên và còn cơ hội tăng số lượt gọi.
                  </Text>
                  <View className="bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                    <Text className="text-indigo-800 font-bold text-[10px]">
                      💡 Đề xuất: Tạo gói Combo món ăn + đồ uống hoặc voucher ưu đãi 10-15% để kích thích khách gọi thử.
                    </Text>
                  </View>
                </View>

                {/* 3. Món Cần Tối Ưu (Volume / Cost Optimizer) */}
                <View className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 mb-2.5">
                  <View className="flex-row items-center mb-1.5">
                    <View className="w-6 h-6 rounded-full bg-emerald-600 items-center justify-center mr-2">
                      <MaterialCommunityIcons name="tune" size={14} color="white" />
                    </View>
                    <Text className="text-emerald-900 font-black text-xs">
                      Định giá & Tối ưu chi phí thực đơn
                    </Text>
                  </View>
                  <Text className="text-gray-700 text-[11px] leading-4 mb-2">
                    Rà soát tỷ lệ thất thoát nguyên liệu theo định kỳ tuần/tháng.
                  </Text>
                  <View className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <Text className="text-emerald-800 font-bold text-[10px]">
                      💡 Đề xuất: Tận dụng trợ lý AI Ollama để tự động tư vấn món kèm nước cho khách theo sở thích.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* ======================================================== */
          /* 8.1 CHỈ SỐ KPI TỔNG QUAN (8.1.1, 8.1.2, 8.1.3, 8.1.4) */
          /* ======================================================== */
          <>
            {/* 8.1.1 Thống kê Doanh thu */}
            <View className="bg-orange-50 rounded-3xl p-4 mb-4 border border-orange-100">
              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-2xl bg-orange-500 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="cash-multiple" size={18} color="white" />
                </View>
                <View>
                  <Text className="font-black text-gray-800 text-[14px]">8.1.1. Thống kê Doanh thu</Text>
                  <Text className="text-gray-400 text-[11px]">Toàn thời gian và hôm nay</Text>
                </View>
              </View>

              <View className="flex-row space-x-3 mb-3">
                <View className="bg-white rounded-2xl p-4 flex-1 border border-orange-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Tổng doanh thu
                  </Text>
                  <Text className="font-black text-[18px] text-[#E07B39]">
                    {formatCurrency(analytics?.summary.totalRevenue || 0)}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Toàn thời gian</Text>
                </View>
                <View className="bg-white rounded-2xl p-4 flex-1 border border-orange-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Doanh thu hôm nay
                  </Text>
                  <Text className="font-black text-[18px] text-emerald-600">
                    {formatCurrency(analytics?.summary.revenueToday || 0)}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Trong ngày</Text>
                </View>
              </View>
            </View>

            {/* 8.1.2 Thống kê Số lượng Đơn hàng */}
            <View className="bg-blue-50 rounded-3xl p-4 mb-4 border border-blue-100">
              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-2xl bg-blue-500 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="receipt" size={18} color="white" />
                </View>
                <View>
                  <Text className="font-black text-gray-800 text-[14px]">8.1.2. Số lượng Đơn hàng</Text>
                  <Text className="text-gray-400 text-[11px]">Tổng số đơn phát sinh và hoàn tất</Text>
                </View>
              </View>

              <View className="flex-row space-x-3 mb-3">
                <View className="bg-white rounded-2xl p-4 flex-1 border border-blue-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Tổng đơn hàng
                  </Text>
                  <Text className="font-black text-[18px] text-blue-600">
                    {analytics?.summary.totalOrders || 0}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Đã phát sinh</Text>
                </View>
                <View className="bg-white rounded-2xl p-4 flex-1 border border-blue-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Hoàn tất hôm nay
                  </Text>
                  <Text className="font-black text-[18px] text-emerald-600">
                    {analytics?.summary.completedToday || 0}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">COMPLETED</Text>
                </View>
              </View>
            </View>

            {/* 8.1.3 Thống kê Người dùng và Bàn ăn */}
            <View className="bg-emerald-50 rounded-3xl p-4 mb-4 border border-emerald-100">
              <View className="flex-row items-center mb-3">
                <View className="w-9 h-9 rounded-2xl bg-emerald-600 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="account-group" size={18} color="white" />
                </View>
                <View>
                  <Text className="font-black text-gray-800 text-[14px]">8.1.3. Người dùng & Bàn ăn</Text>
                  <Text className="text-gray-400 text-[11px]">Tài khoản hệ thống & trạng thái bàn</Text>
                </View>
              </View>

              <View className="flex-row space-x-3 mb-3">
                <View className="bg-white rounded-2xl p-4 flex-1 border border-emerald-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Người dùng
                  </Text>
                  <Text className="font-black text-[18px] text-emerald-700">{totalUsers}</Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Đã đăng ký</Text>
                </View>
                <View className="bg-white rounded-2xl p-4 flex-1 border border-emerald-100">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Bàn có khách
                  </Text>
                  <Text className="font-black text-[18px] text-blue-600">
                    {occupiedTables} / {totalTables}
                  </Text>
                  <Text className="text-gray-400 text-[10px] mt-0.5">Đang phục vụ</Text>
                </View>
              </View>
            </View>

            {/* 8.1.4 Giao dịch gần đây */}
            <View className="bg-purple-50 rounded-3xl p-4 mb-4 border border-purple-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-2xl bg-purple-600 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="history" size={18} color="white" />
                  </View>
                  <View>
                    <Text className="font-black text-gray-800 text-[14px]">8.1.4. Giao dịch gần đây</Text>
                    <Text className="text-gray-400 text-[11px]">Thanh toán mới nhất</Text>
                  </View>
                </View>
              </View>

              <View className="space-y-2">
                {payments.slice(0, 5).map((p) => (
                  <View
                    key={p.id}
                    className="bg-white rounded-2xl p-3 flex-row items-center justify-between border border-purple-100 mb-2"
                  >
                    <View className="flex-row items-center flex-1 mr-2">
                      <View className="w-8 h-8 rounded-xl bg-purple-100 items-center justify-center mr-2.5">
                        <MaterialCommunityIcons
                          name={p.method === "CASH" ? "cash" : "qrcode"}
                          size={16}
                          color="#7C3AED"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>
                          {p.method === "CASH" ? "Tiền mặt tại quán" : "VietQR 24/7"}
                        </Text>
                        <Text className="text-gray-400 text-[10px]">
                          {formatDate(p.updatedAt || p.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-purple-700 font-black text-xs">
                        {formatCurrency(p.amount)}
                      </Text>
                      <Text className="text-emerald-600 font-bold text-[9px]">
                        {p.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
