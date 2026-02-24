import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import Search_Dish from "./Search_Dish";
import Utilities from "./Utilities";

interface HeaderProps {
  scrollY?: Animated.Value;
  onPress?: () => void;
}

export default function Header({ scrollY, onPress }: HeaderProps) {
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

  const scale = scrollY
    ? scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.2, 1],
        extrapolate: "clamp",
      })
    : 1;

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: slideAnim },
          { translateY: headerHeight },
          { scale },
        ],
      }}
      className="absolute top-0 left-0 right-0 z-50 shadow-2xl"
    >
      <LinearGradient
        colors={["#E91E63", "#E07B39", "#D66A28"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
        }}
      >
        <Animated.View style={{ opacity }}>
          <View className="flex-row items-center px-4 py-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity className="flex-1">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={16}
                  color="#FFE4D6"
                />
                <Text className="text-xs font-bold text-[#FFE4D6] ml-1 uppercase tracking-tighter">
                  Giao tới địa chỉ
                </Text>
              </View>
              <View className="flex-row items-center mt-0.5">
                <Text
                  className="text-xl font-black text-white flex-1"
                  numberOfLines={1}
                >
                  123 Đường ABC, Quận 1
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginLeft: 2 }}
                />
              </View>
            </TouchableOpacity>

            <Utilities />
          </View>
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateY: searchTranslateY }] }}
          className="z-10"
        >
          <Search_Dish />
        </Animated.View>

        <Animated.View style={{ opacity }} className="px-4 pb-6 mt-1">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Promotion" as never)}
            className="overflow-hidden rounded-2xl border border-white/20"
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]}
              className="px-4 py-3.5 flex-row items-center"
            >
              <View className="bg-white/30 rounded-xl p-2.5 mr-3 shadow-sm">
                <MaterialCommunityIcons
                  name="ticket-percent"
                  size={22}
                  color="#FFFFFF"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white font-black text-base leading-5">
                  Bạn có nhiều mã giảm giá mới!
                </Text>
                <Text className="text-white/80 text-xs mt-0.5 font-medium">
                  Giảm tới 50k cho đơn hàng tối nay
                </Text>
              </View>
              <View className="bg-white/20 px-3 py-1.5 rounded-lg ml-2">
                <Text className="text-white text-[10px] font-bold uppercase">
                  Xem ngay
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Svg
          height="30"
          width="100%"
          viewBox="0 0 1440 120"
          className="-mb-px"
          style={{ transform: [{ translateY: 1 }] }}
        >
          <Path
            fill="#F9F6E7"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </Svg>
      </LinearGradient>
    </Animated.View>
  );
}
