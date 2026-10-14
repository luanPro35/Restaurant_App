import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { paymentApi } from "../../../../services/api/api-payment";
import { packageApi, Package } from "../../../../services/api/package-api";
import { tableApi } from "../../../../services/api/api-table";
import { adminUserApi } from "../../../../services/api/admin-user.api";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function AdminDashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Executive KPI state
  const [revenueToday, setRevenueToday] = useState<number>(0);
  const [ordersTodayCount, setOrdersTodayCount] = useState<number>(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [occupiedTablesCount, setOccupiedTablesCount] = useState<number>(0);
  const [totalTablesCount, setTotalTablesCount] = useState<number>(0);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [revTodayRes, packagesRes, tablesRes, usersRes] =
        await Promise.allSettled([
          paymentApi.getTotalAmountToday(),
          packageApi.findAllPackage(),
          tableApi.getAdminTables({ limit: 100 } as any),
          adminUserApi.getUsers({ limit: 1 }),
        ]);

      // 1. Revenue today
      let rev = 0;
      if (revTodayRes.status === "fulfilled") {
        rev = Number(revTodayRes.value) || 0;
      }

      // 2. Packages (Orders)
      let pkgs: Package[] = [];
      if (packagesRes.status === "fulfilled" && Array.isArray(packagesRes.value)) {
        pkgs = packagesRes.value;
        const active = pkgs.filter(
          (p) => p.status !== "COMPLETED" && p.status !== "CANCELED"
        ).length;
        setActiveOrdersCount(active);
        setOrdersTodayCount(pkgs.length);
        setRecentPackages(pkgs.slice(0, 3));

        // If revenue API returned 0, compute fallback from completed today
        if (rev === 0) {
          rev = pkgs
            .filter((p) => p.status === "COMPLETED" || p.status === "RECEIVED")
            .reduce((sum, p) => sum + (Number(p.price) || 0), 0);
        }
      }
      setRevenueToday(rev);

      // 3. Tables
      if (tablesRes.status === "fulfilled" && tablesRes.value?.data) {
        const tblList = tablesRes.value.data;
        const occupied = tblList.filter(
          (t: any) => t.status === "OCCUPIED" || t.status === "RESERVED"
        ).length;
        setOccupiedTablesCount(occupied);
        setTotalTablesCount(tblList.length);
      }

      // 4. Users
      if (usersRes.status === "fulfilled" && usersRes.value?.pagination) {
        setTotalUsersCount(usersRes.value.pagination.total || 0);
      }
    } catch (err) {
      console.error("Fetch dashboard metrics error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const AdminCard = ({ title, icon, colors, onPress, badge }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-[24px] mb-3.5 border border-gray-100/80 overflow-hidden relative"
      style={{
        width: cardWidth,
        ...Platform.select({
          ios: {
            shadowColor: colors[1],
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
          },
          android: {
            elevation: 2.5,
          },
        }),
      }}
    >
      {badge && (
        <View className="absolute top-2.5 right-2.5 bg-orange-500 rounded-full px-1.5 py-0.5 z-10">
          <Text className="text-white text-[9px] font-black">{badge}</Text>
        </View>
      )}
      <View className="p-4 items-center">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mb-2.5"
          style={{ backgroundColor: `${colors[0]}15` }}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-9 h-9 rounded-xl items-center justify-center"
          >
            <MaterialCommunityIcons name={icon} size={20} color="white" />
          </LinearGradient>
        </View>
        <Text
          className="font-black text-gray-800 text-center text-xs tracking-tight"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 20) + 12,
          paddingBottom: insets.bottom + 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E07B39"]}
          />
        }
      >
        {/* Top Header */}
        <View className="flex-row items-center justify-between mb-5 px-1">
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#E07B39", "#C96A2E"]}
              className="w-12 h-12 rounded-2xl items-center justify-center mr-3 shadow-md"
            >
              <MaterialCommunityIcons name="shield-account" size={26} color="white" />
            </LinearGradient>
            <View>
              <View className="flex-row items-center">
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[1.5px] mr-2">
                  Bảng điều hành
                </Text>
                <View className="flex-row items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  <Text className="text-emerald-700 font-black text-[9px]">MỞ CỬA</Text>
                </View>
              </View>
              <Text className="text-gray-900 text-xl font-black tracking-tight">
                Restaurant O2O Admin
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => navigation.navigate("AdminNotificationsScreen" as any)}
              className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm"
            >
              <MaterialCommunityIcons
                name="bell-badge-outline"
                size={20}
                color="#E07B39"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("AdminSettings")}
              className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-gray-200 shadow-sm ml-2"
            >
              <MaterialCommunityIcons name="tune-variant" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Executive KPI Overview Grid */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3 px-1">
            <View className="flex-row items-center">
              <View className="w-1.5 h-4 bg-[#E07B39] rounded-full mr-2" />
              <Text className="text-sm font-black text-gray-800 tracking-tight">
                Chỉ số thời gian thực (Hôm nay)
              </Text>
            </View>
            <TouchableOpacity onPress={onRefresh} className="flex-row items-center">
              <MaterialCommunityIcons name="refresh" size={14} color="#E07B39" />
              <Text className="text-[#E07B39] text-[11px] font-bold ml-1">Làm mới</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <View className="bg-white rounded-3xl p-6 items-center justify-center border border-gray-100 shadow-sm">
              <ActivityIndicator size="small" color="#E07B39" />
              <Text className="text-gray-400 text-xs mt-2 font-medium">
                Đang cập nhật chỉ số...
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {/* Row 1: Revenue & Orders */}
              <View className="flex-row justify-between mb-3">
                {/* Revenue Card */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("AdminStatisticsScreen")}
                  activeOpacity={0.8}
                  className="bg-white rounded-3xl p-4 border border-orange-100 shadow-sm"
                  style={{ width: cardWidth }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-8 h-8 rounded-xl bg-orange-50 items-center justify-center">
                      <MaterialCommunityIcons name="wallet-outline" size={18} color="#E07B39" />
                    </View>
                    <MaterialCommunityIcons name="arrow-top-right" size={16} color="#9CA3AF" />
                  </View>
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Doanh thu hôm nay
                  </Text>
                  <Text
                    className="text-gray-900 font-black text-base tracking-tight"
                    numberOfLines={1}
                  >
                    {revenueToday.toLocaleString("vi-VN")} đ
                  </Text>
                  <Text className="text-emerald-600 text-[10px] font-bold mt-1">
                    ↗ Xem phân tích chi tiết
                  </Text>
                </TouchableOpacity>

                {/* Orders Card */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("AdminOrdersScreen")}
                  activeOpacity={0.8}
                  className="bg-white rounded-3xl p-4 border border-rose-100 shadow-sm"
                  style={{ width: cardWidth }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-8 h-8 rounded-xl bg-rose-50 items-center justify-center">
                      <MaterialCommunityIcons name="receipt" size={18} color="#F43F5E" />
                    </View>
                    <View className="bg-rose-50 px-1.5 py-0.5 rounded-full">
                      <Text className="text-rose-600 font-bold text-[9px]">
                        {activeOrdersCount} Đang xử lý
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Đơn hàng hôm nay
                  </Text>
                  <Text className="text-gray-900 font-black text-base tracking-tight">
                    {ordersTodayCount} Đơn hàng
                  </Text>
                  <Text className="text-gray-400 text-[10px] font-medium mt-1">
                    Giao hàng & Tại bàn
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Row 2: Occupied Tables & System Users */}
              <View className="flex-row justify-between">
                {/* Tables Card */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("AdminTablesScreen")}
                  activeOpacity={0.8}
                  className="bg-white rounded-3xl p-4 border border-teal-100 shadow-sm"
                  style={{ width: cardWidth }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-8 h-8 rounded-xl bg-teal-50 items-center justify-center">
                      <MaterialCommunityIcons name="table-furniture" size={18} color="#0D9488" />
                    </View>
                    <Text className="text-teal-700 font-bold text-[10px]">
                      {totalTablesCount > 0
                        ? `${Math.round((occupiedTablesCount / totalTablesCount) * 100)}%`
                        : "0%"}
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Bàn có khách
                  </Text>
                  <Text className="text-gray-900 font-black text-base tracking-tight">
                    {occupiedTablesCount} / {totalTablesCount} Bàn
                  </Text>
                  <Text className="text-teal-600 text-[10px] font-bold mt-1">
                    ● {totalTablesCount - occupiedTablesCount} bàn đang trống
                  </Text>
                </TouchableOpacity>

                {/* Users Card */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("AdminUsersScreen")}
                  activeOpacity={0.8}
                  className="bg-white rounded-3xl p-4 border border-blue-100 shadow-sm"
                  style={{ width: cardWidth }}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-8 h-8 rounded-xl bg-blue-50 items-center justify-center">
                      <MaterialCommunityIcons name="account-group" size={18} color="#2563EB" />
                    </View>
                    <MaterialCommunityIcons name="shield-check" size={16} color="#10B981" />
                  </View>
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                    Người dùng hệ thống
                  </Text>
                  <Text className="text-gray-900 font-black text-base tracking-tight">
                    {totalUsersCount} Tài khoản
                  </Text>
                  <Text className="text-blue-600 text-[10px] font-bold mt-1">
                    Khách & nhân viên
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Section: Vận hành cốt lõi */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3 px-1">
            <View className="w-1.5 h-4 bg-blue-500 rounded-full mr-2" />
            <Text className="text-sm font-black text-gray-800 tracking-tight">
              Vận hành cửa hàng & Thực đơn
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <AdminCard
              title="Sản phẩm"
              icon="silverware-fork-knife"
              colors={["#4facfe", "#00f2fe"]}
              onPress={() => navigation.navigate("AdminProducts")}
            />
            <AdminCard
              title="Danh mục"
              icon="view-grid-outline"
              colors={["#667eea", "#764ba2"]}
              onPress={() => navigation.navigate("AdminCategories")}
            />
            <AdminCard
              title="Bàn & Chỗ"
              icon="table-furniture"
              colors={["#00b09b", "#96c93d"]}
              onPress={() => navigation.navigate("AdminTablesScreen")}
              badge={occupiedTablesCount > 0 ? `${occupiedTablesCount} Bàn` : undefined}
            />
            <AdminCard
              title="Đơn hàng"
              icon="receipt"
              colors={["#f093fb", "#f5576c"]}
              onPress={() => navigation.navigate("AdminOrdersScreen")}
              badge={activeOrdersCount > 0 ? `${activeOrdersCount} Mới` : undefined}
            />
          </View>
        </View>

        {/* Section: Tài chính & Báo cáo */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3 px-1">
            <View className="w-1.5 h-4 bg-orange-500 rounded-full mr-2" />
            <Text className="text-sm font-black text-gray-800 tracking-tight">
              Tài chính, Báo cáo & Tiếp thị
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <AdminCard
              title="Thống kê KPI"
              icon="chart-bar"
              colors={["#E07B39", "#C96A2E"]}
              onPress={() => navigation.navigate("AdminStatisticsScreen")}
            />
            <AdminCard
              title="Tài chính"
              icon="wallet"
              colors={["#a1c4fd", "#c2e9fb"]}
              onPress={() => navigation.navigate("AdminPaymentsScreen" as any)}
            />
            <AdminCard
              title="Khuyến mãi"
              icon="ticket-percent"
              colors={["#ff9a9e", "#fecfef"]}
              onPress={() => navigation.navigate("AdminPromotionsScreen" as any)}
            />
            <AdminCard
              title="Thông báo"
              icon="bullhorn-variant"
              colors={["#f6d365", "#fda085"]}
              onPress={() => navigation.navigate("AdminNotificationsScreen" as any)}
            />
          </View>
        </View>

        {/* Section: Khách hàng & Dịch vụ */}
        <View className="mb-4">
          <View className="flex-row items-center mb-3 px-1">
            <View className="w-1.5 h-4 bg-emerald-500 rounded-full mr-2" />
            <Text className="text-sm font-black text-gray-800 tracking-tight">
              Khách hàng & Hỗ trợ O2O
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <AdminCard
              title="Khách hàng"
              icon="account-group"
              colors={["#84fab0", "#8fd3f4"]}
              onPress={() => navigation.navigate("AdminUsersScreen")}
            />
            <AdminCard
              title="Nhân viên"
              icon="account-tie-outline"
              colors={["#4facfe", "#00f2fe"]}
              onPress={() => navigation.navigate("AdminStaffScreen")}
            />
            <AdminCard
              title="Tin nhắn (Chat)"
              icon="message-text"
              colors={["#43e97b", "#38f9d7"]}
              onPress={() => navigation.navigate("AdminConversations" as any)}
            />
            <AdminCard
              title="Bình luận"
              icon="comment-multiple-outline"
              colors={["#FF9A9E", "#FAD0C4"]}
              onPress={() => navigation.navigate("AdminComment")}
            />
          </View>
        </View>

        {/* Section: Hệ thống & Bảo mật */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3 px-1">
            <View className="w-1.5 h-4 bg-purple-500 rounded-full mr-2" />
            <Text className="text-sm font-black text-gray-800 tracking-tight">
              Hệ thống, Nhật ký & Cài đặt
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <AdminCard
              title="Nhật ký hệ thống"
              icon="history"
              colors={["#89f7fe", "#66a6ff"]}
              onPress={() => navigation.navigate("AdminLogsScreen")}
            />
            <AdminCard
              title="Cài đặt"
              icon="tune"
              colors={["#6a11cb", "#2575fc"]}
              onPress={() => navigation.navigate("AdminSettings")}
            />
          </View>
        </View>

        {/* Recent Orders Snapshot */}
        {recentPackages.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <View className="flex-row items-center">
                <View className="w-1.5 h-4 bg-rose-500 rounded-full mr-2" />
                <Text className="text-sm font-black text-gray-800 tracking-tight">
                  Đơn hàng gần đây
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("AdminOrdersScreen")}
                className="flex-row items-center"
              >
                <Text className="text-[#E07B39] text-xs font-bold mr-1">Xem tất cả</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#E07B39" />
              </TouchableOpacity>
            </View>

            <View className="space-y-2.5">
              {recentPackages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  onPress={() => navigation.navigate("AdminOrdersScreen")}
                  activeOpacity={0.7}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex-row items-center justify-between mb-2"
                >
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                      <MaterialCommunityIcons name="package-variant-closed" size={20} color="#E07B39" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>
                        #{pkg.id.slice(-6).toUpperCase()} • {pkg.name || "Khách đặt gói"}
                      </Text>
                      <Text className="text-gray-400 text-[11px] mt-0.5" numberOfLines={1}>
                        {pkg.address || "Địa chỉ giao hàng"}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-[#E07B39] font-black text-xs">
                      {(pkg.price || 0).toLocaleString("vi-VN")} đ
                    </Text>
                    <View className="bg-orange-50 px-2 py-0.5 rounded-full mt-1 border border-orange-100">
                      <Text className="text-[#E07B39] font-bold text-[9px]">
                        {pkg.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
