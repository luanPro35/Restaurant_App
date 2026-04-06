import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useAuth } from "../../../app/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StaffStackParamList } from "../../../app/navigation/StaffNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StaffHomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<StaffStackParamList>>();

  const menuItems = [
    {
      title: "Quản lý Đơn hàng",
      icon: "clipboard-list-outline",
      colors: ["#6366F1", "#4F46E5"],
      description: "Xem và cập nhật trạng thái đơn hàng",
      onPress: () => navigation.navigate("AdminOrdersScreen"),
    },
    {
      title: "Trạng thái Bàn",
      icon: "table-chair",
      colors: ["#10B981", "#059669"],
      description: "Quản lý bàn trống và bận",
      onPress: () => navigation.navigate("AdminTablesScreen"),
    },
    {
      title: "Thông báo",
      icon: "bell-outline",
      colors: ["#F59E0B", "#D97706"],
      description: "Xem các yêu cầu từ khách hàng",
      onPress: () => navigation.navigate("AdminNotificationsScreen"),
    },
    {
      title: "Kiểm duyệt Bình luận",
      icon: "message-draw",
      colors: ["#EC4899", "#BE185D"],
      description: "Quản lý và xóa các bình luận cộng đồng",
      onPress: () => navigation.navigate("AdminCommentManagement"),
    },
  ];

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar barStyle="dark-content" />

      {/* Header Container */}
      <View
        className="px-6 pb-6 bg-white border-b border-gray-100 shadow-sm"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-[2px] mb-1">
              Nhân viên trực ca
            </Text>
            <Text className="text-2xl font-black text-gray-800">
              {user?.name || "Nhân viên"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center border border-red-100"
          >
            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
      >
        <View
          className="mb-8 shadow-lg shadow-orange-300"
          style={{
            borderRadius: 32,
            shadowColor: "#E07B39",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 8
          }}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 32, padding: 24, overflow: 'hidden' }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Trạng thái hiện tại
                </Text>
                <Text className="text-white text-xl font-black">
                  Bạn đang trong ca trực
                </Text>
                <Text className="text-white/90 text-sm mt-2 font-medium">
                  Hãy sẵn sàng phục vụ khách hàng chu đáo nhất.
                </Text>
              </View>
              <MaterialCommunityIcons name="clock-check-outline" size={48} color="white" />
            </View>
          </LinearGradient>
        </View>

        <Text className="text-gray-800 text-lg font-black mb-4 px-2">
          Công cụ làm việc
        </Text>

        <View>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={item.onPress}
              className="flex-row items-center p-4 bg-white rounded-[28px] shadow-sm border border-gray-50 mb-4"
              style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8
              }}
            >
              <View className="shadow-md shadow-gray-200" style={{ borderRadius: 16 }}>
                <LinearGradient
                  colors={item.colors as any}
                  className="w-14 h-14 items-center justify-center"
                  style={{ borderRadius: 16, overflow: 'hidden' }}
                >
                  <MaterialCommunityIcons name={item.icon as any} size={28} color="#FFF" />
                </LinearGradient>
              </View>

              <View className="flex-1 ml-4 pr-2">
                <Text className="text-gray-800 font-black text-base">{item.title}</Text>
                <Text className="text-gray-400 text-xs mt-1 font-medium leading-4">
                  {item.description}
                </Text>
              </View>

              <View className="bg-gray-50 w-8 h-8 rounded-full items-center justify-center">
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Support */}
        <View className="mt-8 items-center">
          <TouchableOpacity className="flex-row items-center bg-gray-100/50 px-6 py-3 rounded-2xl">
            <MaterialCommunityIcons name="help-circle-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
              Cần hỗ trợ kỹ thuật?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
