import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search_Dish from "../../delivery/Header/Search_Dish";
import { useMenu } from "../../menu/hooks/useMenu";
import { Config } from "../../../config";
import { useRestaurantCart } from "../context/RestaurantCartContext";
import { formatCurrency, resolveImageUrl } from "../../../shared/utils";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
  rawPrice: number;
}

interface MenuSectionProps {
  onAddItem?: (item: any) => void;
}

export default function MenuSection({ onAddItem }: MenuSectionProps) {
  const { menu, loading, error, filter, fetchMenu, setFilter } = useMenu();
  const { addToRestaurantCart } = useRestaurantCart();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMenu();
    setRefreshing(false);
  }, [fetchMenu]);

  useFocusEffect(
    useCallback(() => {
      fetchMenu();
    }, [])
  );

  const handleSearch = (query: string) => {
    setFilter((prev: any) => ({ ...prev, search: query }));
    fetchMenu({ ...filter, search: query });
  };

  const convertToMenuItem = (item: any): MenuItem => {
    return {
      id: item._id || item.id?.toString(),
      name: item.name,
      price:
        typeof item.price === "number"
          ? `${item.price.toLocaleString()}đ`
          : item.price,
      rawPrice: typeof item.price === "number" ? item.price : 0,
      image: resolveImageUrl(item.images || item.image),
      description: item.description || "",
      category: item.category?.name || "Khác",
    };
  };

  const menuItems = (Array.isArray(menu) ? menu : [])
    .filter((item) => item.isAvailable !== false)
    .filter((item) => {
      if (selectedCategory === null) return true;
      return item.categoryId === selectedCategory;
    })
    .map(convertToMenuItem);

  const handleAddItem = (item: MenuItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.rawPrice,
      image: item.image,
      description: item.description,
      category: item.category,
    };
    addToRestaurantCart(cartItem as any);
    onAddItem?.(cartItem);
  };

  return (
    <View className="flex-1">
      <Search_Dish searchQuery={filter.search} onSearchChange={handleSearch} />
      <View className="flex-1 bg-white rounded-t-3xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800">Thực đơn</Text>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="text-orange-600 font-semibold">
              {menuItems.length} món
            </Text>
          </View>
        </View>

        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="flex-1"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#f97316"]} tintColor="#f97316" />}
          >
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <View
                  key={item.id}
                  className="flex-row bg-gray-50 rounded-2xl p-3 mb-3 shadow-sm"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="w-24 h-24 rounded-xl bg-gray-200"
                  />
                  <View className="flex-1 ml-3 justify-between">
                    <View>
                      <Text className="text-gray-800 font-bold text-base">
                        {item.name}
                      </Text>
                      {item.description ? (
                        <Text
                          className="text-gray-500 text-xs mt-1"
                          numberOfLines={2}
                        >
                          {item.description}
                        </Text>
                      ) : null}
                      <View className="bg-orange-100 px-2 py-1 rounded-full mt-1 self-start">
                        <Text className="text-orange-600 text-xs font-semibold">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-orange-600 font-bold text-base">
                        {item.price}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleAddItem(item)}
                        className="bg-orange-500 rounded-full p-2"
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-gray-400">Không tìm thấy món ăn nào</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
