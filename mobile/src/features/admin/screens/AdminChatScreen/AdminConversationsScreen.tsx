import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminConversations } from "../../hooks/useAdminChat";

export default function AdminConversationsScreen() {
  const { conversations, loading, refreshing, onRefresh } = useAdminConversations();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => {
    const latestMessage = item.messages?.[0];
    const isUnread = latestMessage && latestMessage.senderRole !== "admin";

    return (
      <TouchableOpacity
        className="flex-row items-center p-4 bg-white border-b border-gray-100"
        onPress={() => navigation.navigate("AdminChatDetail", { conversationId: item.id })}
      >
        <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center mr-4">
          <MaterialCommunityIcons name="account" size={30} color="#E07B39" />
        </View>
        <View className="flex-1">
          <Text className={`text-base mb-1 text-gray-800 ${isUnread ? "font-bold" : "font-medium"}`}>
            Khách hàng #{item.id.slice(-4).toUpperCase()}
          </Text>
          <Text
            className={`text-sm ${isUnread ? "text-gray-800 font-medium" : "text-gray-500"}`}
            numberOfLines={1}
          >
            {latestMessage 
              ? `${latestMessage.senderRole === "admin" ? "Bạn: " : ""}${latestMessage.content}` 
              : "Bắt đầu cuộc trò chuyện"}
          </Text>
        </View>
        {isUnread && (
          <View className="w-3 h-3 bg-[#E07B39] rounded-full" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" />
      <View
        className="bg-[#E07B39] flex-row items-center px-4 pb-4"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Tin nhắn khách hàng</Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons name="message-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-400 mt-4 font-medium">Chưa có cuộc trò chuyện nào</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#E07B39"]}
            />
          }
        />
      )}
    </View>
  );
}

