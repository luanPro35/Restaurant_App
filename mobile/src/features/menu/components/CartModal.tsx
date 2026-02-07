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
  price: number;
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
      return total + item.price * item.quantity;
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
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            maxHeight: height * 0.8,
          }}
          className="bg-white rounded-t-[30px] shadow-2xl elevation-10"
        >
          <View className="flex-row justify-between items-center p-5 border-b border-gray-100">
            <View>
              <Text className="text-2xl font-bold text-[#2D2D2D]">
                Giỏ hàng
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {items.length} món
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            >
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View className="items-center justify-center py-16">
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={80}
                  color="#ddd"
                />
                <Text className="text-base text-gray-400 mt-4">
                  Giỏ hàng trống
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View
                  key={item.id}
                  className="flex-row bg-gray-50 rounded-2xl p-3 mb-3"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-xl bg-gray-200"
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-base font-bold text-[#2D2D2D] mb-1"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-[15px] text-[#E07B39] font-semibold">
                      {formatPrice(item.price)}
                    </Text>

                    <View className="flex-row items-center mt-2">
                      <TouchableOpacity
                        onPress={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white justify-center items-center border border-[#E07B39]"
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={18}
                          color="#E07B39"
                        />
                      </TouchableOpacity>

                      <Text className="mx-4 text-base font-bold text-[#2D2D2D] min-w-[24px] text-center">
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-[#E07B39] justify-center items-center"
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={18}
                          color="white"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onRemoveItem(item.id)}
                        className="ml-auto p-2"
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

          {items.length > 0 && (
            <View className="p-5 border-t border-gray-100">
              <View className="flex-row justify-between mb-4">
                <Text className="text-base text-gray-500">Tổng cộng</Text>
                <Text className="text-2xl font-bold text-[#E07B39]">
                  {formatPrice(calculateTotal())}
                </Text>
              </View>

              <TouchableOpacity onPress={onCheckout} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#E07B39", "#D66A28"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-2xl py-4 items-center shadow-lg elevation-5"
                >
                  <Text className="text-white text-lg font-bold">Đặt món</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
