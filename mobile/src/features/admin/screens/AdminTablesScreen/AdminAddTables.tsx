import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdminTable } from "../../hooks/useAdminTable";

const AdminAddTables = () => {
  const navigation = useNavigation();
  const { createTable } = useAdminTable();
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    location: "",
    description: "",
  });

  const handleSave = () => {
    if (!formData.name || !formData.capacity || !formData.location) {
      return;
    }

    createTable({
      ...formData,
      capacity: parseInt(formData.capacity, 10),
      status: "AVAILABLE",
      isAvailable: true,
      isActive: true,
      price: 0,
    });
    navigation.goBack();
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    keyboardType: "default" | "numeric" = "default",
    multiline: boolean = false,
  ) => (
    <View className="mb-5">
      <Text className="text-gray-500 text-sm font-bold mb-2 ml-1">{label}</Text>
      <View
        className={`flex-row items-start bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm ${
          multiline ? "h-32" : ""
        }`}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 12, marginTop: multiline ? 2 : 0 }}
        />
        <TextInput
          className="flex-1 text-gray-900 text-base p-0"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
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
          <Text className="text-xl font-black text-gray-800">Thêm bàn mới</Text>
          <View className="w-10" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="bg-orange-50 p-6 rounded-[32px] my-6 items-center border border-orange-100">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-md mb-4">
              <MaterialCommunityIcons
                name="table-chair"
                size={40}
                color="#E07B39"
              />
            </View>
            <Text className="text-gray-900 font-black text-xl">
              Thông tin bàn
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-1">
              Điền thông tin chi tiết để thêm bàn vào sơ đồ nhà hàng
            </Text>
          </View>

          <View className="space-y-1">
            {renderInput(
              "Tên bàn",
              formData.name,
              (text) => setFormData({ ...formData, name: text }),
              "Ví dụ: Bàn 01, VIP 1...",
              "pencil-outline",
            )}

            {renderInput(
              "Sức chứa (người)",
              formData.capacity,
              (text) => setFormData({ ...formData, capacity: text }),
              "Số lượng khách tối đa",
              "account-group-outline",
              "numeric",
            )}

            {renderInput(
              "Vị trí",
              formData.location,
              (text) => setFormData({ ...formData, location: text }),
              "Ví dụ: Tầng 1, Ban công...",
              "map-marker-outline",
            )}

            {renderInput(
              "Mô tả chi tiết",
              formData.description,
              (text) => setFormData({ ...formData, description: text }),
              "Đặc điểm bàn (tùy chọn)...",
              "text-box-outline",
              "default",
              true,
            )}
          </View>

          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            className="bg-[#E07B39] py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-200 mt-6"
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="plus-circle"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-black text-lg">
                Tạo bàn ngay
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AdminAddTables;
