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

const AdminAddTables = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    price: "",
    description: "",
  });

  const handleSave = () => {
    if (!formData.name || !formData.capacity) {
      alert("Vui lòng nhập đầy đủ tên bàn và sức chứa");
      return;
    }
    console.log("Saving new table:", formData);
    navigation.goBack();
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    keyboardType: "default" | "numeric" = "default",
  ) => (
    <View className="mb-6">
      <Text className="text-gray-500 text-sm font-bold mb-2 ml-1">{label}</Text>
      <View className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-gray-900 text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 pt-14 pb-6 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between mb-6">
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
          <View className="bg-orange-50 p-6 rounded-[32px] mb-8 items-center border border-orange-100">
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

          {renderInput(
            "Tên bàn",
            formData.name,
            (text) => setFormData({ ...formData, name: text }),
            "Ví dụ: Bàn 01, VIP 1...",
            "pencil-outline",
          )}

          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#E07B39] py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-200 mt-4"
          >
            <Text className="text-white font-bold text-lg">Tạo bàn ngay</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AdminAddTables;
