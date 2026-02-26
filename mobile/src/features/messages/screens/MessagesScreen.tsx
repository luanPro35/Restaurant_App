import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MessageItem from "../components/MessageItem";
import { useNotification } from "../../promotion/hooks/useNotification";
import DetailNotification from "../../promotion/components/DetailNotification";
import { AdminNotification } from "@/services/api/admin-notification";

export default function MessagesScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    notifications,
    loading,
    refreshing,
    handleRefresh,
    fetchNotifications,
    getNotificationById,
  } = useNotification();

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 });
  }, []);

  const handleOpenDetail = async (id: string) => {
    try {
      const detail = await getNotificationById(id);
      setSelectedNotification(detail);
      setIsModalVisible(true);
    } catch (error) {
      const basicInfo = notifications.find((n) => n.id === id);
      if (basicInfo) {
        setSelectedNotification(basicInfo);
        setIsModalVisible(true);
      }
    }
  };

  const filteredNotifications = notifications.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (note.description || note.content || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg z-10">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Thông báo</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="check-all" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View className="bg-white/20 flex-row items-center px-4 py-2.5 rounded-xl border border-white/10">
          <MaterialCommunityIcons name="magnify" size={20} color="white" />
          <TextInput
            placeholder="Tìm kiếm thông báo..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 ml-2 text-white text-base"
          />
          {searchText !== "" && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#E07B39"]}
          />
        }
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#2D2D2D]">Mới nhất</Text>
          <TouchableOpacity>
            <Text className="text-[#E07B39] text-xs font-bold">
              Đánh dấu tất cả đã đọc
            </Text>
          </TouchableOpacity>
        </View>

        {loading && notifications.length === 0 ? (
          <ActivityIndicator color="#E07B39" className="my-10" />
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((note) => (
            <MessageItem
              key={note.id}
              notification={note}
              onPress={handleOpenDetail}
            />
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={48}
              color="#D1D5DB"
            />
            <Text className="text-gray-400 mt-2 font-medium">
              Bạn chưa có thông báo nào
            </Text>
          </View>
        )}

        <View className="items-center mt-6 mb-10">
          <Text className="text-gray-400 text-sm">
            Bạn đã xem hết thông báo
          </Text>
        </View>
      </ScrollView>

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
