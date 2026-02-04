import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "Register">>();
  return (
    <SafeAreaView className="pt-10 flex-1 bg-[#F9F6E7]">
      <View className="flex-1 bg-[#F9F6E7]">
        <View className="items-center pt-16 pb-8">
          <Image
            source={require("../../../../assets/Logo.png")}
            className="w-[120px] h-[120px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 px-6">
          <Text className="text-3xl font-bold mb-8 text-[#2D2D2D] text-center">
            Create Account
          </Text>

          <View className="w-full bg-white rounded-2xl px-5 py-4 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <Ionicons name="person" size={20} color="#6B4423" />
            <TextInput
              placeholder="Full Name"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          <View className="w-full bg-white rounded-2xl px-5 py-4 mb-3 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <MaterialIcons name="email" size={20} color="#6B4423" />
            <TextInput
              placeholder="Email"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="w-full bg-white rounded-2xl px-5 py-4 mb-6 flex-row items-center border border-[#E5D5C3] shadow-sm">
            <Ionicons name="lock-closed" size={20} color="#6B4423" />
            <TextInput
              placeholder="Password"
              className="flex-1 ml-3 text-base text-[#2D2D2D]"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View className="w-full flex-row items-center mb-6">
            <View className="flex-1 bg-white rounded-2xl px-5 py-4 flex-row items-center border border-[#E5D5C3] shadow-sm mr-3">
              <Ionicons name="keypad" size={20} color="#6B4423" />
              <TextInput
                placeholder="Confirm OTP"
                className="flex-1 ml-3 text-base text-[#2D2D2D]"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>
            <TouchableOpacity className="bg-[#E07B39] rounded-2xl px-4 py-4 items-center justify-center shadow-lg active:bg-[#C96A2E]">
              <Text className="text-white font-bold">Resend</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg active:bg-[#C96A2E]">
            <Text className="text-white text-lg font-bold">Sign Up</Text>
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
