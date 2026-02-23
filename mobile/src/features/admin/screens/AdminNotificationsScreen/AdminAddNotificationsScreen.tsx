import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

export default function AdminNotificationsScreen() {
  const { createNotification } = useAdminNotifications();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState(new Date());
  const [endAt, setEndAt] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    if (endAt <= startAt) {
      Alert.alert("Lỗi", "Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    setLoading(true);
    try {
      await createNotification({
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        isActive,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F9F6EF]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="bg-white px-5 pt-12 pb-5 border-b border-gray-100"
          style={{ elevation: 2 }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-4"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={22} color="#E07B39" />
            <Text className="text-[#E07B39] font-semibold ml-1.5 text-sm">
              Quay lại
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <View className="bg-orange-100 p-2.5 rounded-2xl mr-3">
              <MaterialCommunityIcons
                name="bullhorn-outline"
                size={24}
                color="#E07B39"
              />
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-800">
                Gửi thông báo
              </Text>
              <Text className="text-xs text-gray-400 mt-0.5">
                Gửi tới tất cả khách hàng
              </Text>
            </View>
          </View>
        </View>

        <View className="p-5">
          <View
            className="bg-white rounded-2xl p-5 border border-gray-100"
            style={{ elevation: 2 }}
          >
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Tiêu đề
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 mb-5 border border-gray-100">
              <MaterialCommunityIcons
                name="format-title"
                size={18}
                color="#9ca3af"
              />
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="flex-1 py-3 ml-2.5 text-sm text-gray-800"
                placeholder="Nhập tiêu đề thông báo..."
                placeholderTextColor="#9ca3af"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Nội dung
            </Text>
            <View className="bg-gray-50 rounded-xl px-3 pt-3 pb-2 border border-gray-100 mb-5">
              <TextInput
                value={content}
                onChangeText={setContent}
                className="text-sm text-gray-800 min-h-[100px]"
                placeholder="Nhập nội dung chi tiết..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Mô tả (tùy chọn)
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 mb-5 border border-gray-100">
              <MaterialCommunityIcons
                name="text-box-outline"
                size={18}
                color="#9ca3af"
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                className="flex-1 py-3 ml-2.5 text-sm text-gray-800"
                placeholder="Nhập mô tả ngắn..."
                placeholderTextColor="#9ca3af"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Thời gian bắt đầu
              </Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="flex-row items-center bg-gray-50 rounded-xl px-3 py-3 mb-5 border border-gray-100"
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={18}
                  color="#9ca3af"
                />
                <Text className="flex-1 ml-2.5 text-sm text-gray-800">
                  {startAt.toLocaleDateString("vi-VN")}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startAt}
                  mode="date"
                  display="default"
                  onChange={(_: any, date?: Date) => {
                    setShowStartPicker(false);
                    if (date) setStartAt(date);
                  }}
                />
              )}
            </View>

            <View>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Thời gian kết thúc
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="flex-row items-center bg-gray-50 rounded-xl px-3 py-3 mb-5 border border-gray-100"
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={18}
                  color="#9ca3af"
                />
                <Text className="flex-1 ml-2.5 text-sm text-gray-800">
                  {endAt.toLocaleDateString("vi-VN")}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endAt}
                  mode="date"
                  display="default"
                  onChange={(_: any, date?: Date) => {
                    setShowEndPicker(false);
                    if (date) setEndAt(date);
                  }}
                />
              )}
            </View>

            <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="toggle-switch-outline"
                  size={20}
                  color="#E07B39"
                />
                <Text className="text-gray-700 font-bold ml-2 text-sm">
                  Kích hoạt ngay
                </Text>
              </View>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#E5E7EB", true: "#FCD9BC" }}
                thumbColor={isActive ? "#E07B39" : "#9CA3AF"}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-[#F9F6EF]"
        style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          className={`py-4 rounded-xl flex-row items-center justify-center ${
            loading ? "bg-gray-300" : "bg-[#E07B39]"
          }`}
          activeOpacity={0.85}
          disabled={loading}
          style={{ elevation: 3 }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={18} color="white" />
              <Text className="text-white font-bold ml-2">
                Gửi thông báo ngay
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
