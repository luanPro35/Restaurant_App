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
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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

  const { messages, isLoading, sendMessage: sendChatMessage, sendImageMessage } = useChatMessages(user, conversationId);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để gửi ảnh.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await sendImageMessage(result.assets[0].uri);
    }
  };

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
          className={`px-3 py-2 rounded-2xl ${isMe
            ? "bg-[#E07B39] rounded-br-sm"
            : "bg-white rounded-bl-sm shadow-sm"
            } ${item.type === "IMAGE" ? "p-1" : ""}`}
        >
          {item.type === "IMAGE" ? (
            <Image 
              source={{ uri: item.text }} 
              style={{ width: 200, height: 200, borderRadius: 12 }} 
              resizeMode="cover" 
            />
          ) : (
            <Text className={`text-base px-1 ${isMe ? "text-white" : "text-gray-800"}`}>
              {item.text}
            </Text>
          )}
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
        <TouchableOpacity
          onPress={pickImage}
          className="p-3 mr-2 bg-gray-100 rounded-full items-center justify-center"
          style={{ height: 44, width: 44 }}
        >
          <MaterialCommunityIcons name="image-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>

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

      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <ActivityIndicator size="large" color="#E07B39" />
          <Text className="text-white mt-2 font-bold">Đang gửi ảnh...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
