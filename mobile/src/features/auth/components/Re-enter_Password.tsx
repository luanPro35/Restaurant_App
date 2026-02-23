import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import authApi from "../../../services/api/auth.api";

interface ReEnterPasswordProps {
  email: string;
  onSuccess: () => void;
}

const ReEnterPassword = ({ email, onSuccess }: ReEnterPasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim(),
        password: password.trim(),
      });
      Alert.alert("Thành công", "Mật khẩu của bạn đã được đặt lại");
      onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể đặt lại mật khẩu";
      Alert.alert("Lỗi", Array.isArray(message) ? message.join("\n") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full">
      <View className="w-full bg-white rounded-2xl px-5 py-4 mb-4 flex-row items-center border border-[#E5D5C3] shadow-sm">
        <Ionicons name="lock-closed-outline" size={20} color="#6B4423" />
        <TextInput
          placeholder="New Password"
          className="flex-1 ml-3 text-base text-[#2D2D2D]"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6B4423"
          />
        </TouchableOpacity>
      </View>

      <View className="w-full bg-white rounded-2xl px-5 py-4 mb-8 flex-row items-center border border-[#E5D5C3] shadow-sm">
        <Ionicons name="lock-closed-outline" size={20} color="#6B4423" />
        <TextInput
          placeholder="Confirm New Password"
          className="flex-1 ml-3 text-base text-[#2D2D2D]"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        className={`w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E] ${
          loading ? "opacity-70" : ""
        }`}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ReEnterPassword;
