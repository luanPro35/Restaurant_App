import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAiFoodRecognition } from "./useAi_food_recognition";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { resolveImageUrl, formatCurrency } from "../../shared/utils";

export default function AI_FoodScreen() {
  const navigation = useNavigation();
  const { recognizeFood, loading, error, data, resetData } = useAiFoodRecognition();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>("");

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Quyền truy cập", "Bạn cần cấp quyền truy cập máy ảnh để chụp hình món ăn.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (asset.base64) {
        setImageBase64(asset.base64);
      }
      resetData();
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Quyền truy cập", "Bạn cần cấp quyền truy cập thư viện ảnh để chọn hình món ăn.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (asset.base64) {
        setImageBase64(asset.base64);
      }
      resetData();
    }
  };

  const handleRecognize = () => {
    if (!imageBase64) {
      Alert.alert("Thiếu hình ảnh", "Vui lòng chụp hoặc chọn ảnh món ăn trước khi phân tích!");
      return;
    }
    recognizeFood(imageBase64, userPrompt);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar barStyle="light-content" />

      {/* Header chuẩn iPhone Notch / Dynamic Island */}
      <LinearGradient
        colors={["#E07B39", "#F39C12"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Platform.OS === "ios" ? 12 : 36,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
              <MaterialCommunityIcons name="camera-iris" size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white" numberOfLines={1}>
                AI Scan & Nhận Diện Món
              </Text>
              <Text className="text-xs text-white/80 font-medium" numberOfLines={1}>
                Quét ảnh món ăn & Đề xuất thực đơn
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Tải lên hình ảnh */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-3 flex-row items-center">
            <FontAwesome5 name="camera" size={14} color="#E07B39" /> Tải lên hình ảnh món ăn
          </Text>

          {/* Preview Ảnh */}
          {imageUri ? (
            <View className="relative mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: 200, borderRadius: 12 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => {
                  setImageUri(null);
                  setImageBase64(null);
                  resetData();
                }}
                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="border-2 border-dashed border-gray-300 rounded-xl p-5 items-center justify-center bg-gray-50 mb-3">
              <MaterialCommunityIcons name="image-search-outline" size={40} color="#9CA3AF" />
              <Text className="text-xs font-semibold text-gray-500 mt-2 text-center">
                Chụp hình hoặc chọn ảnh món ăn từ thư viện
              </Text>
            </View>
          )}

          {/* Nút bấm Chọn/Chụp ảnh */}
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.8}
              className="w-[48%] bg-orange-50 border border-orange-200 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="camera-outline" size={18} color="#E07B39" />
              <Text className="text-[#E07B39] font-bold text-xs ml-1.5">Chụp Ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className="w-[48%] bg-amber-50 border border-amber-200 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="images-outline" size={18} color="#D97706" />
              <Text className="text-amber-700 font-bold text-xs ml-1.5">Thư Viện</Text>
            </TouchableOpacity>
          </View>

          {/* Ghi chú tùy chọn */}
          <Text className="text-[11px] font-semibold text-gray-600 mb-1">Ghi chú hoặc câu hỏi cho AI (không bắt buộc)</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-3">
            <Ionicons name="chatbox-ellipses-outline" size={16} color="#9CA3AF" />
            <TextInput
              placeholder="VD: Món này có nhiều calo không?"
              value={userPrompt}
              onChangeText={setUserPrompt}
              className="flex-1 ml-2 text-xs text-gray-800 font-medium"
            />
          </View>

          {/* Nút Phân Tích */}
          <TouchableOpacity
            onPress={handleRecognize}
            disabled={loading || !imageBase64}
            activeOpacity={0.8}
            style={{ opacity: !imageBase64 || loading ? 0.6 : 1 }}
          >
            <LinearGradient
              colors={["#E07B39", "#F39C12"]}
              style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row" }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text className="text-white font-bold text-sm ml-2">
                    Phân Tích Món Ăn Ngay
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Lỗi nếu có */}
        {error && (
          <View className="bg-red-50 border border-red-200 p-3 rounded-xl mb-4 flex-row items-center">
            <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
            <Text className="text-red-600 font-medium text-xs ml-2 flex-1">{error}</Text>
          </View>
        )}

        {/* Kết quả phân tích AI */}
        {data && data.success && (
          <View className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="robot" size={20} color="#D97706" />
              <Text className="text-sm font-bold text-amber-900 ml-2">
                Kết Quả Phân Tích Món Ăn
              </Text>
            </View>

            {data.recognizedFoodName ? (
              <View className="bg-white/90 p-2.5 rounded-xl border border-amber-200 mb-2 flex-row items-center justify-between">
                <Text className="text-xs text-amber-800 font-semibold">Tên món nhận diện:</Text>
                <Text className="text-xs font-black text-[#E07B39]">{data.recognizedFoodName}</Text>
              </View>
            ) : null}

            <Text className="text-xs text-amber-950 leading-5 font-medium">
              {data.aiResult}
            </Text>
          </View>
        )}

        {/* Đề xuất Thực đơn */}
        {data && data.matchingMenuProducts && data.matchingMenuProducts.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-800 mb-2.5">
              Món Ăn Tương Tự Trong Thực Đơn ({data.matchingMenuProducts.length})
            </Text>

            {data.matchingMenuProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => (navigation as any).navigate("DetailProduct", { id: item.id })}
                activeOpacity={0.8}
                className="bg-white p-3 rounded-xl mb-2.5 shadow-sm border border-gray-100 flex-row items-center justify-between"
              >
                <Image
                  source={{ uri: resolveImageUrl(item.image || item.images) }}
                  style={{ width: 68, height: 68, borderRadius: 10, backgroundColor: "#F3F4F6" }}
                  resizeMode="cover"
                />

                <View className="flex-1 ml-3 pr-2">
                  <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5" numberOfLines={2}>
                    {item.description || "Món ăn có sẵn tại nhà hàng, đặt ngay!"}
                  </Text>
                  <Text className="text-xs font-bold text-[#E07B39] mt-1">
                    {formatCurrency(item.price)}
                  </Text>
                </View>

                <View className="bg-orange-50 p-1.5 rounded-full border border-orange-100">
                  <Ionicons name="chevron-forward" size={14} color="#E07B39" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
