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
import { useNavigation } from "@react-navigation/native";

export default function ChangeProfile() {
  const navigation = useNavigation();
  const [name, setName] = React.useState("Luân");
  const [phone, setPhone] = React.useState("0987654321");
  const [email, setEmail] = React.useState("luan@example.com");
  const [idCard, setIdCard] = React.useState("");
  const [gender, setGender] = React.useState("male");

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

        <View className="mb-6">
          <Text className="text-gray-500 text-sm font-medium mb-3 ml-1">
            Giới tính
          </Text>
          <View className="flex-row bg-gray-50 p-1 rounded-2xl border border-gray-100">
            <TouchableOpacity
              onPress={() => setGender("male")}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${gender === "male" ? "bg-white shadow-sm" : ""}`}
            >
              <Ionicons
                name="male"
                size={18}
                color={gender === "male" ? "#f97316" : "#94a3b8"}
              />
              <Text
                className={`ml-2 font-semibold ${gender === "male" ? "text-orange-500" : "text-gray-400"}`}
              >
                Nam
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setGender("female")}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${gender === "female" ? "bg-white shadow-sm" : ""}`}
            >
              <Ionicons
                name="female"
                size={18}
                color={gender === "female" ? "#f97316" : "#94a3b8"}
              />
              <Text
                className={`ml-2 font-semibold ${gender === "female" ? "text-orange-500" : "text-gray-400"}`}
              >
                Nữ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <InputField
          label="Số CCCD"
          value={idCard}
          onChangeText={setIdCard}
          placeholder="Nhập số căn cước"
          icon="card-outline"
          keyboardType="numeric"
        />

        <TouchableOpacity className="mt-6 bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-300 items-center active:bg-orange-600">
          <Text className="text-white font-bold text-lg">Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
