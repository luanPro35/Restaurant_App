import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import Search_Dish from "./Search_Dish";
import Utilities from "./Utilities";

interface HeaderProps {
  scrollY?: Animated.Value;
}

export default function Header({ scrollY }: HeaderProps) {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerHeight = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [0, -120],
        extrapolate: "clamp",
      })
    : 0;

  const searchTranslateY = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 60],
        extrapolate: "clamp",
      })
    : 0;

  const opacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0],
        extrapolate: "clamp",
      })
    : 1;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }, { translateY: headerHeight }],
      }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <LinearGradient
        colors={["#E07B39", "#D66A28"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: StatusBar.currentHeight || 44,
        }}
      >
        <Animated.View style={{ opacity }}>
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2 mr-2"
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 flex-row items-center">
              <View className="flex-1">
                <Text className="text-xl text-[#FFE4D6]">Giao tới</Text>
                <View className="flex-row items-center">
                  <Text
                    className="text-2xl font-semibold text-white flex-1"
                    numberOfLines={1}
                  >
                    123 Đường ABC, Quận 1
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <Utilities />
          </View>
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY: searchTranslateY }] }}
        >
          <Search_Dish />
        </Animated.View>

        <Animated.View style={{ opacity }} className="px-4 pb-6">
          <View className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3">
            <View className="flex-row items-center">
              <View className="bg-white/30 rounded-full p-2 mr-3">
                <MaterialIcons name="local-offer" size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Ưu đãi đặc biệt
                </Text>
                <Text className="text-white/80 text-xs mt-0.5">
                  Khám phá các ưu đãi hấp dẫn dành riêng cho bạn
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>

        <Svg height="35" width="100%" viewBox="0 0 1440 120" className="-mb-px">
          <Path
            fill="#F9F6E7"
            d="M0,60 C240,100 480,100 720,60 C960,20 1200,20 1440,60 L1440,120 L0,120 Z"
          />
        </Svg>
      </LinearGradient>
    </Animated.View>
  );
}
