import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../../app/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StaffStackParamList } from "../../../app/navigation/StaffNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { packageApi, Package } from "../../../services/api/package-api";
import { tableApi } from "../../../services/api/api-table";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48 - 12) / 2;

export default function StaffHomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<StaffStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [occupiedTablesCount, setOccupiedTablesCount] = useState<number>(0);
  const [recentPackages, setRecentPackages] = useState<Package[]>([]);

  const fetchStaffData = useCallback(async () => {
    try {
      const [packagesRes, tablesRes] = await Promise.allSettled([
        packageApi.getAdminSummary(),
        tableApi.getAdminTableSummary(),
      ]);

      if (packagesRes.status === "fulfilled") {
        setActiveOrdersCount(packagesRes.value.activeOrdersCount || 0);
        setRecentPackages(packagesRes.value.recentPackages || []);
      }

      if (tablesRes.status === "fulfilled") {
        setOccupiedTablesCount(tablesRes.value.occupied || 0);
      }
    } catch (err) {
      console.error("Fetch staff metrics error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStaffData();
    }, [fetchStaffData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStaffData();
  };

  const StaffCard = ({
    title,
    icon,
    colors,
    onPress,
    badge,
  }: {
    title: string;
    icon: any;
    colors: [string, string];
    onPress: () => void;
    badge?: string;
  }) => (
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
        <View className="absolute top-2.5 right-2.5 bg-orange-500 rounded-full px-2 py-0.5 z-10">
          <Text className="text-white text-[9px] font-black">{badge}</Text>
        </View>
      )}
      <View className="p-4 items-center">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center mb-2.5"
          style={{
            ...Platform.select({
              ios: {
                shadowColor: colors[0],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
              },
              android: {
                elevation: 3,
              },
            }),
          }}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full rounded-2xl items-center justify-center"
          >
            <MaterialCommunityIcons name={icon} size={22} color="white" />
          </LinearGradient>
        </View>
        <Text className="text-gray-800 font-bold text-xs text-center">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar barStyle="dark-content" />

      {/* Header Container */}
      <View
        className="px-6 pb-5 bg-white border-b border-gray-100 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-1">
              Nhân viên trực ca
            </Text>
            <Text className="text-2xl font-black text-gray-800">
              {user?.name || "Nhân viên"}
            </Text>
          </View>
          <View className="flex-row items-center gap-x-2">
            <TouchableOpacity
              onPress={onRefresh}
              activeOpacity={0.7}
              className="w-11 h-11 bg-orange-50 rounded-2xl items-center justify-center border border-orange-100"
            >
              <MaterialCommunityIcons name="refresh" size={20} color="#E07B39" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              activeOpacity={0.7}
              className="w-11 h-11 bg-red-50 rounded-2xl items-center justify-center border border-red-100"
            >
              <MaterialCommunityIcons name="logout" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E07B39"]}
          />
        }
      >
        {/* Banner trạng thái ca trực */}
        <View
          className="mb-6 shadow-lg shadow-orange-300"
          style={{
            borderRadius: 28,
            shadowColor: "#E07B39",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 20, overflow: "hidden" }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  Trạng thái hiện tại
                </Text>
                <Text className="text-white text-lg font-black">
                  Bạn đang trong ca trực
                </Text>
                <View className="flex-row items-center mt-2 gap-x-3">
                  <View className="bg-white/20 px-2.5 py-1 rounded-xl">
                    <Text className="text-white text-[11px] font-bold">
                      {activeOrdersCount} đơn đang xử lý
                    </Text>
                  </View>
                  <View className="bg-white/20 px-2.5 py-1 rounded-xl">
                    <Text className="text-white text-[11px] font-bold">
                      {occupiedTablesCount} bàn đang dùng
                    </Text>
                  </View>
                </View>
              </View>
              <MaterialCommunityIcons name="clock-check-outline" size={42} color="white" />
            </View>
          </LinearGradient>
        </View>

        {/* Section: Công cụ làm việc */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3 px-1">
            <View className="w-1.5 h-4 bg-[#E07B39] rounded-full mr-2" />
            <Text className="text-sm font-black text-gray-800 tracking-tight">
              Công cụ làm việc
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {/* Card Đơn hàng với badge 45 Mới */}
            <StaffCard
              title="Đơn hàng"
              icon="receipt"
              colors={["#f093fb", "#f5576c"]}
              onPress={() => navigation.navigate("AdminOrdersScreen")}
              badge={activeOrdersCount > 0 ? `${activeOrdersCount} Mới` : undefined}
            />

            {/* Card Bàn & Chỗ */}
            <StaffCard
              title="Bàn & Chỗ"
              icon="table-furniture"
              colors={["#00b09b", "#96c93d"]}
              onPress={() => navigation.navigate("AdminTablesScreen")}
              badge={occupiedTablesCount > 0 ? `${occupiedTablesCount} Bàn` : undefined}
            />

            {/* Card Thông báo */}
            <StaffCard
              title="Thông báo"
              icon="bullhorn-variant"
              colors={["#f6d365", "#fda085"]}
              onPress={() => navigation.navigate("AdminNotificationsScreen")}
            />

            {/* Card Kiểm duyệt Bình luận */}
            <StaffCard
              title="Bình luận"
              icon="message-draw"
              colors={["#EC4899", "#BE185D"]}
              onPress={() => navigation.navigate("AdminCommentManagement")}
            />
          </View>
        </View>

        {/* Section: Đơn hàng mới nhất cần xử lý */}
        {recentPackages.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <View className="flex-row items-center">
                <View className="w-1.5 h-4 bg-orange-500 rounded-full mr-2" />
                <Text className="text-sm font-black text-gray-800 tracking-tight">
                  Đơn hàng gần đây
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("AdminOrdersScreen")}
              >
                <Text className="text-xs font-bold text-[#E07B39]">Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            {recentPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => navigation.navigate("AdminOrdersScreen")}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex-row items-center justify-between mb-2.5"
                style={{
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                }}
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3 border border-orange-100">
                    <MaterialCommunityIcons name="package-variant-closed" size={20} color="#E07B39" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>
                      #{pkg.id.slice(-6).toUpperCase()} • {pkg.name || "Khách đặt"}
                    </Text>
                    <Text className="text-gray-400 text-[11px] mt-0.5" numberOfLines={1}>
                      {pkg.address || "Giao hàng"}
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
        )}

        {/* Footer Support */}
        <View className="mt-4 items-center">
          <TouchableOpacity className="flex-row items-center bg-gray-100/60 px-5 py-2.5 rounded-2xl">
            <MaterialCommunityIcons name="help-circle-outline" size={18} color="#6B7280" />
            <Text className="ml-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
              Cần hỗ trợ kỹ thuật?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
