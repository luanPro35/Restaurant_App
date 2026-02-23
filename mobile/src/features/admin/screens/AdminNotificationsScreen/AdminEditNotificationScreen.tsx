import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";
import notificationApi from "../../../../services/api/admin-notification";
import DateTimePicker from "@react-native-community/datetimepicker";

type RouteProps = RouteProp<AdminStackParamList, "AdminEditNotificationScreen">;

export default function AdminEditNotificationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const route = useRoute<RouteProps>();
  const { notificationId } = route.params;
  const { updateNotification } = useAdminNotifications();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startAt, setStartAt] = useState(new Date());
  const [endAt, setEndAt] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadNotification = async () => {
      setLoadingData(true);
      try {
        const data = await notificationApi.getNotificationById(notificationId);
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setDescription(data.description || "");
          setIsActive(data.isActive ?? true);
          setStartAt(data.startAt ? new Date(data.startAt) : new Date());
          setEndAt(data.endAt ? new Date(data.endAt) : new Date());
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin thông báo");
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    };
    loadNotification();
  }, [notificationId]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    if (endAt <= startAt) {
      Alert.alert("Lỗi", "Thời gian kết thúc phải sau thời gian bắt đầu.");
      return;
    }

    setSubmitting(true);
    try {
      await updateNotification(notificationId, {
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        isActive,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
      });
      navigation.goBack();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFCF7]">
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#FDFCF7]"
    >
      <View className="px-6 pt-14 pb-4 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between">
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
            Chỉnh sửa thông báo
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-3xl p-5 mb-6 border border-gray-100"
          style={{ elevation: 3 }}
        >
          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Tiêu đề
            </Text>
            <View
              className="flex-row items-center bg-white rounded-2xl px-4 h-[52px] border border-gray-100"
              style={{ elevation: 2 }}
            >
              <MaterialCommunityIcons
                name="format-title"
                size={20}
                color="#E07B39"
              />
              <TextInput
                className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
                placeholder="Nhập tiêu đề thông báo..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Nội dung
            </Text>
            <View
              className="bg-white rounded-2xl px-4 pt-3 pb-3 border border-gray-100"
              style={{ elevation: 2 }}
            >
              <TextInput
                className="text-gray-800 font-semibold text-sm"
                placeholder="Nhập nội dung chi tiết..."
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Mô tả (tùy chọn)
            </Text>
            <View
              className="flex-row items-center bg-white rounded-2xl px-4 h-[52px] border border-gray-100"
              style={{ elevation: 2 }}
            >
              <MaterialCommunityIcons
                name="text-box-outline"
                size={20}
                color="#E07B39"
              />
              <TextInput
                className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
                placeholder="Nhập mô tả ngắn..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Thời gian bắt đầu
            </Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="flex-row items-center bg-white rounded-2xl px-4 h-[52px] border border-gray-100"
              style={{ elevation: 2 }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color="#E07B39"
              />
              <Text className="flex-1 ml-3 text-gray-800 font-semibold text-sm">
                {startAt.toLocaleDateString("vi-VN")}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#9CA3AF"
              />
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

          <View className="mb-5">
            <Text className="text-gray-600 font-bold text-sm mb-2">
              Thời gian kết thúc
            </Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="flex-row items-center bg-white rounded-2xl px-4 h-[52px] border border-gray-100"
              style={{ elevation: 2 }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color="#E07B39"
              />
              <Text className="flex-1 ml-3 text-gray-800 font-semibold text-sm">
                {endAt.toLocaleDateString("vi-VN")}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#9CA3AF"
              />
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

          <View className="flex-row items-center justify-between py-3 border-t border-gray-50">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="toggle-switch-outline"
                size={20}
                color="#E07B39"
              />
              <Text className="text-gray-700 font-bold ml-2">Kích hoạt</Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: "#E5E7EB", true: "#FCD9BC" }}
              thumbColor={isActive ? "#E07B39" : "#9CA3AF"}
            />
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-[#FDFCF7]"
        style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
      >
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <LinearGradient
            colors={
              submitting ? ["#D1D5DB", "#9CA3AF"] : ["#E07B39", "#C96A2E"]
            }
            className="rounded-2xl py-4 items-center justify-center"
            style={{ elevation: 4 }}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-black text-base ml-2">
                  Lưu thay đổi
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
