import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PromotionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  expiryDate: string;
}

interface PromotionCardProps {
  item: PromotionItem;
  onPress: (item: PromotionItem) => void;
}

export default function PromotionCard({ item, onPress }: PromotionCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="mb-4"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(item)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm elevation-5"
      >
        <View className="h-40 relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full bg-gray-100"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute bottom-0 left-0 right-0 h-24"
          />
          <View className="absolute top-3 right-3 bg-red-500 px-3 py-1.5 rounded-full">
            <Text className="text-white font-bold text-xs">
              {item.discount}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-lg font-bold text-[#2D2D2D] mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
            {item.description}
          </Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="#E07B39"
            />
            <Text className="text-[#E07B39] text-xs ml-1">
              Hết hạn: {item.expiryDate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
