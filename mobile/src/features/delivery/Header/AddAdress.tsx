import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SAVED_ICON } from "../contants/Adress.contant";
import { useAddress } from "../hooks/useAddress";

const ADDRESS_TYPES = SAVED_ICON;

const AddAdress = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { form, setForm, addAddress, loading } = useAddress();

  const handleBack = () => {
    navigation.goBack();
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.address.trim() !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    const success = await addAddress();
    if (success) {
      Alert.alert("Thành công", "Đã thêm địa chỉ mới thành công!");
      navigation.goBack();
    } else {
      Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại!");
    }
  };

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <View
        style={{
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: 15,
        }}
        className="bg-white shadow-sm border-b border-gray-100 px-5 flex-row items-center"
      >
        <TouchableOpacity
          onPress={handleBack}
          className="w-11 h-11 rounded-2xl bg-gray-50 items-center justify-center mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-[#2D2D2D]">
            Thêm địa chỉ mới
          </Text>
          <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">
            Điền thông tin bên dưới
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-5 bg-white mb-2">
            <Text className="text-[15px] font-bold text-[#2D2D2D] mb-4">
              Loại địa chỉ
            </Text>
            <View className="flex-row" style={{ gap: 12 }}>
              {ADDRESS_TYPES.map((type) => {
                const isSelected = form.type === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    activeOpacity={0.7}
                    onPress={() => setForm({ ...form, type: type.id as any })}
                    className={`flex-1 items-center py-4 rounded-2xl border ${
                      isSelected
                        ? "bg-orange-50 border-[#E07B39]"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <View
                      className={`w-12 h-12 rounded-2xl items-center justify-center mb-2 ${
                        isSelected ? "bg-[#E07B39]" : "bg-gray-200/50"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name={type.icon as any}
                        size={24}
                        color={isSelected ? "#FFFFFF" : "#9CA3AF"}
                      />
                    </View>
                    <Text
                      className={`text-sm font-bold ${
                        isSelected ? "text-[#E07B39]" : "text-gray-400"
                      }`}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="p-5 bg-white mb-2">
            <Text className="text-[15px] font-bold text-[#2D2D2D] mb-5">
              Thông tin người nhận
            </Text>

            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Họ và tên
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200/50 rounded-2xl px-4 py-3.5">
                <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <Ionicons name="person" size={18} color="#E07B39" />
                </View>
                <TextInput
                  placeholder="Nhập họ và tên người nhận"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  className="flex-1 text-[15px] text-[#2D2D2D] font-medium"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Số điện thoại
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200/50 rounded-2xl px-4 py-3.5">
                <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <Ionicons name="call" size={18} color="#E07B39" />
                </View>
                <TextInput
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  className="flex-1 text-[15px] text-[#2D2D2D] font-medium"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          <View className="p-5 bg-white mb-2">
            <Text className="text-[15px] font-bold text-[#2D2D2D] mb-5">
              Thông tin địa chỉ
            </Text>

            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Địa chỉ
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200/50 rounded-2xl px-4 py-3.5">
                <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <Ionicons name="location" size={18} color="#E07B39" />
                </View>
                <TextInput
                  placeholder="Số nhà, tên đường, quận/huyện"
                  value={form.address}
                  onChangeText={(text) => setForm({ ...form, address: text })}
                  className="flex-1 text-[15px] text-[#2D2D2D] font-medium"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Chi tiết (Tầng, cổng, toà nhà...)
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200/50 rounded-2xl px-4 py-3.5">
                <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="door"
                    size={18}
                    color="#E07B39"
                  />
                </View>
                <TextInput
                  placeholder="Thêm chi tiết vị trí (tuỳ chọn)"
                  value={form.detail}
                  onChangeText={(text) => setForm({ ...form, detail: text })}
                  className="flex-1 text-[15px] text-[#2D2D2D] font-medium"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        className="p-5 bg-white border-t border-gray-50"
      >
        <TouchableOpacity
          activeOpacity={isFormValid && !loading ? 0.9 : 1}
          onPress={handleSave}
          disabled={!isFormValid || loading}
          className="overflow-hidden rounded-3xl"
          style={{ opacity: isFormValid && !loading ? 1 : 0.5 }}
        >
          <LinearGradient
            colors={
              isFormValid && !loading
                ? ["#E91E63", "#E07B39"]
                : ["#9CA3AF", "#9CA3AF"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View className="flex-row items-center">
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-black text-lg tracking-tight uppercase">
                    Lưu địa chỉ
                  </Text>
                </>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddAdress;
