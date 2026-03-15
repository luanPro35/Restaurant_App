import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Switch, KeyboardAvoidingView, Platform, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import adminApi from "../../admin-api";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  required = false,
}: any) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-2 ml-1">
      <Text className="text-gray-800 font-black text-[12px] uppercase tracking-[1px]">{label}</Text>
      {required && <Text className="text-red-500 ml-1 font-bold">*</Text>}
    </View>
    <TextInput
      style={{ borderRadius: 20 }}
      className={`bg-white border border-gray-100 p-4 text-gray-800 shadow-sm ${multiline ? "h-32 pt-4" : "h-14"}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      autoCorrect={false}
      spellCheck={false}
    />
  </View>
);

import categoryApi, { Category } from "../../../../services/api/category.api";

export const AdminCreateProduct = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "đĩa",
    category: "",
    image: "",
    isAvailable: true,
    isBestSeller: false,
    isNew: false,
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, category: data[0].id }));
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.price || !form.category) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setLoading(true);
    try {
      await adminApi.products.create({
        ...form,
        price: Number(form.price),
      });
      Alert.alert("Thành công", "Đã thêm món ăn mới vào Menu", [
        { text: "Tuyệt vời", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Create product error:", error);
      let errorMessage = "Không thể tạo sản phẩm. Vui lòng thử lại.";

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        errorMessage = Array.isArray(msg) ? msg.join("\n") : msg;
      }
      Alert.alert("Lỗi hệ thống", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Bạn cần cho phép truy cập thư viện để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0].uri);
    }
  };

  const handleUpload = async (uri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: filename,
        type,
      } as any);

      const response = await adminApi.products.uploadImage(formData);
      setForm({ ...form, image: response.url });
      Alert.alert('Thành công', 'Đã tải ảnh lên hệ thống!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Vui lòng thử lại hoặc dùng link ảnh trực tiếp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FDFCF7]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Thêm Món Mới</Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">Hệ thống quản trị</Text>
          </View>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <InputField
          label="Tên món ăn"
          value={form.name}
          onChangeText={(text: string) => setForm({ ...form, name: text })}
          placeholder="VD: Phở Bò Chín, Bánh Mì Thịt..."
          required
        />

        <View className="mb-8">
          <View className="flex-row items-center mb-3 ml-1">
            <Text className="text-gray-700 font-black text-[13px] uppercase tracking-wider">Danh mục món</Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <View className="flex-row flex-wrap">
            {categories.map((category) => {
              const isSelected = form.category === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setForm({ ...form, category: category.id })}
                  activeOpacity={0.7}
                  className={`mr-3 mb-3 px-5 py-3 rounded-2xl border ${isSelected
                    ? "bg-[#E07B39] border-[#E07B39] shadow-md shadow-orange-200"
                    : "bg-white border-gray-100 shadow-sm"
                    }`}
                >
                  <Text
                    className={`font-black text-xs ${isSelected ? "text-white" : "text-gray-500"
                      }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="flex-row justify-between">
          <View className="w-[47%]">
            <InputField
              label="Giá tiền (đ)"
              value={form.price}
              onChangeText={(text: string) => setForm({ ...form, price: text })}
              placeholder="VD: 55000"
              keyboardType="numeric"
              required
            />
          </View>
          <View className="w-[47%]">
            <InputField
              label="Đơn vị"
              value={form.unit}
              onChangeText={(text: string) => setForm({ ...form, unit: text })}
              placeholder="bát, đĩa, ly..."
            />
          </View>
        </View>

        <InputField
          label="Mô tả chi tiết"
          value={form.description}
          onChangeText={(text: string) =>
            setForm({ ...form, description: text })
          }
          placeholder="Nhập mô tả hấp dẫn về món ăn..."
          multiline
        />

        <View className="mb-8">
          <Text className="text-gray-800 font-black text-[12px] uppercase tracking-[1px] mb-3 ml-1">Hình ảnh món ăn</Text>
          
          <View className="mb-4">
            {form.image ? (
              <View className="relative">
                <Image 
                  source={{ uri: form.image }} 
                  className="w-full h-48 rounded-[28px] border border-gray-100"
                />
                <TouchableOpacity 
                  onPress={() => setForm({...form, image: ""})}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full items-center justify-center shadow-md"
                >
                  <MaterialCommunityIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={pickImage}
                className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-[28px] items-center justify-center"
              >
                <View className="w-16 h-16 bg-orange-50 rounded-full items-center justify-center mb-3">
                  <MaterialCommunityIcons name="camera-plus" size={32} color="#E07B39" />
                </View>
                <Text className="text-gray-400 font-bold text-sm">Chạm để chọn hoặc chụp ảnh</Text>
                <Text className="text-gray-300 text-[10px] mt-1 uppercase font-black">Khuyên dùng tỷ lệ 1:1</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center my-3 px-2">
            <View className="flex-1 h-[1px] bg-gray-100" />
            <Text className="mx-4 text-gray-300 font-black text-[10px] uppercase">Hoặc dùng Link ảnh</Text>
            <View className="flex-1 h-[1px] bg-gray-100" />
          </View>

          <TextInput
            style={{ borderRadius: 20 }}
            className="bg-white border border-gray-100 h-14 p-4 text-gray-800 shadow-sm"
            value={form.image}
            onChangeText={(text: string) => setForm({ ...form, image: text })}
            placeholder="Dán link ảnh từ Google/Unsplash..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm mb-10">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center">
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color="#10B981"
                />
              </View>
              <View className="ml-3">
                <Text className="font-black text-gray-800 text-sm">Sẵn sàng phục vụ</Text>
                <Text className="text-gray-400 text-[10px] font-bold">Hiển thị món trên Menu</Text>
              </View>
            </View>
            <Switch
              value={form.isAvailable}
              onValueChange={(val) => setForm({ ...form, isAvailable: val })}
              trackColor={{ false: "#E5E7EB", true: "#E07B39" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-orange-50 rounded-xl items-center justify-center">
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color="#F59E0B"
                />
              </View>
              <View className="ml-3">
                <Text className="font-black text-gray-800 text-sm">Best Seller</Text>
                <Text className="text-gray-400 text-[10px] font-bold">Gắn nhãn món bán chạy</Text>
              </View>
            </View>
            <Switch
              value={form.isBestSeller}
              onValueChange={(val) => setForm({ ...form, isBestSeller: val })}
              trackColor={{ false: "#E5E7EB", true: "#E07B39" }}
              thumbColor="#FFFFFF"
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.8}
          className={`py-4 rounded-xl flex-row items-center justify-center mb-10 ${
            loading ? "bg-gray-300" : "bg-[#E07B39]"
          }`}
          style={{ elevation: 3 }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color="white"
              />
              <Text className="text-white font-bold ml-2 text-base">
                Hoàn tất thêm món
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AdminCreateProduct;
