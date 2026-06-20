import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdminPromotion } from "../../hooks/useAdminPromotion";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

export default function AdminAddPromotionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { createPromotion } = useAdminPromotion();

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [code, setCode] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [image, setImage] = useState("");
  const [until, setUntil] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

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
      Alert.alert(
        "Lỗi",
        "Ngày hết hạn phải có định dạng YYYY-MM-DD (ví dụ: 2025-12-31).",
      );
      return;
    }

    setLoading(true);
    try {
      await createPromotion({
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();

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
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Thêm Khuyến Mãi</Text>
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
            placeholder="YYYY-MM-DD (ví dụ: 2025-12-31)"
            hint="Định dạng: YYYY-MM-DD"
          />

          <InputField
            label="Mã giảm giá (Coupon Code)"
            icon="barcode-scan"
            value={code}
            onChangeText={setCode}
            placeholder="Ví dụ: SALE50"
            hint="Để trống nếu không dùng mã"
          />

          <InputField
            label="Đơn tối thiểu (VNĐ)"
            icon="cart-arrow-down"
            value={minOrder}
            onChangeText={setMinOrder}
            placeholder="Ví dụ: 100000"
            keyboardType="numeric"
            hint="Đơn hàng tối thiểu để được áp dụng"
          />

          <InputField
            label="Hình ảnh (URL)"
            icon="image-outline"
            value={image}
            onChangeText={setImage}
            placeholder="Link ảnh minh họa..."
            hint="Nhập link ảnh (https://...)"
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
              <Text className="text-gray-700 font-bold ml-2">
                Kích hoạt ngay
              </Text>
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
            loading ? "bg-gray-300" : "bg-[#E07B39]"
          }`}
          activeOpacity={0.8}
          disabled={loading}
          style={{ elevation: 3 }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="white"
              />
              <Text className="text-white font-bold ml-2 text-base">
                Tạo khuyến mãi ngay
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
