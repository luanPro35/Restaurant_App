import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PaymentMethodItem from "../components/PaymentMethodItem";

const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Tiền mặt",
    icon: "cash",
    description: "Thanh toán trực tiếp",
  }
];

const TRANSACTIONS = [
  {
    id: 1,
    store: "Nhà hàng Biển Đông",
    date: "27/01/2026 19:30",
    amount: "-540.000đ",
    status: "Thành công",
    icon: "food",
  },
  {
    id: 2,
    store: "Nạp tiền vào ví",
    date: "26/01/2026 10:15",
    amount: "+1.000.000đ",
    status: "Thành công",
    icon: "wallet-plus",
  },
  {
    id: 3,
    store: "Cà phê Highland",
    date: "25/01/2026 08:20",
    amount: "-85.000đ",
    status: "Thành công",
    icon: "coffee",
  },
];

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState("cash");

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      {/* Header */}
      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Thanh toán</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg font-bold text-[#2D2D2D] mb-4">
          Phương thức thanh toán
        </Text>
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodItem
            key={method.id}
            {...method}
            isSelected={selectedMethod === method.id}
            onPress={() => setSelectedMethod(method.id)}
          />
        ))}

        {/* Recent Transactions */}
        <Text className="text-lg font-bold text-[#2D2D2D] mt-6 mb-4">
          Giao dịch gần đây
        </Text>
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-8">
          {TRANSACTIONS.map((trans, index) => (
            <View
              key={trans.id}
              className={`flex-row items-center py-3 ${index !== TRANSACTIONS.length - 1
                ? "border-b border-gray-100"
                : ""
                }`}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name={trans.icon as any}
                  size={20}
                  color="#555"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-800">{trans.store}</Text>
                <Text className="text-xs text-gray-500">{trans.date}</Text>
              </View>
              <View className="items-end">
                <Text
                  className={`font-bold ${trans.amount.includes("+")
                    ? "text-green-600"
                    : "text-gray-800"
                    }`}
                >
                  {trans.amount}
                </Text>
                <Text className="text-[10px] text-green-600">
                  {trans.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
