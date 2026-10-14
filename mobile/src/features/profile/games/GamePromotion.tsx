import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useMilestones } from "./hooks/useMilestones";

const { width } = Dimensions.get("window");

export interface Milestone {
  id: number;
  threshold: number;
  reward: string;
  label: string;
  color: string;
  textColor: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 1,
    threshold: 3,
    reward: "10k",
    label: "3 đơn hàng",
    color: "#E07B39",
    textColor: "#FFF",
  },
  {
    id: 2,
    threshold: 5,
    reward: "20k",
    label: "5 đơn hàng",
    color: "#4A90E2",
    textColor: "#FFF",
  },
  {
    id: 3,
    threshold: 10,
    reward: "40k",
    label: "10 đơn hàng",
    color: "#8257E5",
    textColor: "#FFF",
  },
  {
    id: 4,
    threshold: 15,
    reward: "60k",
    label: "15 đơn hàng",
    color: "#F5A623",
    textColor: "#FFF",
  },
  {
    id: 5,
    threshold: 20,
    reward: "80k",
    label: "20 đơn hàng",
    color: "#7ED321",
    textColor: "#FFF",
  },
  {
    id: 6,
    threshold: 30,
    reward: "100k",
    label: "30 đơn hàng",
    color: "#D0021B",
    textColor: "#FFF",
  },
];

