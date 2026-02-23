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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
  <View className="mb-5">
    <View className="flex-row">
      <Text className="text-gray-700 font-bold mb-2 ml-1">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <TextInput
      className={`bg-white border border-gray-200 rounded-2xl p-4 text-gray-800 shadow-sm ${multiline ? "h-32 text-start" : ""}`}
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
        // Lưu ý: Nếu backend trả về trực tiếp product (không bọc trong {data: ...})
        // thì không cần dùng .data nữa. Dựa vào repository, nó trả về direct object.
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
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      await updateProduct(productId, {
        ...form,
        price: Number(form.price),
      });
      Alert.alert("Thành công", "Đã cập nhật sản phẩm", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update product error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FDFCF7]">
        <ActivityIndicator size="large" color="#E07B39" />
        <Text className="mt-4 text-gray-500 font-medium">
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-8 px-6 rounded-b-[40px] shadow-lg"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center border border-white/30 mr-4"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Sửa món ăn</Text>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <InputField
          label="Tên món ăn"
          value={form.name}
          onChangeText={(text: string) => setForm({ ...form, name: text })}
          placeholder="VD: Phở Bò, Bún Chả..."
          required
        />

        <View className="mb-8">
          <View className="flex-row">
            <Text className="text-gray-700 font-bold mb-3 ml-1">Danh mục</Text>
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
                  className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${
                    isSelected
                      ? "bg-[#E07B39] border-[#E07B39]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isSelected ? "text-white" : "text-gray-600"
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
          <View className="w-[48%]">
            <InputField
              label="Giá tiền (VNĐ)"
              value={form.price}
              onChangeText={(text: string) => setForm({ ...form, price: text })}
              placeholder="VD: 50000"
              keyboardType="numeric"
              required
            />
          </View>
          <View className="w-[48%]">
            <InputField
              label="Đơn vị tính"
              value={form.unit}
              onChangeText={(text: string) => setForm({ ...form, unit: text })}
              placeholder="VD: phần, bát, đĩa..."
            />
          </View>
        </View>

        <InputField
          label="Mô tả món ăn"
          value={form.description}
          onChangeText={(text: string) =>
            setForm({ ...form, description: text })
          }
          placeholder="Mô tả chi tiết về món ăn..."
          multiline
        />

        <InputField
          label="Link hình ảnh"
          value={form.image}
          onChangeText={(text: string) => setForm({ ...form, image: text })}
          placeholder="https://example.com/image.jpg"
        />

        <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color="#10B981"
              />
              <Text className="ml-3 font-bold text-gray-700">
                Đang kinh doanh
              </Text>
            </View>
            <Switch
              value={form.isAvailable}
              onValueChange={(val) => setForm({ ...form, isAvailable: val })}
              trackColor={{ false: "#D1D5DB", true: "#E07B39" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="star-outline"
                size={24}
                color="#F59E0B"
              />
              <Text className="ml-3 font-bold text-gray-700">
                Món ăn bán chạy
              </Text>
            </View>
            <Switch
              value={form.isBestSeller}
              onValueChange={(val) => setForm({ ...form, isBestSeller: val })}
              trackColor={{ false: "#D1D5DB", true: "#E07B39" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleUpdate}
          disabled={submitting}
          activeOpacity={0.8}
          className="shadow-xl"
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            className="py-4 rounded-2xl items-center flex-row justify-center"
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={24}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-black text-lg ml-2">
                  LƯU THAY ĐỔI
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
