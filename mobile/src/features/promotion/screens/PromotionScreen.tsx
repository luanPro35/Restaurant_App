import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PromotionCard from "../components/PromotionCard";
import VoucherItem from "../components/VoucherItem";
import { usePromotion } from "../hooks/usePromotion";

type TabType = "promotions" | "notifications";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Đơn hàng #1234 đã giao thành công",
    time: "2 giờ trước",
    icon: "check-circle",
    color: "#4CAF50",
    read: false,
  },
  {
    id: "n2",
    title: "Bạn có mã giảm giá sắp hết hạn",
    time: "5 giờ trước",
    icon: "ticket-confirmation",
    color: "#E07B39",
    read: true,
  },
  {
    id: "n3",
    title: "Nhà hàng nghỉ tết từ 01/02 - 05/02",
    time: "1 ngày trước",
    icon: "calendar-alert",
    color: "#2196F3",
    read: true,
  },
];

export default function PromotionScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("promotions");
  const { promotions, loading, error, fetchPromotions } = usePromotion();

  const renderNotification = ({
    item,
  }: {
    item: (typeof NOTIFICATIONS)[0];
  }) => (
    <View
      className={`flex-row p-4 border-b border-gray-100 items-center ${item.read ? "bg-white" : "bg-[#FFF9F2]"}`}
    >
      <View
        className={`w-12 h-12 rounded-full justify-center items-center mr-4`}
        style={{ backgroundColor: `${item.color}20` }}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={24}
          color={item.color}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base mb-1 text-[#2D2D2D] ${item.read ? "font-normal" : "font-bold"}`}
        >
          {item.title}
        </Text>
        <Text className="text-xs text-gray-400">{item.time}</Text>
      </View>
      {!item.read && <View className="w-2 h-2 rounded-full bg-[#E07B39]" />}
    </View>
  );

  const renderNotPromotion = () => {
    return (
      <View className="py-20 items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200">
        <MaterialCommunityIcons
          name="ticket-percent-outline"
          size={48}
          color="#D1D5DB"
        />
        <Text className="text-gray-400 mt-2">
          Không có chương trình khuyến mãi nào
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E91E63" />

      <View className="bg-[#E91E63] pt-12 pb-4 rounded-b-3xl shadow-lg elevation-8">
        <View className="flex-row justify-between items-center px-4 mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">
              Ưu Đãi & Thông Báo
            </Text>
          </View>
          <TouchableOpacity className="p-2">
            <MaterialCommunityIcons name="bell-ring" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row px-4">
          <TouchableOpacity
            onPress={() => setActiveTab("promotions")}
            className={`flex-1 py-2 items-center border-b-4 ${activeTab === "promotions" ? "border-white" : "border-transparent"}`}
          >
            <Text
              className={`text-white font-bold text-base ${activeTab === "promotions" ? "opacity-100" : "opacity-70"}`}
            >
              Khuyến Mãi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("notifications")}
            className={`flex-1 py-2 items-center border-b-4 ${activeTab === "notifications" ? "border-white" : "border-transparent"}`}
          >
            <Text
              className={`text-white font-bold text-base ${activeTab === "notifications" ? "opacity-100" : "opacity-70"}`}
            >
              Thông Báo (3)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1">
        {activeTab === "promotions" ? (
          <ScrollView
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-6">
              <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
                Mã Giảm Giá Của Bạn
              </Text>
              {loading ? (
                <View className="py-4 items-center">
                  <Text className="text-gray-400">Đang tải mã giảm giá...</Text>
                </View>
              ) : promotions.length > 0 ? (
                promotions
                  .filter((p) => p.code)
                  .map((item) => <VoucherItem key={item.id} item={item} />)
              ) : (
                <View className="py-10 items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Text className="text-gray-400">
                    Bạn chưa có mã giảm giá nào
                  </Text>
                </View>
              )}
            </View>

            <View>
              <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
                Chương Trình Nổi Bật
              </Text>
              {loading ? (
                <View className="py-20 items-center justify-center">
                  <Text className="text-gray-400">Đang tải khuyến mãi...</Text>
                </View>
              ) : promotions.length > 0 ? (
                promotions.map((item) => (
                  <PromotionCard
                    key={item.id}
                    item={{
                      id: item.id,
                      title: item.name,
                      description: item.description || "",
                      image:
                        item.image ||
                        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                      discount: `-${item.discount}%`,
                      expiryDate: item.until,
                    }}
                    onPress={(promo) =>
                      console.log("Press promo:", promo.title)
                    }
                  />
                ))
              ) : (
                renderNotPromotion()
              )}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={NOTIFICATIONS}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}
