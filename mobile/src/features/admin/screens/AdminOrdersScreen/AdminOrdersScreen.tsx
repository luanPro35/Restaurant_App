import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdminPackage } from "../../hooks/useAdminPackage";
import { LinearGradient } from "expo-linear-gradient";

export default function AdminOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { packages, loading, refresh } = useAdminPackage();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );

  const renderHeader = () => (
    <View className="bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pb-10 px-6 shadow-2xl"
        style={{
          paddingTop: Math.max(insets.top, 20) + 5,
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color="white"
            />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Quản lý đơn hàng</Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">Hệ thống quản trị</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30">
            <MaterialCommunityIcons
              name="filter-variant"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-20">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="clipboard-off-outline"
          size={40}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-400 font-bold">Chưa có đơn hàng nào</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {loading && packages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={["#E07B39"]}
            />
          }
        >
          {packages.length === 0 ? renderEmpty() : packages.map((pkg: any) => {
            return (
              <View 
                key={pkg.id}
                className="bg-white rounded-[24px] mb-4 p-5 border border-gray-50 shadow-sm"
                style={{ elevation: 2 }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mr-3">
                      <MaterialCommunityIcons 
                        name="clipboard-text-outline" 
                        size={24} 
                        color="#E07B39" 
                      />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-black text-base" numberOfLines={1}>
                        {pkg.name}
                      </Text>
                      <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        #{pkg.id.slice(-8).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${pkg.status === "CONFIRMED" ? "bg-green-50" : "bg-red-50"}`}>
                    <Text className={`text-[10px] font-black uppercase ${pkg.status === "CONFIRMED" ? "text-green-600" : "text-red-600"}`}>
                      {pkg.status === "CONFIRMED" ? "Hoàn thành" : "Đang chờ"}
                    </Text>
                  </View>
                </View>

                <View className="h-[1px] bg-gray-50 mb-4" />

                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 text-xs ml-2 font-medium">
                      {new Date(pkg.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(pkg.createdAt).toLocaleDateString("vi-VN")}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="map-marker-outline" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-2 flex-1" numberOfLines={1}>
                      {pkg.address}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center bg-gray-50/50 p-3 rounded-2xl">
                   <Text className="text-gray-500 font-bold text-xs">Tổng tiền</Text>
                   <Text className="text-[#E07B39] font-black text-lg">
                      {(pkg.price || 0).toLocaleString('vi-VN')}đ
                   </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
