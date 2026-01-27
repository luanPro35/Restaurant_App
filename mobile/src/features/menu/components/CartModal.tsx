import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartModalProps {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartModal({
  visible,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: "white",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            maxHeight: height * 0.8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#2D2D2D",
                }}
              >
                Giỏ hàng
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginTop: 4,
                }}
              >
                {items.length} món
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 60,
                }}
              >
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={80}
                  color="#ddd"
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#999",
                    marginTop: 16,
                  }}
                >
                  Giỏ hàng trống
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#f9f9f9",
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      backgroundColor: "#e0e0e0",
                    }}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontSize: 16,
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
                        color: "#E07B39",
                        fontWeight: "600",
                      }}
                    >
                      {item.price}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 1,
                          borderColor: "#E07B39",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={18}
                          color="#E07B39"
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          marginHorizontal: 16,
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#2D2D2D",
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#E07B39",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={18}
                          color="white"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onRemoveItem(item.id)}
                        style={{
                          marginLeft: "auto",
                          padding: 8,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={22}
                          color="#FF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          {items.length > 0 && (
            <View
              style={{
                padding: 20,
                borderTopWidth: 1,
                borderTopColor: "#f0f0f0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                  }}
                >
                  Tổng cộng
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#E07B39",
                  }}
                >
                  {formatPrice(calculateTotal())}
                </Text>
              </View>

              <TouchableOpacity onPress={onCheckout} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#E07B39", "#D66A28"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 16,
                    paddingVertical: 16,
                    alignItems: "center",
                    shadowColor: "#E07B39",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Đặt món
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
