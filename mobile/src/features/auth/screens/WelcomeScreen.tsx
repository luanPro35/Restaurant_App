import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const logoScale = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-[#F9F6E7] items-center justify-center px-6">
      <View className="items-center mb-10">
        <Animated.View
          style={{
            transform: [{ scale: logoScale }],
          }}
        >
          <Image
            source={require("../../../../assets/Logo.png")}
            className="w-[200px] h-[200px]"
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
        <TouchableOpacity className="w-full bg-[#E07B39] rounded-2xl py-4 items-center shadow-lg mb-4">
          <Text className="text-white text-lg font-bold">
            Quét QR – Đặt món tại quán
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="w-full bg-[#6B4423] rounded-2xl py-4 items-center shadow-lg"
        >
          <Text className="text-white text-lg font-bold">
            Đăng nhập để đặt từ xa
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
