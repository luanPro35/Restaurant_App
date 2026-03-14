import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminOrder } from "../../types/admin.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePayment } from "../../hooks/usePayment";
import { LinearGradient } from "expo-linear-gradient";

export default function AdminPaymentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const insets = useSafeAreaInsets();
  const { 
    payments, 
    loading, 
    error, 
    fetchPayments, 
    fetchTotalAmount, 
    totalAmount 
  } = usePayment();
  useFocusEffect(
    React.useCallback(() => {
      fetchPayments();
      fetchTotalAmount();
    }, [])
  );

  const formatCurrency = (amount: number) => {
    return (amount || 0).toLocaleString('vi-VN') + 'đ';
  };

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
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Quản lý thanh toán</Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">Hệ thống quản trị</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate("AdminAnalysisScreen")}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderSummary = () => (
    <LinearGradient
      colors={["#FFFFFF", "#F9F6E7"]}
      className="rounded-[28px] p-6 mb-6 border border-orange-100 shadow-sm"
      style={{ elevation: 3 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Tổng doanh thu</Text>
        <View className="w-8 h-8 bg-orange-50 rounded-xl items-center justify-center">
          <MaterialCommunityIcons name="currency-usd" size={16} color="#E07B39" />
        </View>
      </View>
      <Text className="text-[#2D2D2D] text-3xl font-black tracking-tighter">
        {formatCurrency(totalAmount)}
      </Text>
      <View className="flex-row items-center mt-3">
        <View className="px-2 py-0.5 bg-green-50 rounded-md mr-2">
          <Text className="text-green-600 text-[10px] font-bold">Thanh khoản cao</Text>
        </View>
        <Text className="text-gray-400 text-[9px] font-medium">Cập nhật theo thời gian thực</Text>
      </View>
    </LinearGradient>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-20">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="credit-card-off-outline"
          size={40}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-400 font-bold">Chưa có giao dịch nào</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {loading && payments.length === 0 ? (
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
              onRefresh={() => {
                fetchPayments();
                fetchTotalAmount();
              }}
              colors={["#E07B39"]}
            />
          }
        >
          {renderSummary()}

          {error && (
            <View className="mb-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <Text className="text-red-500 text-center font-bold">{error}</Text>
            </View>
          )}

          {payments.length === 0 ? renderEmpty() : payments.map((pay: any) => {
            return (
              <View
                key={pay.id}
                className="bg-white rounded-[24px] mb-4 p-5 border border-gray-50 shadow-sm"
                style={{ elevation: 2 }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mr-3">
                      <MaterialCommunityIcons
                        name={pay.method === "CASH" ? "cash" : "credit-card-outline"}
                        size={24}
                        color="#E07B39"
                      />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-black text-base">
                        {pay.order ? `Bàn ${pay.order.tableId}` : (pay.package ? "Giao hàng" : "Thanh toán")}
                      </Text>
                      <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {pay.method === "CASH" ? "Tiền mặt" : pay.method} • #{pay.id.slice(-8).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${pay.status === "COMPLETED" ? "bg-green-50" : "bg-orange-50"}`}>
                    <Text className={`text-[10px] font-black uppercase ${pay.status === "COMPLETED" ? "text-green-600" : "text-orange-600"}`}>
                      {pay.status === "COMPLETED" ? "Thành công" : "Chờ xử lý"}
                    </Text>
                  </View>
                </View>

                <View className="h-[1px] bg-gray-50 mb-4" />

                <View className="flex-row justify-between items-end">
                  <View className="space-y-1">
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="clock-outline" size={14} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-2 font-medium">
                        {new Date(pay.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(pay.createdAt).toLocaleDateString("vi-VN")}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <MaterialCommunityIcons name="identifier" size={14} color="#9CA3AF" />
                      <Text className="text-gray-400 text-xs ml-2 font-medium" numberOfLines={1}>
                        TX: {pay.transactionId || "Nội bộ"}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">Số tiền</Text>
                    <Text className="text-[#E07B39] font-black text-xl">
                      {(pay.amount || 0).toLocaleString('vi-VN')}đ
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
