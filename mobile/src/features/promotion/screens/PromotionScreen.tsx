import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PromotionCard from "../components/PromotionCard";
import VoucherItem from "../components/VoucherItem";

type TabType = "promotions" | "notifications";

// Mock Data
const PROMOTIONS = [
  {
    id: "1",
    title: "Siêu Sale Cuối Tuần",
    description:
      "Giảm giá 50% cho tất cả các món lẩu vào tối thứ 7 và Chủ nhật hàng tuần.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: "-50%",
    expiryDate: "30/06/2026",
  },
  {
    id: "2",
    title: "Combo Gia Đình",
    description:
      "Tặng ngay 1 bình nước ngọt 1.5L khi gọi Combo Gia Đình 4 người.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: "TẶNG NƯỚC",
    expiryDate: "15/07/2026",
  },
];

const VOUCHERS = [
  {
    id: "v1",
    code: "WELCOME50",
    discount: "50K",
    minOrder: "200K",
    expiryDate: "31/12/2026",
    title: "Giảm 50K cho bạn mới",
  },
  {
    id: "v2",
    code: "FREESHIP",
    discount: "15K",
    minOrder: "100K",
    expiryDate: "30/06/2026",
    title: "Mã Freeship đơn 100K",
  },
  {
    id: "v3",
    code: "SALE20",
    discount: "20%",
    minOrder: "500K",
    expiryDate: "30/06/2026",
    title: "Giảm 20% tối đa 100K",
  },
];

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

export default function PromotionScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>("promotions");

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
              {VOUCHERS.map((item) => (
                <VoucherItem key={item.id} item={item} />
              ))}
            </View>

            <View>
              <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
                Chương Trình Nổi Bật
              </Text>
              {PROMOTIONS.map((item) => (
                <PromotionCard
                  key={item.id}
                  item={item}
                  onPress={(item) => console.log("Press promo:", item.title)}
                />
              ))}
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
