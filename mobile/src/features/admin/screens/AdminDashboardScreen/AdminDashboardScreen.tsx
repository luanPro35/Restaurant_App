import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";

const { width } = Dimensions.get("window");

export default function AdminDashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const insets = useSafeAreaInsets();

  const AdminCard = ({ title, icon, colors, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-[28px] mb-4 border border-gray-50 overflow-hidden"
      style={{
        width: (width - 44) / 2,
        ...Platform.select({
          ios: {
            shadowColor: colors[1],
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 15,
          },
          android: {
            elevation: 3,
          },
        }),
      }}
    >
      <View className="p-6 items-center">
        <View
          className="w-14 h-14 rounded-3xl items-center justify-center mb-4"
          style={{ backgroundColor: `${colors[0]}15` }}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-10 h-10 rounded-2xl items-center justify-center"
          >
            <MaterialCommunityIcons name={icon} size={22} color="white" />
          </LinearGradient>
        </View>
        <Text
          className="font-black text-gray-800 text-center text-[13px] tracking-tight"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        }}
      >
        <View className="flex-row items-center justify-between mb-8 px-3">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center mr-4 border border-orange-500">
              <MaterialCommunityIcons name="account-tie" size={28} color="#E07B39" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-0.5">
                Bảng quản trị
              </Text>
              <Text className="text-gray-900 text-2xl font-black tracking-tighter">
                Admin Panel
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminNotificationsScreen" as any)}
            className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-orange-500 shadow-sm"
          >
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={22}
              color="#E07B39"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between mb-6 px-3">
          <View className="flex-row items-center">
            <View className="w-1.5 h-6 bg-[#E07B39] rounded-full mr-3" />
            <Text className="text-xl font-black text-gray-900 tracking-tighter">
              Quản lý cửa hàng
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap justify-between">
          <AdminCard
            title="Sản phẩm"
            icon="silverware-fork-knife"
            colors={["#4facfe", "#00f2fe"]}
            onPress={() => navigation.navigate("AdminProducts")}
          />
          <AdminCard
            title="Danh mục"
            icon="view-grid-outline"
            colors={["#667eea", "#764ba2"]}
            onPress={() => navigation.navigate("AdminCategories")}
          />
          <AdminCard
            title="Bàn & Chỗ"
            icon="table-furniture"
            colors={["#00b09b", "#96c93d"]}
            onPress={() => navigation.navigate("AdminTablesScreen")}
          />
          <AdminCard
            title="Đơn hàng"
            icon="receipt"
            colors={["#f093fb", "#f5576c"]}
            onPress={() => navigation.navigate("AdminOrdersScreen")}
          />
          <AdminCard
            title="Khách hàng"
            icon="account-group"
            colors={["#84fab0", "#8fd3f4"]}
            onPress={() => navigation.navigate("AdminUsersScreen")}
          />
          <AdminCard
            title="Khuyến mãi"
            icon="ticket-percent"
            colors={["#ff9a9e", "#fecfef"]}
            onPress={() => navigation.navigate("AdminPromotionsScreen" as any)}
          />
          <AdminCard
            title="Tài chính"
            icon="wallet"
            colors={["#a1c4fd", "#c2e9fb"]}
            onPress={() => navigation.navigate("AdminPaymentsScreen" as any)}
          />
          <AdminCard
            title="Thông báo"
            icon="bullhorn-variant"
            colors={["#f6d365", "#fda085"]}
            onPress={() => navigation.navigate("AdminNotificationsScreen" as any)}
          />
          <AdminCard
            title="Tin nhắn"
            icon="message-text"
            colors={["#43e97b", "#38f9d7"]}
            onPress={() => navigation.navigate("AdminConversations" as any)}
          />
          <AdminCard
            title="Cài đặt"
            icon="tune"
            colors={["#6a11cb", "#2575fc"]}
            onPress={() => navigation.navigate("AdminSettings")}
          />
        </View>
      </ScrollView>
    </View>
  );
}