export default function GamePromotion() {
  const navigation = useNavigation();
  const {
    currentOrders,
    claimedIds,
    loading,
    handleClaim,
    count,
    cycleMonth,
    daysRemaining,
    resetDate,
    refreshAll,
  } = useMilestones();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);

  const totalMonthlyOrders = currentOrders + count;
  const isMaxReached = totalMonthlyOrders >= 30;

  const getStatus = (threshold: number, id: number) => {
    if (claimedIds.includes(id)) return "claimed";
    if (totalMonthlyOrders >= threshold) return "claimable";
    return "locked";
  };

  const currentMonthStr = cycleMonth || `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  return (
    <View className="flex-1 bg-[#1A1A2E]">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={["#1A1A2E", "#16213E", "#0F3460"]}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: 60,
            paddingBottom: 50,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#E07B39"
              colors={["#E07B39"]}
            />
          }
        >
          {loading && !refreshing && (
            <View className="absolute top-0 left-0 right-0 bottom-0 z-50 items-center justify-center bg-[#1A1A2E]/50">
              <ActivityIndicator size="large" color="#E07B39" />
            </View>
          )}

          {/* Top Bar */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center border border-white/10"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={26}
                color="white"
              />
            </TouchableOpacity>
            <View className="items-center">
              <Text className="text-white font-black text-lg tracking-tight uppercase">
                Chỉ Tiêu Thưởng
              </Text>
              <Text className="text-[#E07B39] text-[10px] font-black tracking-widest uppercase">
                Chu kỳ Tháng {currentMonthStr}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onRefresh}
              className="w-11 h-11 bg-white/10 rounded-2xl items-center justify-center border border-white/10"
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color="#E07B39"
              />
            </TouchableOpacity>
          </View>

          {/* Monthly Cycle Banner (Chu kỳ tháng & Tự động reset) */}
          <View className="bg-white/10 rounded-3xl p-4 mb-6 border border-white/15">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-xl bg-orange-500/20 items-center justify-center mr-2.5 border border-orange-500/30">
                  <MaterialCommunityIcons name="calendar-clock" size={18} color="#E07B39" />
                </View>
                <View>
                  <Text className="text-white font-black text-xs">
                    Chương trình Tháng {currentMonthStr}
                  </Text>
                  <Text className="text-gray-400 text-[10px]">
                    Làm mới vào ngày {resetDate || "01 hàng tháng"}
                  </Text>
                </View>
              </View>
              <View className="bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/40">
                <Text className="text-[#E07B39] font-black text-[10px]">
                  ⏳ Còn {daysRemaining > 0 ? `${daysRemaining} ngày` : "Hôm nay"}
                </Text>
              </View>
            </View>

            <View className="bg-black/20 p-2.5 rounded-2xl">
              <Text className="text-gray-300 text-[11px] leading-4">
                ● Tích lũy tối đa <Text className="font-black text-white">30 đơn/tháng</Text>.
                Sang tháng mới, số đơn và mốc thưởng sẽ <Text className="font-black text-[#E07B39]">tự động reset</Text> để bạn tiếp tục gom thưởng mới!
              </Text>
            </View>
          </View>

          {/* Max Reached Milestone Celebration Banner (Khi đạt 30 đơn) */}
          {isMaxReached && (
            <LinearGradient
              colors={["#FFD700", "#FFA500", "#FF4500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-3xl p-4 mb-6 shadow-xl"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-3">
                  <MaterialCommunityIcons name="trophy-award" size={28} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-black text-sm uppercase tracking-tight">
                    🎉 Hoàn thành xuất sắc 30 đơn!
                  </Text>
                  <Text className="text-white/90 text-[11px] mt-0.5 leading-4">
                    Bạn đã đạt hạn mức tối đa tháng {currentMonthStr}. Đừng quên bấm nhận toàn bộ thưởng bên dưới. Chu kỳ mới sẽ mở vào {resetDate || "đầu tháng sau"}!
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Cards for Dine-in and Delivery Orders */}
          <View className="flex-row mb-6">
            {/* Tại nhà hàng */}
            <View
              className="flex-1 mr-2"
              style={{
                borderRadius: 26,
                backgroundColor: "#1A1A2E",
                ...Platform.select({
                  ios: {
                    shadowColor: "#E07B39",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                  },
                }),
              }}
            >
              <LinearGradient
                colors={["#E07B39", "#E91E63"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 26, padding: 18 }}
                className="flex-1"
              >
                <View className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center mb-2.5">
                  <MaterialCommunityIcons name="silverware-variant" size={20} color="white" />
                </View>
                <Text className="text-white/80 text-[10px] font-bold mb-0.5 uppercase tracking-wider" numberOfLines={1}>
                  Tại nhà hàng
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-white font-black text-3xl">{currentOrders}</Text>
                  <Text className="text-white/70 text-[10px] font-bold ml-1">đơn tháng này</Text>
                </View>
                <View className="h-1.5 bg-white/20 rounded-full mt-2.5 overflow-hidden">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min((currentOrders / 30) * 100, 100)}%` }}
                  />
                </View>
              </LinearGradient>
            </View>

            {/* Giao hàng */}
            <View
              className="flex-1 ml-2"
              style={{
                borderRadius: 26,
                backgroundColor: "#1A1A2E",
                ...Platform.select({
                  ios: {
                    shadowColor: "#4A90E2",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                  },
                }),
              }}
            >
              <LinearGradient
                colors={["#4A90E2", "#3F51B5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 26, padding: 18 }}
                className="flex-1"
              >
                <View className="w-9 h-9 bg-white/20 rounded-xl items-center justify-center mb-2.5">
                  <MaterialCommunityIcons name="truck-delivery" size={20} color="white" />
                </View>
                <Text className="text-white/80 text-[10px] font-bold mb-0.5 uppercase tracking-wider" numberOfLines={1}>
                  Giao hàng
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-white font-black text-3xl">{count}</Text>
                  <Text className="text-white/70 text-[10px] font-bold ml-1">đơn tháng này</Text>
                </View>
                <View className="h-1.5 bg-white/20 rounded-full mt-2.5 overflow-hidden">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min((count / 30) * 100, 100)}%` }}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* List Header with Total Counter */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-black text-lg uppercase tracking-tight">
              Danh sách mốc thưởng
            </Text>
            <View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Text className="text-white font-black text-xs">
                Tổng: {totalMonthlyOrders}/30 đơn
              </Text>
            </View>
          </View>

          {/* Milestones Cards List */}
          <View className="gap-y-3 mb-6">
            {MILESTONES.map((item) => {
              const status = getStatus(item.threshold, item.id);

              return (
                <View
                  key={item.id}
                  className={`flex-row items-center p-4 rounded-3xl border ${
                    status === "locked"
                      ? "bg-white/5 border-white/5"
                      : status === "claimable"
                      ? "bg-orange-500/15 border-orange-500/40"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  <View
                    style={{ backgroundColor: item.color }}
                    className="w-13 h-13 rounded-2xl items-center justify-center mr-3.5"
                  >
                    <MaterialCommunityIcons
                      name={status === "claimed" ? "check-bold" : "gift"}
                      size={26}
                      color="white"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      {item.label}
                    </Text>
                    <Text className="text-gray-400 font-medium text-xs">
                      Thưởng voucher: <Text className="text-[#E07B39] font-black">{item.reward}</Text>
                    </Text>
                  </View>

                  {status === "claimable" ? (
                    <TouchableOpacity
                      onPress={() => handleClaim(item)}
                      activeOpacity={0.8}
                      className="bg-[#E07B39] px-4 py-2.5 rounded-2xl shadow-lg flex-row items-center"
                    >
                      <MaterialCommunityIcons name="hand-coin" size={16} color="white" className="mr-1" />
                      <Text className="text-white font-black text-xs uppercase ml-1">
                        Nhận ngay
                      </Text>
                    </TouchableOpacity>
                  ) : status === "claimed" ? (
                    <View className="bg-white/10 px-3.5 py-2 rounded-2xl flex-row items-center border border-white/10">
                      <MaterialCommunityIcons name="check" size={14} color="#10B981" className="mr-1" />
                      <Text className="text-emerald-400 font-bold text-xs uppercase ml-1">
                        Đã nhận
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                      <Text className="text-gray-400 font-black text-xs mr-1">
                        {totalMonthlyOrders}/{item.threshold}
                      </Text>
                      <MaterialCommunityIcons
                        name="lock"
                        size={14}
                        color="#6B7280"
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Explanation Footer Card */}
          <View className="bg-white/5 p-4 rounded-3xl border border-white/10 flex-row items-start">
            <MaterialCommunityIcons
              name="information"
              size={22}
              color="#E07B39"
              style={{ marginTop: 2 }}
            />
            <View className="ml-3 flex-1">
              <Text className="text-white font-bold text-xs mb-1">
                Quy định mốc thưởng & Chu kỳ tháng:
              </Text>
              <Text className="text-gray-400 text-[11px] leading-4 mb-1">
                1. Tiến trình đơn hàng được tính từ ngày 01 đến ngày cuối cùng của tháng hiện tại.
              </Text>
              <Text className="text-gray-400 text-[11px] leading-4 mb-1">
                2. Khi đạt mốc (3, 5, 10, 15, 20, 30 đơn), bạn có thể bấm nhận voucher ngay lập tức.
              </Text>
              <Text className="text-gray-400 text-[11px] leading-4">
                3. Khi bước sang tháng mới, hệ thống tự động reset số đơn về 0 và mở lại toàn bộ các mốc thưởng để bạn tiếp tục nhận quà mới!
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
