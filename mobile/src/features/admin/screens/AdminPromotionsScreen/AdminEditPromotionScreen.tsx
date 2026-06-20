import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useAdminPromotion } from "../../hooks/useAdminPromotion";
import { promotionApi } from "../../../../services/api/api-promotion";

type RouteProps = RouteProp<AdminStackParamList, "AdminEditPromotionScreen">;

const InputField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  hint,
}: any) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-2 ml-1">
      <Text className="text-gray-800 font-black text-[12px] uppercase tracking-[1px]">{label}</Text>
    </View>
    <View
      className="flex-row items-center bg-white px-4 h-14 border border-gray-100 shadow-sm"
      style={{ borderRadius: 20 }}
    >
      <MaterialCommunityIcons name={icon} size={20} color="#E07B39" />
      <TextInput
        className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
    {hint ? (
      <Text className="text-gray-400 text-[10px] font-bold mt-1.5 ml-1 lowercase italic opacity-70">
        * {hint}
      </Text>
    ) : null}
  </View>
);

export default function AdminEditPromotionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const route = useRoute<RouteProps>();
  const { promotionId } = route.params;

  const { updatePromotion } = useAdminPromotion();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [code, setCode] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [image, setImage] = useState("");
  const [until, setUntil] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promotionIdLoaded, setPromotionIdLoaded] = useState("");

  useEffect(() => {
    const loadPromotion = async () => {
      setLoadingData(true);
      try {
        const data = await useAdminPromotionSingleFetch(promotionId);
        if (data) {
          setName(data.name);
          setDiscount(String(data.discount));
          setCode(data.code || "");
          setMinOrder(data.minOrder ? String(data.minOrder) : "");
          setImage(data.image || "");
          setUntil(data.until ? data.until.slice(0, 10) : "");
          setDescription(data.description || "");
          setIsActive(data.isActive);
          setPromotionIdLoaded(data.id);
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadPromotion();
  }, [promotionId]);

  const useAdminPromotionSingleFetch = async (id: string) => {
    try {
      return await promotionApi.getPromotionById(id);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin khuyến mãi");
      navigation.goBack();
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !discount.trim() || !until.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên, giảm giá và ngày hết hạn.");
      return;
    }
    const discountNum = parseFloat(discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      Alert.alert("Lỗi", "Giảm giá phải là số từ 0 đến 100.");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(until.trim())) {
      Alert.alert("Lỗi", "Ngày hết hạn phải có định dạng YYYY-MM-DD.");
      return;
    }

    setSubmitting(true);
    try {
      await updatePromotion(promotionId, {
        id: promotionId,
        name: name.trim(),
        discount: discountNum,
        until: until.trim(),
        code: code.trim() || undefined,
        minOrder: minOrder.trim() ? parseFloat(minOrder) : undefined,
        image: image.trim() || undefined,
        description: description.trim() || undefined,
        isActive,
      });
      navigation.goBack();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFCF7]">
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#FDFCF7]"
    >
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pb-16 px-6 shadow-2xl"
        style={{ 
          paddingTop: Math.max(insets.top, 20) + 15,
          borderBottomLeftRadius: 45,
          borderBottomRightRadius: 45
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color="white"
            />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Sửa Khuyến Mãi</Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">Hệ thống quản trị</Text>
          </View>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-3xl p-5 mb-6 border border-gray-100"
          style={{ elevation: 3 }}
        >
          <InputField
            label="Tên khuyến mãi"
            icon="tag-outline"
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Giảm giá cuối tuần"
          />
          <InputField
            label="Giảm giá (%)"
            icon="percent-outline"
            value={discount}
            onChangeText={setDiscount}
            placeholder="Ví dụ: 20"
            keyboardType="numeric"
            hint="Nhập số từ 0 đến 100"
          />
          <InputField
            label="Ngày hết hạn"
            icon="calendar-outline"
            value={until}
            onChangeText={setUntil}
            placeholder="YYYY-MM-DD"
            hint="Định dạng: YYYY-MM-DD"
          />

          <InputField
            label="Mã giảm giá (Coupon Code)"
            icon="barcode-scan"
            value={code}
            onChangeText={setCode}
            placeholder="Ví dụ: SALE50"
            hint="Mã áp dụng tại giỏ hàng"
          />

          <InputField
            label="Đơn tối thiểu (VNĐ)"
            icon="cart-arrow-down"
            value={minOrder}
            onChangeText={setMinOrder}
            placeholder="Ví dụ: 100000"
            keyboardType="numeric"
            hint="Giá trị đơn hàng tối thiểu"
          />

          <InputField
            label="Hình ảnh (URL)"
            icon="image-outline"
            value={image}
            onChangeText={setImage}
            placeholder="Link ảnh minh họa..."
            hint="Link ảnh sản phẩm/banner"
          />

          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Mô tả (tùy chọn)
            </Text>
            <View
              className="bg-white rounded-2xl px-4 pt-3 pb-3 border border-gray-100"
              style={{ elevation: 2 }}
            >
              <TextInput
                className="text-gray-800 font-semibold text-sm"
                placeholder="Nhập mô tả cho khuyến mãi..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 72 }}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between py-3 border-t border-gray-50">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="toggle-switch-outline"
                size={20}
                color="#E07B39"
              />
              <Text className="text-gray-700 font-bold ml-2">Kích hoạt</Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#E5E7EB", true: "#FCD9BC" }}
              thumbColor={isActive ? "#E07B39" : "#9CA3AF"}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-10 pt-4 bg-[#FDFCF7]">
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-4 rounded-xl flex-row items-center justify-center ${
            submitting ? "bg-gray-300" : "bg-[#E07B39]"
          }`}
          activeOpacity={0.8}
          disabled={submitting}
          style={{ elevation: 3 }}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="content-save-outline"
                size={20}
                color="white"
              />
              <Text className="text-white font-bold ml-2 text-base">
                Lưu thay đổi ngay
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
