import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import apiProducts from "@/services/api/apiProducts";
import { MenuItem } from "../types";
import { formatCurrency } from "../../../shared/utils";
import { useCart } from "@/app/context/CartContext";

export default function DetailProduct() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const { addToCart } = useCart();
  const [product, setProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiProducts.getById(id);
        const data = response.data || response;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin món ăn");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFCF7]">
        <ActivityIndicator size="large" color="#E07B39" />
        <Text className="mt-4 text-gray-400 font-medium">
          Đang tải thông tin...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFCF7] px-6">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color="#D1D5DB"
        />
        <Text className="mt-4 text-lg font-bold text-gray-800 text-center">
          {error || "Không tìm thấy món ăn"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-6 bg-[#E07B39] px-8 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative h-[400px]">
          <Image
            source={{
              uri:
                product.image ||
                (Array.isArray((product as any).images)
                  ? (product as any).images[0]
                  : (product as any).images) ||
                "https://via.placeholder.com/400",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
            className="absolute inset-0"
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md items-center justify-center border border-white/20"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="white"
            />
          </TouchableOpacity>

          <View className="absolute bottom-6 left-6 bg-[#E07B39] px-4 py-1.5 rounded-full shadow-lg mb-12">
            <Text className="text-white text-xs font-black uppercase tracking-widest">
              {typeof product.category === "string"
                ? product.category
                : product.category?.name || "Khác"}
            </Text>
          </View>
        </View>

        <View className="bg-[#FDFCF7] -mt-16 rounded-t-[40px] px-6 pt-8 pb-32">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-black text-gray-800 leading-tight">
                {product.name}
              </Text>
            </View>
            <View className="bg-[#FFF3E8] px-4 py-2 rounded-2xl border border-[#FFE4D0]">
              <Text className="text-xl font-black text-[#E07B39]">
                {formatCurrency(product.price)}
              </Text>
            </View>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons
                name="silverware-clean"
                size={18}
                color="#E07B39"
              />
              <Text className="ml-2 text-sm font-black text-gray-400 uppercase tracking-widest">
                Mô tả món ăn
              </Text>
            </View>
            <Text className="text-base text-gray-600 leading-relaxed font-medium">
              {product.description ||
                "Chưa có mô tả cho món ăn này. Chúng tôi đảm bảo hương vị thơm ngon và chuẩn vị nhất dành cho quý khách."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 left-6 right-6">
        <TouchableOpacity
          activeOpacity={0.9}
          className="shadow-2xl"
          onPress={() => product && addToCart(product)}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-3xl py-5 flex-row items-center justify-center"
          >
            <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
            <Text className="text-white text-lg font-black ml-3">
              THÊM VÀO GIỎ · {formatCurrency(product.price)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
