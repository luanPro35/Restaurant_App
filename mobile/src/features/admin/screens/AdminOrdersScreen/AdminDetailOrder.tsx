import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MainStackParamList } from "../../../../app/navigation/MainNavigator";
import { formatCurrency } from "../../utils/admin.utils";

type AdminDetailOrderRouteProp = RouteProp<
  MainStackParamList,
  "AdminDetailOrder"
>;

export default function AdminDetailOrder() {
  const navigation = useNavigation();
  const route = useRoute<AdminDetailOrderRouteProp>();
  const { order } = route.params;

  const InfoRow = ({
    label,
    value,
    icon,
    color = "#9CA3AF",
  }: {
    label: string;
    value: string;
    icon: string;
    color?: string;
  }) => (
    <View className="flex-row items-center mb-4">
      <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mr-3">
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <View>
        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
          {label}
        </Text>
        <Text className="text-gray-900 font-bold text-sm tracking-tight">
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 pt-14 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <Text className="text-xl font-black text-gray-800">
            Chi tiết đơn hàng
          </Text>
          <TouchableOpacity className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100">
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={20}
              color="#1F2937"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="bg-orange-50 p-6 rounded-[32px] mb-6 items-center border border-orange-100 shadow-sm">
          <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm mb-4">
            <MaterialCommunityIcons
              name="clipboard-text"
              size={32}
              color="#E07B39"
            />
          </View>
          <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">
            Mã đơn hàng
          </Text>
          <Text className="text-gray-900 font-black text-2xl mb-3">
            #{order.id.toUpperCase()}
          </Text>
          <View
            className={`px-4 py-1.5 rounded-full ${order.isAvailable ? "bg-green-100" : "bg-red-100"}`}
          >
            <Text
              className={`text-xs font-black uppercase ${order.isAvailable ? "text-green-700" : "text-red-700"}`}
            >
              {order.isAvailable ? "Giao hàng thành công" : "Đang chờ xử lý"}
            </Text>
          </View>
        </View>

        <View className="bg-white p-6 rounded-[32px] mb-6 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-black text-lg mb-6">
            Thông tin vận chuyển
          </Text>

          <InfoRow
            label="Khách hàng"
            value={order.name}
            icon="account-outline"
            color="#3B82F6"
          />
          <InfoRow
            label="Địa chỉ"
            value={order.address}
            icon="map-marker-outline"
            color="#EF4444"
          />
          <InfoRow
            label="Thời gian"
            value={`Giao hàng trước ${order.until}`}
            icon="clock-outline"
            color="#F59E0B"
          />
        </View>

        <View className="bg-white p-6 rounded-[32px] mb-8 border border-gray-100 shadow-sm">
          <Text className="text-gray-900 font-black text-lg mb-6">
            Tổng kết đơn hàng
          </Text>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-500 font-medium">Tạm tính</Text>
            <Text className="text-gray-900 font-bold">
              {formatCurrency(order.price)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-500 font-medium">Phí vận chuyển</Text>
            <Text className="text-gray-900 font-bold">{formatCurrency(0)}</Text>
          </View>
          <View className="h-[1px] bg-gray-50 my-4" />
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-900 font-black text-lg">Tổng cộng</Text>
            <Text className="text-[#E07B39] font-black text-2xl">
              {formatCurrency(order.price)}
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-4 mb-10">
          <TouchableOpacity className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl items-center justify-center">
            <Text className="text-gray-600 font-bold">Hủy đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-[2] bg-[#E07B39] py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-200">
            <Text className="text-white font-bold text-lg">
              Cập nhật trạng thái
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
