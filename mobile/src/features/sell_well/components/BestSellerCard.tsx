import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BestSellerItem } from "../hooks/useBestSellers";

interface BestSellerCardProps {
  item: BestSellerItem;
  onAddToCart: (item: BestSellerItem) => void;
}

export default function BestSellerCard({
  item,
  onAddToCart,
}: BestSellerCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const getRankColor = (
    rank: number,
  ): readonly [string, string, ...string[]] => {
    switch (rank) {
      case 1:
        return ["#FFD700", "#FFA500"];
      case 2:
        return ["#C0C0C0", "#808080"];
      case 3:
        return ["#CD7F32", "#8B4513"];
      default:
        return ["#E07B39", "#D66A28"];
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return "crown";
    return "fire";
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        marginBottom: 16,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <View style={{ flexDirection: "row", padding: 12 }}>
          <View
            style={{
              position: "relative",
              marginRight: 12,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 16,
                backgroundColor: "#f0f0f0",
              }}
              resizeMode="cover"
            />

            <LinearGradient
              colors={getRankColor(item.rank)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: -8,
                left: -8,
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <MaterialCommunityIcons
                name={getRankIcon(item.rank)}
                size={16}
                color="white"
                style={{ position: "absolute", top: 4 }}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: 8,
                }}
              >
                {item.rank}
              </Text>
            </LinearGradient>

            <View
              style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                backgroundColor: "rgba(0,0,0,0.7)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                {item.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#2D2D2D",
                  marginBottom: 6,
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>

              {item.description && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 18,
                    marginBottom: 8,
                  }}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons name="fire" size={16} color="#FF6B6B" />
                <Text
                  style={{
                    fontSize: 12,
                    color: "#FF6B6B",
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  Đã bán {item.soldCount}+
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#E07B39",
                }}
              >
                {item.price}
              </Text>

              <TouchableOpacity
                onPress={() => onAddToCart(item)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: "#E07B39",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#E07B39",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons name="plus" size={18} color="white" />
                <Text
                  style={{
                    color: "white",
                    fontSize: 13,
                    fontWeight: "bold",
                    marginLeft: 4,
                  }}
                >
                  Thêm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
