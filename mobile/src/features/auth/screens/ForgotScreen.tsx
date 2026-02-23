import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";
import authApi from "../../../services/api/auth.api";
import ReEnterPassword from "../components/Re-enter_Password";

export default function ForgotScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Forgot">>();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const onSendOtp = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email để nhận mã OTP");
      return;
    }

    setLoading(true);
    try {
      await authApi.sendOtp(email.trim());
      Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể gửi OTP";
      Alert.alert("Lỗi", Array.isArray(message) ? message.join("\n") : message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp(email.trim(), otp.trim());
      Alert.alert("Thành công", "Mã OTP đã được xác minh");
      setStep(3);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể xác minh OTP";
      Alert.alert("Lỗi", Array.isArray(message) ? message.join("\n") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F6E7]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6">
            <TouchableOpacity
              onPress={() => {
                if (step === 2) setStep(1);
                else if (step === 3) setStep(2);
                else navigation.goBack();
              }}
              className="mt-6 w-10 h-10 bg-white rounded-xl items-center justify-center border border-[#E5D5C3] shadow-sm"
            >
              <Ionicons name="chevron-back" size={24} color="#6B4423" />
            </TouchableOpacity>

            <View className="items-center mt-8 mb-4">
              <Image
                source={require("../../../../assets/Logo.png")}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </View>

            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-[#2D2D2D] mb-2">
                {step === 1
                  ? "Forgot Password?"
                  : step === 2
                    ? "Verify OTP"
                    : "Reset Password"}
              </Text>
              <Text className="text-sm text-[#6B4423] text-center opacity-70">
                {step === 1
                  ? "Enter your email address to receive a password reset link"
                  : step === 2
                    ? `Please enter the 6-digit code sent to ${email}`
                    : "Set your new password and confirm it"}
              </Text>
            </View>

            {step === 1 && (
              <View>
                <View className="w-full bg-white rounded-2xl px-5 py-4 mb-8 flex-row items-center border border-[#E5D5C3] shadow-sm">
                  <MaterialIcons name="email" size={20} color="#6B4423" />
                  <TextInput
                    placeholder="Email Address"
                    className="flex-1 ml-3 text-base text-[#2D2D2D]"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <TouchableOpacity
                  className={`w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E] ${
                    loading ? "opacity-70" : ""
                  }`}
                  onPress={onSendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-lg font-bold">
                      Send OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
              <View>
                <View className="w-full bg-white rounded-2xl px-5 py-4 mb-8 flex-row items-center border border-[#E5D5C3] shadow-sm">
                  <Ionicons name="key-outline" size={20} color="#6B4423" />
                  <TextInput
                    placeholder="Enter OTP"
                    className="flex-1 ml-3 text-base text-[#2D2D2D]"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>

                <TouchableOpacity
                  className={`w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E] ${
                    loading ? "opacity-70" : ""
                  }`}
                  onPress={onVerifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-lg font-bold">
                      Verify OTP
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onSendOtp}
                  className="mt-6 items-center"
                >
                  <Text className="text-sm text-[#E07B39] font-medium">
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 3 && (
              <ReEnterPassword
                email={email}
                onSuccess={() => navigation.navigate("Login")}
              />
            )}

            <View className="flex-row justify-center mt-auto pb-8">
              <Text className="text-sm text-[#6B4423]">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-sm text-[#E07B39] font-bold">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
