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
  const { currentOrders, claimedIds, loading, handleClaim, count } = useMilestones();

  const getStatus = (threshold: number, id: number) => {
    if (claimedIds.includes(id)) return "claimed";
    if ((currentOrders + count) >= threshold) return "claimable";
    return "locked";
  };

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
            paddingTop: 64,
            paddingBottom: 40,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View className="absolute top-0 left-0 right-0 bottom-0 z-50 items-center justify-center bg-[#1A1A2E]/50">
              <ActivityIndicator size="large" color="#E07B39" />
            </View>
          )}

          <View className="flex-row justify-between items-center mb-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center border border-white/10"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-white font-black text-xl tracking-tighter uppercase">
              Chỉ Tiêu Thưởng
            </Text>
            <View className="w-12" />
          </View>

          <View className="flex-row mb-10">
            <View
              className="flex-1 mr-2"
              style={{
                borderRadius: 28,
                backgroundColor: "#1A1A2E",
                ...Platform.select({
                  ios: {
                    shadowColor: "#E07B39",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                  },
                })
              }}
            >
              <LinearGradient
                colors={["#E07B39", "#E91E63"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 28, padding: 20 }}
                className="flex-1"
              >
                <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mb-3">
                  <MaterialCommunityIcons name="silverware-variant" size={24} color="white" />
                </View>
                <Text className="text-white/80 text-[10px] font-bold mb-1 uppercase tracking-wider" numberOfLines={1}>
                  Tại nhà hàng
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-white font-black text-3xl">{currentOrders}</Text>
                  <Text className="text-white/70 text-[10px] font-bold ml-1">đơn</Text>
                </View>
                <View className="h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min((currentOrders / 30) * 100, 100)}%` }}
                  />
                </View>
              </LinearGradient>
            </View>

            <View
              className="flex-1 ml-2"
              style={{
                borderRadius: 28,
                backgroundColor: "#1A1A2E",
                ...Platform.select({
                  ios: {
                    shadowColor: "#4A90E2",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                  },
                })
              }}
            >
              <LinearGradient
                colors={["#4A90E2", "#3F51B5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 28, padding: 20 }}
                className="flex-1"
              >
                <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mb-3">
                  <MaterialCommunityIcons name="truck-delivery" size={24} color="white" />
                </View>
                <Text className="text-white/80 text-[10px] font-bold mb-1 uppercase tracking-wider" numberOfLines={1}>
                  Giao hàng
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-white font-black text-3xl">{count}</Text>
                  <Text className="text-white/70 text-[10px] font-bold ml-1">đơn</Text>
                </View>
                <View className="h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{ width: `${Math.min((count / 30) * 100, 100)}%` }}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>

          <Text className="text-white font-black text-2xl mb-6 uppercase tracking-tighter">
            Danh sách mốc thưởng
          </Text>

          <View className="gap-y-4">
            {MILESTONES.map((item) => {
              const status = getStatus(item.threshold, item.id);

              return (
                <View
                  key={item.id}
                  className={`flex-row items-center p-5 rounded-3xl border ${status === "locked"
                    ? "bg-white/5 border-white/5"
                    : "bg-white/10 border-white/10"
                    }`}
                >
                  <View
                    style={{ backgroundColor: item.color }}
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                  >
                    <MaterialCommunityIcons
                      name={status === "claimed" ? "check-bold" : "gift"}
                      size={28}
                      color="white"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">
                      {item.label}
                    </Text>
                    <Text className="text-gray-400 font-medium">
                      Thưởng: {item.reward}
                    </Text>
                  </View>

                  {status === "claimable" ? (
                    <TouchableOpacity
                      onPress={() => handleClaim(item)}
                      className="bg-orange-500 px-5 py-2.5 rounded-2xl"
                    >
                      <Text className="text-white font-black text-sm uppercase">
                        Nhận
                      </Text>
                    </TouchableOpacity>
                  ) : status === "claimed" ? (
                    <View className="bg-white/10 px-4 py-2.5 rounded-2xl flex-row items-center">
                      <Text className="text-gray-400 font-bold text-sm uppercase">
                        Đã nhận
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 font-bold text-sm mr-1">
                        {currentOrders + count}/{item.threshold}
                      </Text>
                      <MaterialCommunityIcons
                        name="lock"
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View className="mt-10 flex-row items-center bg-white/5 p-5 rounded-[24px] border border-white/5">
            <MaterialCommunityIcons
              name="information"
              size={24}
              color="#E07B39"
            />
            <Text className="text-gray-400 text-xs ml-3 flex-1 leading-5">
              Chỉ tiêu được tính dựa trên số lượng đơn hàng hoàn thành trong
              tháng. Phần thưởng sẽ được cộng trực tiếp vào ví của bạn.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
