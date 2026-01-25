import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface LoginProps {
  onRegisterPress: () => void;
  onLoginPress: () => void;
}

export default function LoginScreen({
  onRegisterPress,
  onLoginPress,
}: LoginProps) {
  return (
    <View className="w-[85%] items-center mt-[50px]">
      <Text className="text-3xl font-bold mb-5 text-[#2D2D2D]">
        Welcome Back
      </Text>

      {/* Email Input */}
      <View className="w-full bg-white rounded-2xl px-5 py-4 mb-4 flex-row items-center border border-[#E5D5C3] shadow-sm">
        <MaterialIcons name="email" size={20} color="#6B4423" />
        <TextInput
          placeholder="Email"
          className="flex-1 ml-3 text-base text-[#2D2D2D]"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="w-full bg-white rounded-2xl px-5 py-4 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
        <Ionicons name="lock-closed" size={20} color="#6B4423" />
        <TextInput
          placeholder="Password"
          className="flex-1 ml-3 text-base text-[#2D2D2D]"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity className="self-end mb-6">
        <Text className="text-sm text-[#E07B39] font-medium">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        className="w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E]"
        onPress={onLoginPress}
      >
        <Text className="text-white text-lg font-bold">Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View className="flex-row mt-6">
        <Text className="text-sm text-[#6B4423]">Don't have an account? </Text>
        <TouchableOpacity onPress={onRegisterPress}>
          <Text className="text-sm text-[#E07B39] font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
