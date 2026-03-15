import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import apiProducts from "@/services/api/apiProducts";
import { MenuItem } from "../types";
import { formatCurrency } from "../../../shared/utils";
import { useCart } from "@/app/context/CartContext";

export default function DetailProduct() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative h-[420px]">
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
            colors={["rgba(0,0,0,0.5)", "transparent", "transparent", "transparent"]}
            className="absolute inset-0"
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ top: Math.max(insets.top, 24) }}
            className="absolute left-6 w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color="white"
            />
          </TouchableOpacity>

          <View className="absolute bottom-12 left-6 bg-[#E07B39] px-4 py-2 rounded-xl shadow-lg mb-8">
            <Text className="text-white text-[11px] font-black uppercase tracking-[1.5px]">
              {typeof product.category === "string"
                ? product.category
                : product.category?.name || "Khác"}
            </Text>
          </View>
        </View>

        <View className="bg-[#FDFCF7] -mt-12 rounded-t-[48px] px-8 pt-10 pb-40">
          <View className="flex-row justify-between items-start mb-8">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-black text-gray-900 leading-[42px]">
                {product.name}
              </Text>
            </View>
            <View className="bg-[#FFF3E8] px-4 py-2.5 rounded-2xl border border-[#FFE4D0] shadow-sm">
              <Text className="text-2xl font-black text-[#E07B39]">
                {formatCurrency(product.price)}
              </Text>
            </View>
          </View>

          <View className="mb-10">
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 bg-orange-50 rounded-xl items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name="script-text-outline"
                  size={18}
                  color="#E07B39"
                />
              </View>
              <Text className="text-[13px] font-black text-gray-400 uppercase tracking-[2px]">
                Mô tả chi tiết
              </Text>
            </View>
            <Text className="text-base text-gray-600 leading-[26px] font-medium opacity-90">
              {product.description ||
                "Chưa có mô tả cho món ăn này. Chúng tôi đảm bảo hương vị thơm ngon và chuẩn vị nhất dành cho quý khách."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0"
        style={{
          paddingBottom: Math.max(insets.bottom, 24),
          paddingTop: 12,
          paddingHorizontal: 28,
          backgroundColor: "rgba(253, 252, 247, 0.95)",
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.04)",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => product && addToCart(product)}
          style={{
            height: 60,
            borderRadius: 30,
            shadowColor: "#E07B39",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 15,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              borderRadius: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            />

            <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
            <Text className="text-white text-[16px] font-black uppercase ml-3 tracking-widest">
              Thêm vào giỏ · {formatCurrency(product.price)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
