import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface VoucherItem {
  id: string;
  code: string;
  discount: string;
  minOrder: string;
  expiryDate: string;
  title: string;
}

interface VoucherItemProps {
  item: VoucherItem;
}

export default function VoucherItem({ item }: VoucherItemProps) {
  const handleCopy = () => {
    Clipboard.setString(item.code);
    ToastAndroid.show("Đã sao chép mã giảm giá!", ToastAndroid.SHORT);
  };

  return (
    <View className="flex-row bg-white rounded-xl mb-3 overflow-hidden shadow-sm h-24 elevation-3 relative">
      <View className="w-24 bg-[#E07B39] justify-center items-center p-2 border-r border-white border-dashed">
        <Text className="text-white text-xl font-bold text-center">
          {item.discount}
        </Text>
        <Text className="text-white/90 text-[10px] mt-1 text-center">
          Đơn từ {item.minOrder}
        </Text>
      </View>

      <View className="flex-1 p-3 justify-between">
        <View>
          <Text
            className="text-base font-bold text-[#2D2D2D]"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            HSD: {item.expiryDate}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-gray-500 text-xs font-semibold">
              {item.code}
            </Text>
          </View>

          <TouchableOpacity onPress={handleCopy}>
            <Text className="text-[#E07B39] font-bold text-sm">Sao chép</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute -top-2.5 left-[90px] w-5 h-5 rounded-full bg-[#F9F6E7]" />
      <View className="absolute -bottom-2.5 left-[90px] w-5 h-5 rounded-full bg-[#F9F6E7]" />
    </View>
  );
}
