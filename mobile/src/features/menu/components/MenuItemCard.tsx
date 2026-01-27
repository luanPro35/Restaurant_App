import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
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
      style={{
        transform: [{ scale: scaleAnim }],
        width: "48%",
        marginBottom: 16,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Image */}
        <View style={{ position: "relative", height: 140 }}>
          <Image
            source={{ uri: item.image }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f0f0f0",
            }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
          />

          {/* Category badge */}
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(224, 123, 57, 0.95)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 9,
                fontWeight: "bold",
              }}
            >
              {item.category}
            </Text>
          </View>

          {/* Add button on image */}
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.7}
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "#E07B39",
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#E07B39",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#2D2D2D",
              marginBottom: 4,
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#E07B39",
            }}
          >
            {item.price}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
