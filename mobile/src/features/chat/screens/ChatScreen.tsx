import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../app/context/AuthContext";
import { useChatMessages, Message } from "../hooks/useChatMessages";

export default function ChatScreen({ navigation }: { navigation: any }) {
  const [inputText, setInputText] = useState("");
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuth();
  const conversationId = user?.id || "default_room";

  const { messages, isLoading, sendMessage: sendChatMessage } = useChatMessages(user, conversationId);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText("");
    Keyboard.dismiss();
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View
        className={`mb-4 max-w-[80%] ${isMe ? "self-end" : "self-start"
          }`}
      >
        <View
          className={`px-4 py-3 rounded-2xl ${isMe
            ? "bg-[#E07B39] rounded-br-sm"
            : "bg-white rounded-bl-sm shadow-sm"
            }`}
        >
          <Text className={`text-base ${isMe ? "text-white" : "text-gray-800"}`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9F6E7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100 shadow-sm z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 p-2 rounded-full bg-orange-50"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#E07B39" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-black text-gray-800">Tư vấn trực tiếp</Text>
          <Text className="text-xs text-green-500 font-medium">Nhân viên đang online</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <MaterialCommunityIcons name="chat-processing-outline" size={60} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center px-10">Bắt đầu trò chuyện với nhân viên. Chúng tôi luôn sẵn sàng hỗ trợ bạn.</Text>
          </View>
        }
      />

      <View
        className="bg-white px-4 py-3 border-t border-gray-100 flex-row items-end"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 min-h-[44px] max-h-[120px] justify-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#9CA3AF"
            multiline
            className="text-base text-gray-800 padding-0 m-0"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          />
        </View>

        <TouchableOpacity
          onPress={sendMessage}
          disabled={!inputText.trim()}
          className={`ml-3 p-3 rounded-full ${inputText.trim() ? "bg-[#E07B39]" : "bg-gray-200"
            }`}
        >
          <MaterialCommunityIcons
            name="send"
            size={20}
            color={inputText.trim() ? "white" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
