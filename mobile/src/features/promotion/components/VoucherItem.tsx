import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Promotion } from "../types/promotion.types";
import { formatCurrency } from "../../../shared/utils";

interface VoucherItemProps {
  item: Promotion;
}

const VoucherItem = ({ item }: VoucherItemProps) => {
  const handleCopy = () => {
    if (item.code) {
      Clipboard.setString(item.code);
      if (Platform.OS === "android") {
        ToastAndroid.show("Đã sao chép mã giảm giá!", ToastAndroid.SHORT);
      }
    }
  };

  const discountValue =
    item.discount > 100
      ? formatCurrency(item.discount).replace("đ", "K")
      : `${item.discount}%`;

  const expiryDate = item.until ? item.until.split("T")[0] : "Vô thời hạn";

  return (
    <View className="flex-row bg-white rounded-2xl mb-4 overflow-hidden shadow-md elevation-4 h-[100px] relative border border-gray-100">
      {/* Left Section - Discount Tag */}
      <LinearGradient
        colors={["#E91E63", "#E07B39"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-28 justify-center items-center px-2 relative"
      >
        <View className="items-center">
          <Text className="text-white text-2xl font-black tracking-tighter">
            {discountValue}
          </Text>
          <Text className="text-white/80 text-[9px] font-bold uppercase mt-1 tracking-widest text-center">
            Đơn từ {formatCurrency(item.minOrder || 0)}
          </Text>
        </View>

        {/* Ticket Dotted Line */}
        <View
          className="absolute right-0 top-0 bottom-0 w-[1px] border-r border-white/30"
          style={{ borderStyle: "dashed" }}
        />
      </LinearGradient>

      {/* Right Section - Content */}
      <View className="flex-1 p-3.5 justify-between">
        <View>
          <View className="flex-row justify-between items-start">
            <Text
              className="text-base font-black text-slate-800 flex-1 mr-2"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={18}
              color="#D1D5DB"
            />
          </View>

          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color="#94A3B8"
            />
            <Text className="text-[11px] text-slate-400 font-medium ml-1">
              HSD: {expiryDate}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-end">
          <View className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg flex-row items-center">
            <Text className="text-slate-600 text-[11px] font-black tracking-widest">
              {item.code || "KHONGMA"}
            </Text>
          </View>

          {item.code && (
            <TouchableOpacity
              onPress={handleCopy}
              activeOpacity={0.7}
              className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full"
            >
              <Text className="text-[#E07B39] font-black text-xs mr-1">
                SAO CHÉP
              </Text>
              <MaterialCommunityIcons
                name="content-copy"
                size={12}
                color="#E07B39"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Decorative Circles (Punch holes) */}
      <View className="absolute -top-3 left-[106px] w-6 h-6 rounded-full bg-[#F9F6E7] border border-gray-100" />
      <View className="absolute -bottom-3 left-[106px] w-6 h-6 rounded-full bg-[#F9F6E7] border border-gray-100" />
    </View>
  );
};

export default VoucherItem;
