import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useChangeProfile } from "../hooks/useChangeProfile";
import { useEffect } from "react";
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";

export default function ChangeProfile() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CustomerStackParamList, "ChangeProfile">>();
  const item = route.params?.item;

  const { changeProfile, loading, error, data } = useChangeProfile();
  const [name, setName] = React.useState(item?.name || "");
  const [phone, setPhone] = React.useState(item?.phone || "");
  const [email, setEmail] = React.useState(item?.email || "");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPhone(item.phone || "");
      setEmail(item.email);
    }
  }, [item]);

  const handleUpdate = async () => {
    try {
      await changeProfile({ name, phone });
      navigation.goBack();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = "default",
  }: any) => (
    <View className="mb-5">
      <Text className="text-gray-500 text-sm font-medium mb-2 ml-1">
        {label}
      </Text>
      <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm">
        <Ionicons name={icon} size={20} color="#94a3b8" />
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 ml-3 text-gray-800 text-base"
          placeholderTextColor="#94a3b8"
        />
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-0 left-6 z-10 bg-white p-2 rounded-full shadow-sm border border-gray-100"
      >
        <Ionicons name="close-outline" size={24} color="#1f2937" />
      </TouchableOpacity>

      <View className="items-center py-8">
        <View className="w-28 h-28 rounded-full bg-orange-50 items-center justify-center border-4 border-white shadow-xl">
          <Ionicons name="person" size={56} color="#f97316" />
          <TouchableOpacity className="absolute bottom-1 right-1 bg-orange-500 w-9 h-9 rounded-full items-center justify-center border-4 border-white shadow-sm active:scale-95">
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="mt-4 text-xl font-bold text-gray-900">
          Thông tin cá nhân
        </Text>
        <Text className="text-gray-400 text-sm">
          Cập nhật thông tin của bạn
        </Text>
      </View>

      <View className="px-6 pb-10">
        <InputField
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ tên"
          icon="person-outline"
        />

        <InputField
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
          icon="call-outline"
          keyboardType="phone-pad"
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          icon="mail-outline"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          className={`mt-6 py-4 rounded-2xl shadow-lg items-center ${
            loading
              ? "bg-orange-300"
              : "bg-orange-500 active:bg-orange-600 shadow-orange-300"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
