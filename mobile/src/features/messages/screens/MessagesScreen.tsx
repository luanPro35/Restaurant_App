import React from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MessageItem from "../components/MessageItem";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "🎉 Tặng bạn Voucher 50K",
    description:
      "Nhập mã HELLO50 giảm ngay 50K cho đơn hàng đầu tiên. HSD: 30/01/2026. Đặt món ngay!",
    time: "10:30",
    type: "promotion",
    isRead: false,
  },
  {
    id: "2",
    title: "🚚 Đơn hàng đang trên đường đến",
    description:
      "Tài xế Nguyễn Văn A đã nhận đơn hàng #8392 và đang di chuyển đến nhà hàng.",
    time: "09:15",
    type: "order",
    isRead: true,
  },
  {
    id: "3",
    title: "🔥 Giờ vàng săn deal sốc!",
    description:
      "Chỉ từ 11h-13h hôm nay, giảm giá 40% toàn bộ menu Cơm Tấm Sài Gòn.",
    time: "Hôm qua",
    type: "promotion",
    isRead: false,
  },
  {
    id: "4",
    title: "🔔 Cập nhật chính sách bảo mật",
    description:
      "Chúng tôi đã cập nhật chính sách bảo mật mới để bảo vệ dữ liệu của bạn tốt hơn.",
    time: "25/01",
    type: "system",
    isRead: true,
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      {/* Header */}
      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg z-10 mb-[-20]">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Thông báo</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="check-all" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white/20 flex-row items-center px-4 py-2.5 rounded-xl border border-white/10">
          <MaterialCommunityIcons name="magnify" size={20} color="white" />
          <TextInput
            placeholder="Tìm kiếm ưu đãi..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            className="flex-1 ml-2 text-white text-base"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 pt-10 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#2D2D2D]">Mới nhất</Text>
          <TouchableOpacity>
            <Text className="text-[#E07B39] text-xs font-bold">
              Đánh dấu đã đọc
            </Text>
          </TouchableOpacity>
        </View>

        {NOTIFICATIONS.map((note) => (
          <MessageItem
            key={note.id}
            {...(note as any)}
            onPress={() => console.log("Open Notification", note.id)}
          />
        ))}

        <View className="items-center mt-6 mb-10">
          <Text className="text-gray-400 text-sm">
            Bạn đã xem hết thông báo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
