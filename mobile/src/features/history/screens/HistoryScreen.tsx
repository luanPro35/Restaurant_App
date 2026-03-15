import React, { useEffect } from "react";
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
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePackage } from "../../package/hooks/usePackage";
import { LinearGradient } from "expo-linear-gradient";

interface HistoryCardProps {
  pack: any;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ pack }) => {
  const isConfirmed = pack.status === "CONFIRMED";
  const date = new Date(pack.createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="bg-white rounded-[32px] mx-4 mb-5 shadow-sm overflow-hidden border border-gray-100"
    >
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-orange-50 rounded-2xl items-center justify-center mr-3">
              <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#E07B39" />
            </View>
            <View>
              <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Mã đơn hàng</Text>
              <Text className="text-[#2D2D2D] font-black text-sm">#{pack.id.slice(0, 8).toUpperCase()}</Text>
            </View>
          </View>
          <View className={`px-4 py-1.5 rounded-full ${isConfirmed ? 'bg-green-50' : 'bg-orange-50'}`}>
            <Text className={`text-[11px] font-bold ${isConfirmed ? 'text-green-600' : 'text-orange-600'}`}>
              {isConfirmed ? "ĐÃ GIAO" : "ĐANG XỬ LÝ"}
            </Text>
          </View>
        </View>

        <View className="mb-4 space-y-2">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="account-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-600 font-bold ml-2 text-sm">{pack.name}</Text>
          </View>
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#9CA3AF" style={{ marginTop: 2 }} />
            <Text className="text-gray-400 font-medium ml-2 text-xs flex-1" numberOfLines={1}>{pack.address}</Text>
          </View>
        </View>

        <View className="h-[1px] bg-gray-50 w-full mb-4" />

        <View className="flex-row justify-between items-end">
          <View className="flex-1 mr-4">
            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Món đã đặt</Text>
            <Text className="text-[#2D2D2D] font-medium text-sm leading-5" numberOfLines={2}>
              {pack.description || "Không có mô tả món ăn"}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1 text-right">Tổng tiền</Text>
            <Text className="text-[#E07B39] font-black text-xl">
              {pack.price?.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-gray-50/50 px-5 py-3 flex-row justify-between items-center border-t border-gray-50/10">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="calendar-clock" size={14} color="#9CA3AF" />
          <Text className="text-[#9CA3AF] text-[11px] font-medium ml-1.5">{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const { packages, loading, error, fetchPackages } = usePackage();

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View className="bg-white pt-14 pb-6 px-6 rounded-b-[40px] shadow-sm z-10 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center"
          >
            <MaterialCommunityIcons name="chevron-left" size={28} color="#2D2D2D" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-xl font-black text-[#2D2D2D] tracking-tight">Lịch Sử Đặt Hàng</Text>
            <View className="w-8 h-1 bg-[#E07B39] rounded-full mt-1" />
          </View>
          <View className="w-12" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-sm">
              <MaterialCommunityIcons name="loading" size={32} color="#E07B39" />
            </View>
            <Text className="text-gray-400 mt-4 font-bold tracking-widest uppercase text-[10px]">Đang tải dữ liệu...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center mt-20 px-10">
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#FF6B6B" />
            <Text className="text-gray-500 text-center mt-4 mb-6">Có lỗi xảy ra khi tải lịch sử đơn hàng.</Text>
            <TouchableOpacity
              className="bg-[#E07B39] px-10 py-4 rounded-[20px] shadow-lg shadow-orange-200"
              onPress={() => fetchPackages()}
            >
              <Text className="text-white font-black uppercase text-sm">Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : packages.length > 0 ? (
          <View>
            {packages.map((pack) => (
              <HistoryCard key={pack.id} pack={pack} />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center mt-20 px-10">
            <View className="w-48 h-48 bg-white rounded-full items-center justify-center mb-8 shadow-sm">
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png",
                }}
                className="w-32 h-32 opacity-80"
              />
            </View>
            <Text className="text-[#2D2D2D] text-lg font-black mb-2">Chưa có đơn hàng nào</Text>
            <Text className="text-gray-400 text-center text-sm leading-5 mb-8">
              Có vẻ như bạn chưa đặt món ăn nào. Hãy khám phá thực đơn của chúng tôi ngay nhé!
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Delivery" as any, { screen: "Menu" })}
              className="overflow-hidden rounded-[24px]"
            >
              <LinearGradient
                colors={["#E91E63", "#E07B39"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-10 py-4 items-center justify-center"
              >
                <Text className="text-white font-black uppercase text-sm">Khám phá Menu ngay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
