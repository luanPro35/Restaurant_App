import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../app/navigation/MainNavigator";

export default function AdminDashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const AdminCard = ({ title, icon, colors, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-3xl w-[48%] mb-4 shadow-sm border border-gray-100 overflow-hidden"
      style={{ elevation: 2 }}
    >
      <View className="p-5 items-center">
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 rounded-2xl mb-3 shadow-lg"
        >
          <MaterialCommunityIcons name={icon} size={28} color="white" />
        </LinearGradient>
        <Text className="font-bold text-gray-800 text-center text-[13px]">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const StatItem = ({ label, value, icon, color }: any) => (
    <View className="items-center px-4">
      <View className={`p-2 rounded-full ${color} mb-1`}>
        <MaterialCommunityIcons name={icon} size={18} color="white" />
      </View>
      <Text className="text-[10px] text-gray-500 font-medium uppercase">
        {label}
      </Text>
      <Text className="text-sm font-bold text-gray-800">{value}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-12 px-6 rounded-b-[48px] shadow-2xl"
      >
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center border border-white/30 mr-4">
              <MaterialCommunityIcons
                name="account-tie"
                size={28}
                color="white"
              />
            </View>
            <View>
              <Text className="text-white/70 text-xs font-medium uppercase tracking-wider">
                Hệ thống Quản trị
              </Text>
              <Text className="text-white text-xl font-bold">Admin Panel</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white/10 p-2.5 rounded-2xl border border-white/20">
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={22}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View
          className="bg-white/95 rounded-[32px] p-6 flex-row justify-between shadow-xl"
          style={{ elevation: 10 }}
        >
          <StatItem
            label="Đơn mới"
            value="12"
            icon="cart-arrow-down"
            color="bg-orange-500"
          />
          <View className="w-[1.5px] h-10 bg-gray-100 self-center" />
          <StatItem
            label="Doanh thu"
            value="4.2M"
            icon="bank-transfer"
            color="bg-emerald-500"
          />
          <View className="w-[1.5px] h-10 bg-gray-100 self-center" />
          <StatItem
            label="Bàn trống"
            value="5"
            icon="table-clock"
            color="bg-blue-500"
          />
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center mb-5 px-2">
          <View className="w-1.5 h-6 bg-[#E07B39] rounded-full mr-3" />
          <Text className="text-lg font-bold text-gray-800">
            Quản lý hệ thống
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between px-1">
          <AdminCard
            title="Sản phẩm"
            icon="food"
            colors={["#3b82f6", "#1d4ed8"]}
            onPress={() => console.log("Products")}
          />
          <AdminCard
            title="Danh mục"
            icon="shape"
            colors={["#6366f1", "#4338ca"]}
            onPress={() => console.log("Categories")}
          />
          <AdminCard
            title="Bàn & Chỗ"
            icon="table-chair"
            colors={["#10b981", "#047857"]}
            onPress={() => console.log("Tables")}
          />
          <AdminCard
            title="Đơn hàng"
            icon="clipboard-list-outline"
            colors={["#f59e0b", "#d97706"]}
            onPress={() => console.log("Orders")}
          />
          <AdminCard
            title="Vận chuyển"
            icon="truck-fast-outline"
            colors={["#14b8a6", "#0d9488"]}
            onPress={() => console.log("Delivery")}
          />
          <AdminCard
            title="Báo cáo"
            icon="chart-areaspline"
            colors={["#a855f7", "#7e22ce"]}
            onPress={() => console.log("Stats")}
          />
          <AdminCard
            title="Khách hàng"
            icon="account-group-outline"
            colors={["#ec4899", "#be185d"]}
            onPress={() => console.log("Users")}
          />
          <AdminCard
            title="Khuyến mãi"
            icon="ticket-percent-outline"
            colors={["#ef4444", "#b91d1d"]}
            onPress={() => console.log("Promotions")}
          />
          <AdminCard
            title="Tài chính"
            icon="wallet-outline"
            colors={["#10b981", "#059669"]}
            onPress={() => console.log("Payments")}
          />
          <AdminCard
            title="Thông báo"
            icon="megaphone-outline"
            colors={["#facc15", "#eab308"]}
            onPress={() => console.log("Notifications")}
          />
          <AdminCard
            title="Phản hồi"
            icon="message-draw"
            colors={["#06b6d4", "#0891b2"]}
            onPress={() => console.log("Comments")}
          />
          <AdminCard
            title="Lịch sử"
            icon="book-open-variant"
            colors={["#f43f5e", "#e11d48"]}
            onPress={() => console.log("Logs")}
          />
          <AdminCard
            title="Cài đặt"
            icon="cog-outline"
            colors={["#64748b", "#334155"]}
            onPress={() => navigation.navigate("AdminSettings")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
