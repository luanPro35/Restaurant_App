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
import { useAdminPromotion } from "../../hooks/useAdminPromotion";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminAddPromotionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { createPromotion } = useAdminPromotion();

  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
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
        description: description.trim() || undefined,
        isActive,
      });
      navigation.goBack();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    hint,
  }: any) => (
    <View className="mb-5">
      <Text className="text-gray-600 font-bold text-sm mb-2">{label}</Text>
      <View
        className="flex-row items-center bg-white rounded-2xl px-4 h-[52px] border border-gray-100"
        style={{ elevation: 2 }}
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
        <Text className="text-gray-400 text-xs mt-1 ml-1">{hint}</Text>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#FDFCF7]"
    >
      <View className="px-6 pt-14 pb-4 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <Text className="text-xl font-black text-gray-800">
            Thêm khuyến mãi
          </Text>
          <View className="w-10" />
        </View>
      </View>

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

      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-[#FDFCF7]"
        style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ["#D1D5DB", "#9CA3AF"] : ["#E07B39", "#C96A2E"]}
            className="rounded-2xl py-4 items-center justify-center"
            style={{ elevation: 4 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-black text-base ml-2">
                  Tạo khuyến mãi
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
