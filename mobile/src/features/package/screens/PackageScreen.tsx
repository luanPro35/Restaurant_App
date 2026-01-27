import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../app/navigation/MainNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PackageItem from "../components/PackageItem";
import { LinearGradient } from "expo-linear-gradient";

// Mock Active Order
const ACTIVE_ORDER = {
  id: "29384",
  status: "delivering" as const,
  estimatedTime: "19:15",
  driver: {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    rating: 4.8,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    plate: "59-X1 123.45",
  },
};

export default function PackageScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      {/* Header */}
      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg elevation-5 z-10 mb-[-20px]">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Theo Dõi Đơn Hàng
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 pt-10" showsVerticalScrollIndicator={false}>
        {ACTIVE_ORDER ? (
          <>
            <PackageItem {...ACTIVE_ORDER} />

            {/* Map Placeholder */}
            <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 relative">
              <Image
                source={{ uri: "https://i.imgur.com/2Xf0Y9y.png" }} // Placeholder map image
                className="w-full h-full bg-gray-200"
                resizeMode="cover"
              />
              <View className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-xl shadow-md flex-row items-center">
                <View className="bg-red-100 p-2 rounded-full mr-3">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={24}
                    color="#ef4444"
                  />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">
                    Địa chỉ nhận hàng
                  </Text>
                  <Text className="font-bold text-[#2D2D2D] text-sm">
                    123 Đường Nguyễn Huệ, Q.1, TP.HCM
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Details Summary */}
            <View className="mx-4 mt-6 mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text className="font-bold text-lg text-[#2D2D2D] mb-3">
                Chi tiết đơn hàng
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">2x Lẩu Thái Tomyum</Text>
                <Text className="font-medium">350.000đ</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">1x Combo Nướng</Text>
                <Text className="font-medium">250.000đ</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Phí giao hàng</Text>
                <Text className="font-medium">15.000đ</Text>
              </View>
              <View className="h-[1px] bg-gray-100 my-2" />
              <View className="flex-row justify-between">
                <Text className="font-bold text-base">Tổng cộng</Text>
                <Text className="font-bold text-base text-[#E07B39]">
                  615.000đ
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View className="items-center justify-center mt-20">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png",
              }}
              className="w-40 h-40 opacity-50 mb-4"
            />
            <Text className="text-gray-500 text-lg mb-6">
              Bạn chưa có đơn hàng nào
            </Text>
            <TouchableOpacity
              className="bg-[#E07B39] px-8 py-3 rounded-full shadow-lg"
              onPress={() => navigation.navigate("Menu")}
            >
              <Text className="text-white font-bold text-base">
                Đặt món ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
