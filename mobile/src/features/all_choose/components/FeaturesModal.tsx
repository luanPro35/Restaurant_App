import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AllChooseSearchBar from "./AllChooseSearchBar";
import QuickUtilities from "./QuickUtilities";
import PromoBanner from "./PromoBanner";

interface FeaturesModalProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const { height } = Dimensions.get("window");

const FEATURE_ITEMS = [
  {
    name: "Tại quán",
    icon: "silverware-fork-knife",
    color: "#FF7A00",
    route: "AtRestaurant",
  },
  {
    name: "Giao hàng",
    icon: "truck-delivery",
    color: "#4CAF50",
    route: "Delivery",
  },
  { name: "Menu", icon: "book-open-variant", color: "#3F51B5", route: "Menu" },
  { name: "Bán chạy", icon: "fire", color: "#F44336", route: "BestSeller" },
  {
    name: "Khuyến mãi",
    icon: "ticket-percent",
    color: "#E91E63",
    route: "Promotion",
  },
  {
    name: "AI Thực đơn",
    icon: "robot-happy",
    color: "#E07B39",
    route: "MealFood",
  },
  {
    name: "AI Quét Ảnh",
    icon: "camera-iris",
    color: "#00BCD4",
    route: "AIFoodRecognition",
  },
  {
    name: "Tư vấn AI",
    icon: "chat",
    color: "#9C27B0",
    route: "Chat",
  },
  {
    name: "Đơn hàng",
    icon: "receipt-text",
    color: "#795548",
    route: "Package",
  },
  { name: "Lịch sử", icon: "history", color: "#607D8B", route: "History" },
];

export default function FeaturesModal({
  visible,
  onClose,
  navigation,
}: FeaturesModalProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      if (!showModal) return;
      setShowModal(false);
    }
  }, [visible]);

  const closeWithAnimation = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      onClose();
      if (callback) callback();
    });
  };

  const handleNavigation = (route: string) => {
    closeWithAnimation(() => {
      navigation.navigate(route);
    });
  };

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={() => closeWithAnimation()}
    >
      <TouchableWithoutFeedback onPress={() => closeWithAnimation()}>
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-1 justify-end bg-black/40"
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                maxHeight: height * 0.85,
              }}
              className="bg-[#FFFFFF] rounded-t-[32px] overflow-hidden shadow-2xl"
            >
              <View className="items-center pt-3 pb-2">
                <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </View>

              <ScrollView className="px-6 pb-8 pt-2" showsVerticalScrollIndicator={false}>
                <Text className="text-xl font-bold text-[#2D2D2D] mb-4 text-center">
                  Tất cả tính năng
                </Text>
                <AllChooseSearchBar />
                <QuickUtilities />
                <PromoBanner />
                <Text className="text-sm font-bold text-gray-800 mb-3 px-1">
                  Dịch vụ chính
                </Text>
                <View className="flex-row flex-wrap justify-between">
                  {FEATURE_ITEMS.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleNavigation(item.route)}
                      className="w-[30%] items-center mb-6"
                      activeOpacity={0.7}
                    >
                      <View
                        className="w-16 h-16 rounded-2xl justify-center items-center mb-2 shadow-sm"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <MaterialCommunityIcons
                          name={item.icon as any}
                          size={32}
                          color={item.color}
                        />
                      </View>
                      <Text className="text-xs font-medium text-gray-700 text-center">
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <View className="w-[30%]" />
                </View>
                <TouchableOpacity
                  onPress={() => closeWithAnimation()}
                  className="mt-2 mb-6 bg-gray-100 py-3 rounded-full items-center"
                >
                  <Text className="font-bold text-gray-500">Đóng</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
