import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import adminApi from "../../admin-api";
import { useAdminProducts } from "../../hooks/useAdminProducts";

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

const categories = [
  { id: "1e52c6ce-1d9e-4d0d-821b-604a2ba36359", name: "Món chính" },
  { id: "14a95a8a-ed42-4ad8-ad3f-e0e16aef0959", name: "Món khai vị" },
  { id: "5bc9e23d-2a41-4a2d-bd56-1bef3ac1a7c3", name: "Tráng miệng" },
  { id: "7d0a2143-9c63-4b7e-9ff3-c30542c6e92e", name: "Đồ uống" },
];

export default function AdminEditProduct() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<AdminStackParamList, "AdminEditProduct">>();
  const { productId } = route.params;
  const { updateProduct } = useAdminProducts();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "",
    category: "",
    image: "",
    isAvailable: true,
    isBestSeller: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await adminApi.products.getById(productId);
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          unit: product.unit || "đĩa",
          category: product.categoryId || categories[0].id,
          image: product.images || "",
          isAvailable: product.isAvailable ?? true,
          isBestSeller: product.isBestSeller ?? false,
        });
      } catch (error) {
        console.error("Fetch product error:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.category) {
      Alert.alert("Thông báo", "Vui lòng kiểm tra lại các trường bắt buộc (*)");
      return;
    }

    setSubmitting(true);
    try {
      await updateProduct(productId, {
        ...form,
        price: Number(form.price),
      });
      Alert.alert("Thành công", "Thông tin món ăn đã được cập nhật", [
        { text: "Tuyệt vời", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update product error:", error);
      Alert.alert("Lỗi hệ thống", "Không thể cập nhật sản phẩm lúc này");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFCF7]">
        <ActivityIndicator size="large" color="#E07B39" />
        <Text className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Chỉnh Sửa Món</Text>
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
            <Text className="text-gray-800 font-black text-[12px] uppercase tracking-[1px]">Danh mục món</Text>
            <Text className="text-red-500 ml-1 font-bold">*</Text>
          </View>
          <View className="flex-row flex-wrap">
            {categories.map((category) => {
              const isSelected = form.category === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setForm({ ...form, category: category.id })}
                  activeOpacity={0.7}
                  style={{ borderRadius: 16 }}
                  className={`mr-3 mb-3 px-5 py-3 border ${isSelected
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

        <InputField
          label="URL Hình ảnh"
          value={form.image}
          onChangeText={(text: string) => setForm({ ...form, image: text })}
          placeholder="https://images.unsplash.com/..."
        />

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
          onPress={handleUpdate}
          disabled={submitting}
          activeOpacity={0.8}
          className={`py-4 rounded-xl flex-row items-center justify-center mb-10 ${
            submitting ? "bg-gray-300" : "bg-[#E07B39]"
          }`}
          style={{ elevation: 3 }}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons
                name="content-save"
                size={20}
                color="white"
              />
              <Text className="text-white font-bold ml-2 text-base">
                Lưu thay đổi ngay
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
