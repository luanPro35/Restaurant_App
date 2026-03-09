import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PromotionCard from "../components/PromotionCard";
import VoucherItem from "../components/VoucherItem";
import { usePromotion } from "../hooks/usePromotion";
import { useNotification } from "../hooks/useNotification";
import Notification from "../components/Notification";
import DetailNotification from "../components/DetailNotification";
import { AdminNotification } from "@/services/api/admin-notification";
import { useMilestones } from "../../profile/games/hooks/useMilestones";
import { MILESTONES } from "../../profile/games/constants/milestones";

type TabType = "promotions" | "notifications";

export default function PromotionScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabType>("promotions");
  const insets = useSafeAreaInsets();
  const {
    promotions,
    loading: loadingPromos,
    fetchPromotions,
  } = usePromotion();

  const { claimedIds, loading: loadingMilestones } = useMilestones();

  const {
    notifications,
    loading: loadingNotifs,
    refreshing,
    handleRefresh,
    total: totalNotifs,
    fetchNotifications,
    getNotificationById,
  } = useNotification();

  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenDetail = async (id: string) => {
    try {
      const detail = await getNotificationById(id);
      setSelectedNotification(detail);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching notification detail:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPromotions({ page: 1, limit: 10 });
      fetchNotifications({ page: 1, limit: 10 });
    }, [fetchPromotions, fetchNotifications]),
  );

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications({ page: 1, limit: 10 });
    }
  }, [activeTab, fetchNotifications]);

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

      <View 
        className="bg-[#E91E63] pb-4 rounded-b-3xl shadow-lg elevation-8"
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
      >
        <View className="flex-row justify-between items-center px-4 mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3 p-1"
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
              Thông Báo {totalNotifs > 0 ? `(${totalNotifs})` : ""}
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
              {(loadingPromos || loadingMilestones) ? (
                <View className="py-4 items-center">
                  <Text className="text-gray-400">Đang tải mã giảm giá...</Text>
                </View>
              ) : (
                <View>
                  {promotions.filter((p: any) => p.code).map((item: any) => (
                    <VoucherItem key={item.id} item={item} />
                  ))}

                  {MILESTONES.filter(m => claimedIds.includes(m.id)).map((milestone) => (
                    <VoucherItem
                      key={`milestone-${milestone.id}`}
                      item={{
                        id: `m-${milestone.id}`,
                        name: `Quà tặng mốc ${milestone.label}`,
                        discount: parseInt(milestone.reward.replace("k", "000")),
                        minOrder: 0,
                        until: "Không thời hạn",
                        code: `REWARD${milestone.id}`,
                        description: `Phần thưởng từ thử thách đặt đơn hàng.`
                      } as any}
                    />
                  ))}

                  {promotions.filter((p: any) => p.code).length === 0 && claimedIds.length === 0 && (
                    <View className="py-10 items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Text className="text-gray-400">
                        Bạn chưa có mã giảm giá nào
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View>
              <Text className="text-lg font-bold text-[#2D2D2D] mb-3">
                Chương Trình Nổi Bật
              </Text>
              {loadingPromos ? (
                <View className="py-20 items-center justify-center">
                  <Text className="text-gray-400">Đang tải khuyến mãi...</Text>
                </View>
              ) : promotions.length > 0 ? (
                promotions.map((item: any) => (
                  <PromotionCard
                    key={item.id}
                    item={{
                      id: item.id,
                      title: item.name,
                      description: item.description || "",
                      image:
                        item.image ||
                        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                      discount: item.discount > 0 ? `-${item.discount}%` : "Mới",
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
        ) : loadingNotifs && notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-gray-400 mt-4">Đang tải thông báo...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <Notification item={item} onPress={handleOpenDetail} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#E91E63"]}
              />
            }
            ListEmptyComponent={
              <View className="py-20 items-center justify-center">
                <MaterialCommunityIcons
                  name="bell-off-outline"
                  size={48}
                  color="#D1D5DB"
                />
                <Text className="text-gray-400 mt-2">
                  Không có thông báo nào
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {selectedNotification && (
          <DetailNotification
            item={selectedNotification}
            onClose={() => setIsModalVisible(false)}
          />
        )}
      </Modal>
    </View>
  );
}
