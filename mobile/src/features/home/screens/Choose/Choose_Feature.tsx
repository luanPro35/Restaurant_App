import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomerStackParamList } from "../../../../app/navigation/CustomerNavigator";
import FeaturesModal from "../../../all_choose/components/FeaturesModal";

const List_Feature = (
  navigation: NativeStackNavigationProp<CustomerStackParamList>,
  onOpenModal: () => void,
) => [
    {
      name: "Tại quán",
      icon: "silverware-fork-knife",
      color: "#FF7A00",
      onPress: () => navigation.navigate("AtRestaurant"),
    },
    {
      name: "Giao hàng",
      icon: "truck-delivery",
      color: "#4CAF50",
      onPress: () => navigation.navigate("Delivery"),
    },
    {
      name: "Menu",
      icon: "book-open-variant",
      color: "#3F51B5",
      onPress: () => navigation.navigate("Menu"),
    },
    {
      name: "Bán chạy",
      icon: "fire",
      color: "#F44336",
      onPress: () => navigation.navigate("BestSeller"),
    },
    {
      name: "Khuyến mãi",
      icon: "ticket-percent",
      color: "#E91E63",
      onPress: () => navigation.navigate("Promotion"),
    },
    {
      name: "Đơn hàng",
      icon: "receipt-text",
      color: "#795548",
      onPress: () => navigation.navigate("Package"),
    },
    {
      name: "Lịch sử",
      icon: "history",
      color: "#607D8B",
      onPress: () => navigation.navigate("History"),
    },
    {
      name: "Tất cả",
      icon: "apps",
      color: "#9C27B0",
      onPress: onOpenModal,
    },
  ];

export default function Choose_Feature() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);

  const features = List_Feature(navigation, () => setModalVisible(true));

  return (
    <View className="px-1 flex-row flex-wrap">
      {features.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className="w-1/4 p-2"
        >
          <View className="bg-white rounded-2xl p-4 items-center justify-center border border-[#E5D5C3] shadow-sm">
            <MaterialCommunityIcons
              name={item.icon as any}
              size={24}
              color={item.color}
            />
            <Text
              numberOfLines={1}
              className="text-[10px] text-center text-[#2D2D2D] font-medium"
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <FeaturesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
