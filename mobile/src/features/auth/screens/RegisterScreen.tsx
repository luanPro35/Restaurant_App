import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import authApi from "../../../services/api/auth.api";

export default function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Register">>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const onSendOtp = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email để nhận mã OTP");
      return;
    }

    setSendingOtp(true);
    try {
      await authApi.sendOtp(email.trim());
      Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn");
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể gửi OTP";
      Alert.alert("Lỗi", Array.isArray(message) ? message.join("\n") : message);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSignUp = async () => {
    if (!name || !email || !password || !otp) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        otp: otp.trim(),
      });
      Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      Alert.alert("Lỗi", Array.isArray(message) ? message.join("\n") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="pt-10 flex-1 bg-[#F9F6E7]">
      <View className="flex-1 bg-[#F9F6E7]">
        <View className="items-center pt-10 pb-4">
          <Image
            source={require("../../../../assets/Logo.png")}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 px-6">
          <Text className="text-3xl font-bold mb-6 text-[#2D2D2D] text-center">
            Create Account
          </Text>

          <View className="w-full bg-white rounded-2xl px-5 py-3 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <Ionicons name="person" size={20} color="#6B4423" />
            <TextInput
              placeholder="Full Name"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="w-full bg-white rounded-2xl px-5 py-3 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <MaterialIcons name="email" size={20} color="#6B4423" />
            <TextInput
              placeholder="Email"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="w-full bg-white rounded-2xl px-5 py-3 mb-4 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <Ionicons name="lock-closed" size={20} color="#6B4423" />
            <TextInput
              placeholder="Password"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View className="w-full flex-row items-center mb-6">
            <View className="flex-1 bg-white rounded-2xl px-5 py-3 flex-row items-center border border-[#E5D5C3] shadow-sm mr-2">
              <Ionicons name="keypad" size={20} color="#6B4423" />
              <TextInput
                placeholder="OTP Code"
                className="flex-1 ml-3 text-base text-[#2D2D2D]"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
              />
            </View>
            <TouchableOpacity
              className={`bg-[#E07B39] rounded-2xl px-4 py-3 items-center justify-center shadow-md active:bg-[#C96A2E] ${sendingOtp ? "opacity-70" : ""}`}
              onPress={onSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold">Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E] ${loading ? "opacity-70" : ""}`}
            onPress={onSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-[#6B4423]">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-sm text-[#E07B39] font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
