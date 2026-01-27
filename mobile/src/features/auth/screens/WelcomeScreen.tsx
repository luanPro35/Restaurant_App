import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../app/navigation/AuthNavigator";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);

    const navigationTimer = setTimeout(() => {
      navigation.replace("Login");
    }, 2000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#F9F6E7] items-center justify-center">
      <Animated.View
        style={{
          transform: [{ scale: logoScale }],
          opacity: logoOpacity,
        }}
      >
        <Image
          source={require("../../../../assets/Logo.png")}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
