import React, { useState, useRef } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminChatDetail } from "../../hooks/useAdminChat";

export default function AdminChatDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { conversationId } = route.params;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  
  const { messages, loading, isSendingImage, sendMessage, sendImageMessage } = useAdminChatDetail(conversationId);
  const [inputText, setInputText] = useState("");

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

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
    Keyboard.dismiss();
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isAdmin = item.senderRole === "admin";

    return (
      <View className={`mb-4 max-w-[80%] ${isAdmin ? "self-end" : "self-start"}`}>
        <View
          className={`px-3 py-2 rounded-2xl ${
            isAdmin ? "bg-[#E07B39] rounded-br-sm" : "bg-white rounded-bl-sm shadow-sm"
          } ${item.type === "IMAGE" ? "p-1" : ""}`}
        >
          {item.type === "IMAGE" ? (
            <Image 
              source={{ uri: item.content }} 
              style={{ width: 200, height: 200, borderRadius: 12 }} 
              resizeMode="cover" 
            />
          ) : (
            <Text className={`text-base px-1 py-1 ${isAdmin ? "text-white" : "text-gray-800"}`}>
              {item.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F3F4F6" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="bg-white flex-row items-center px-4 pb-4 border-b border-gray-200"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialCommunityIcons name="arrow-left" size={28} color="#E07B39" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">
          Khách {conversationId.slice(-4).toUpperCase()}
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

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
            placeholder="Phản hồi khách hàng..."
            multiline
            className="text-base text-gray-800"
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          className={`ml-3 p-3 rounded-full ${inputText.trim() ? "bg-[#E07B39]" : "bg-gray-200"}`}
        >
          <MaterialCommunityIcons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {isSendingImage && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <ActivityIndicator size="large" color="#E07B39" />
          <Text className="text-white mt-2 font-bold">Đang gửi ảnh...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

