import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";

import { useAuth } from "../../../app/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Login">>();

  const onLoginPress = () => {
    login();
  };
  return (
    <SafeAreaView className="pt-10 flex-1 bg-[#F9F6E7]">
      <View className="flex-1 bg-[#F9F6E7] ">
        <View className="items-center pt-16 pb-8">
          <Image
            source={require("../../../../assets/Logo.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 px-6">
          <Text className="text-3xl font-bold mb-8 text-[#2D2D2D] text-center">
            Welcome Back
          </Text>

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

          <View className="w-full bg-white rounded-2xl px-5 py-4 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <Ionicons name="lock-closed" size={20} color="#6B4423" />
            <TextInput
              placeholder="Password"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity className="self-end mb-6">
            <Text className="text-sm text-[#E07B39] font-medium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E]"
            onPress={onLoginPress}
          >
            <Text className="text-white text-lg font-bold">Login</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-[#6B4423]">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-sm text-[#E07B39] font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
