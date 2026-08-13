import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onPress: (item: MenuItem) => void;
  // isGridItem: boolean;
}

export default function MenuItemCard({
  item,
  onAddToCart,
  onPress,
  // isGridItem
}: MenuItemCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onAddToCart(item);
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      // className= {`${isGridItem ? "w-[48%]" : "w-full"} mb-4`}
      className="w-[48%] mb-4"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(item)}
        className="bg-white rounded-2xl overflow-hidden shadow-md"
        style={{ elevation: 3 }}
      >
        <View className="relative h-[140px]">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full bg-gray-100"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            className="absolute bottom-0 left-0 right-0 h-[60px]"
          />

          <View className="absolute top-2 left-2 bg-[#E07B39]/95 px-2 py-1 rounded-xl">
            <Text className="text-white text-[9px] font-bold">
              {item.category}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.7}
            className="absolute bottom-2 right-2 bg-[#E07B39] w-9 h-9 rounded-full justify-center items-center shadow-lg"
            style={{ elevation: 4 }}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="p-2.5">
          <Text
            className="text-sm font-bold text-[#2D2D2D] mb-1"
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text className="text-[15px] font-bold text-[#E07B39]">
            {item.price.toLocaleString("vi-VN")}đ
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
