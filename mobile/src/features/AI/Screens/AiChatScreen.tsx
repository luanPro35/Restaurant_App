import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  ScrollView as RNScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Message } from "../../../services/api/api-ai";
import { useCart } from "../../../app/context/CartContext";
import { useAuth } from "../../../app/context/AuthContext";
import AiChoose from "./AiChoose";
import { useAiChat } from "../hooks/useAiChat";
import { Config } from "../../../config";

const ProductCard = ({ product, navigation, addToCart }: any) => {
  const imageUrl = (() => {
    const rawImage = product.image || product.images;
    if (!rawImage) return 'https://via.placeholder.com/400x300/E07B39/ffffff?text=' + encodeURIComponent(product.name);

    let url = rawImage;
    try {
      if (typeof rawImage === 'string' && rawImage.startsWith('[')) {
        const parsed = JSON.parse(rawImage);
        url = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : rawImage;
      } else if (typeof rawImage === 'string' && rawImage.includes(',')) {
        url = rawImage.split(',')[0];
      }
    } catch (e) {
      url = rawImage;
    }

    if (typeof url === "string" && url.length > 0) {
      if (url.startsWith("http")) return url;
      return `${Config.API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return url;
  })();

  return (
    <View
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mr-3"
      style={{ width: 160, elevation: 4 }}
    >
      <Image
        key={imageUrl}
        source={{ uri: imageUrl }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-gray-800 font-bold text-xs mb-1" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-[#E07B39] font-black text-sm mb-2">
          {(product.price || 0).toLocaleString('vi-VN')}đ
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => navigation?.navigate("DetailProduct", { id: product.id })}
            className="bg-orange-50 p-2 rounded-lg flex-1 mr-2 items-center"
          >
            <MaterialCommunityIcons name="eye" size={16} color="#E07B39" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => addToCart(product)}
            className="bg-[#E07B39] p-2 rounded-lg flex-1 items-center"
          >
            <MaterialCommunityIcons name="cart-plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ChatFooter = ({ isTyping }: { isTyping: boolean }) => {
  if (isTyping) return null;
  return (
    <View className="mt-4 mb-2" />
  );
};

export default function AiChatScreen({ route, navigation }: { route: any, navigation: any }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const navigationRef = useRef(navigation);

  useEffect(() => {
    navigationRef.current = navigation;
  }, [navigation]);

  const initialMsg = route?.params?.initialMessage || (route?.params?.product ? `Tôi muốn tìm món liên quan đến ${route.params.product}` : null);

  const { messages, isTyping, sendMessageWithText } = useAiChat(user, initialMsg);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessageWithText(inputText.trim());
      setInputText("");
    }
  };

  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View
        className={`mb-4 ${item.isMe ? "self-end max-w-[85%]" : "self-start w-full"}`}
      >
        <View
          className={`px-4 py-3 rounded-2xl ${item.isMe
            ? "bg-[#E07B39] rounded-br-sm shadow-sm max-w-[85%] self-end"
            : "bg-white rounded-bl-sm shadow-sm border border-gray-100 max-w-[85%]"
            }`}
        >
          <Text
            className={`text-base ${item.isMe ? "text-white" : "text-gray-800"}`}
          >
            {item.text}
          </Text>
          {!item.isMe && item.productId && !item.recommendedProducts && (
            <TouchableOpacity
              onPress={() =>
                navigationRef.current?.navigate("DetailProduct", { id: item.productId })
              }
              className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-center bg-orange-50/50 rounded-xl py-2"
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={16}
                color="#E07B39"
              />
              <Text className="ml-2 text-[#E07B39] font-black uppercase text-[10px]">
                Xem chi tiết món này
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!item.isMe && item.recommendedProducts && item.recommendedProducts.length > 0 && (
          <View className="mt-3">
            <RNScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
            >
              {item.recommendedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  navigation={navigationRef.current}
                  addToCart={addToCart}
                />
              ))}
            </RNScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9F6E7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
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
          <Text className="text-lg font-black text-gray-800">
            AI Tư vấn món ăn
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            <Text className="text-xs text-green-500 font-bold">
              AI đang sẵn sàng
            </Text>
          </View>
        </View>
        <TouchableOpacity className="p-2 bg-orange-50 rounded-full">
          <MaterialCommunityIcons name="robot" size={24} color="#E07B39" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<ChatFooter isTyping={isTyping} />}
        onContentSizeChange={() => {
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          });
        }}
      />

      <View className="bg-white/80 border-t border-gray-100 px-4 py-3 pb-8">
        {isTyping && (
          <View className="mb-3">
            <View className="flex-row items-center bg-white/50 self-start px-4 py-2 rounded-full border border-gray-100">
              <ActivityIndicator size="small" color="#E07B39" />
              <Text className="ml-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                AI đang phân tích yêu cầu...
              </Text>
            </View>
          </View>
        )}
        
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1">
          <TextInput
            multiline
            placeholder="Bạn muốn ăn món gì hôm nay?"
            className="flex-1 text-gray-800 text-sm py-2"
            value={inputText}
            onChangeText={setInputText}
            style={{ maxHeight: 100 }}
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full ${inputText.trim() ? "bg-[#E07B39]" : "bg-gray-300"}`}
          >
            <MaterialCommunityIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
