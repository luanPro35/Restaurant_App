import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { productApi } from "../../../services/api/apiProducts";
import { seededShuffle, getDailySeed } from "../../../utils/random";
import { formatCurrency } from "../../../shared/utils";
import { useCart } from "../../../app/context/CartContext";

const MealProductCard = ({
  item,
  navigation,
}: {
  item: any;
  navigation: any;
}) => {
  const { addToCart } = useCart();

  const imageUrl =
    (item.images || item.image) &&
    ((item.images || item.image).startsWith("http") ||
      (item.images || item.image).startsWith("data:"))
      ? item.images || item.image
      : "https://res.cloudinary.com/dt9v7896q/image/upload/v1710502127/placeholder_food.png";

  const handlePress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate("DetailProduct", { id: item.id.toString() });
    }
  };

  return (
    <View className="mr-5 bg-white rounded-[32px] shadow-sm w-[180px] my-3 overflow-hidden border border-gray-100/50">
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <View className="h-40 w-full bg-gray-50 relative">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded-full border border-white/50">
            <Text className="text-[9px] font-black text-[#E07B39] uppercase">
              {item.category?.name || item.category || "Món ngon"}
            </Text>
          </View>
        </View>

        <View className="p-4 pb-0 bg-white">
          <Text
            className="text-gray-800 text-[15px] font-black mb-1 truncate"
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="p-4 pt-2 bg-white">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[#E07B39] font-black text-[16px]">
              {typeof item.price === "number"
                ? formatCurrency(item.price)
                : item.price}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-[#E07B39] w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-orange-200 active:scale-90"
            onPress={() => addToCart(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="cart-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function MealOption({ navigation }: { navigation: any }) {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAndRandomize = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll({ limit: 50 });
        const allProducts = Array.isArray(response)
          ? response
          : response.data || [];

        if (isMounted && allProducts.length > 0) {
          const shuffled = seededShuffle(
            allProducts,
            getDailySeed() + "_meal_random",
          );
          setDishes(shuffled.slice(0, 15));
        }
      } catch (err) {
        console.error("MealOption fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAndRandomize();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="py-6">
      <View className="px-4 mb-4">
        <View className="flex-row items-center">
          <View className="w-1.5 h-7 bg-[#E07B39] rounded-full mr-3 shadow-sm" />
          <View>
            <Text className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Gợi ý hôm nay
            </Text>
            <Text className="text-[#E07B39] text-[10px] font-bold uppercase tracking-[2px] mt-0.5">
              Những món ngon mà bạn không nên bỏ lỡ
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={dishes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `meal-${item.id}`}
          renderItem={({ item }) => (
            <MealProductCard item={item} navigation={navigation} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={200}
          decelerationRate="fast"
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={3}
        />
      )}
    </View>
  );
}
