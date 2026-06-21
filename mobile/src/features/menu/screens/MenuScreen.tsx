import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuItemCard from "../components/MenuItemCard";
import Search_Dish from "../../delivery/Header/Search_Dish";
import { useMenu } from "../hooks/useMenu";
import { MenuItem, CartItem } from "../types";
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";
import { useCart } from "../../../app/context/CartContext";
import { IP } from "../../../config/ip";
import { resolveImageUrl } from "../../../shared/utils";

export default function MenuScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const { menu, loading, fetchMenu, filter, setFilter } = useMenu();
  const { addToCart, setIsCartVisible } = useCart();
  const [isCartVisibleLocal, setIsCartVisibleLocal] = useState(false); // Just in case, but actually let's use the global one
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

  const handlePriceFilter = (value: string) => {
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;

    if (value === "under50") maxPrice = 50000;
    if (value === "50to150") {
      minPrice = 50000;
      maxPrice = 150000;
    }
    if (value === "over150") minPrice = 150000;

    const newFilter = { ...filter, minPrice, maxPrice };
    setFilter(newFilter);
    fetchMenu(newFilter);
  };

  const handleSort = () => {
    const newOrder = filter.sortOrder === "asc" ? "desc" : "asc";
    const newFilter = { ...filter, sortOrder: newOrder };
    setFilter(newFilter);
    fetchMenu(newFilter);
  };

  const menuItems: MenuItem[] = menu
    .filter((item: any) => item.isAvailable !== false)
    .map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      image: resolveImageUrl(item.image || item.images),
      description: item.description || "",
      category: item.category?.name || "Khác",
    };
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  const getActivePriceFilter = () => {
    if (filter.minPrice === undefined && filter.maxPrice === 50000)
      return "under50";
    if (filter.minPrice === 50000 && filter.maxPrice === 150000)
      return "50to150";
    if (filter.minPrice === 150000 && filter.maxPrice === undefined)
      return "over150";
    return "all";
  };

  const currentPriceFilter = getActivePriceFilter();

  const FilterChip = ({ label, value }: { label: string; value: string }) => (
    <TouchableOpacity
      onPress={() => handlePriceFilter(value)}
      className={`px-4 py-2 rounded-full mr-2 border ${
        currentPriceFilter === value
          ? "bg-white border-white"
          : "bg-white/10 border-white/20"
      }`}
    >
      <Text
        className={`font-semibold ${
          currentPriceFilter === value ? "text-[#E07B39]" : "text-white"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleProductPress = (item: MenuItem) => {
    navigation.navigate("DetailProduct", { id: item.id });
  };

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      <View className="bg-[#E07B39] pt-12 pb-4 px-4 rounded-b-3xl shadow-lg">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={28}
              color="white"
            />
            <Text className="text-white text-2xl font-bold ml-3">Menu</Text>
          </View>
          <TouchableOpacity
            onPress={handleSort}
            className="bg-white/20 p-2 rounded-full"
          >
            <MaterialCommunityIcons
              name={
                filter.sortOrder === "asc"
                  ? "sort-ascending"
                  : "sort-descending"
              }
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <Search_Dish
          searchQuery={filter.search}
          onSearchChange={handleSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          <FilterChip label="Tất cả" value="all" />
          <FilterChip label="Dưới 50k" value="under50" />
          <FilterChip label="50k - 150k" value="50to150" />
          <FilterChip label="Trên 150k" value="over150" />
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E07B39"]} tintColor="#E07B39" />}
      >
        {loading && !refreshing && menuItems.length === 0 ? (
          <View className="py-20">
            <ActivityIndicator size="large" color="#E07B39" />
          </View>
        ) : (
          <>
            {filter.search && (
              <View className="bg-orange-100 px-4 py-2 rounded-full mb-4 self-start">
                <Text className="text-orange-600 font-semibold text-sm">
                  Tìm thấy {menuItems.length} món
                </Text>
              </View>
            )}

            {menuItems.length === 0 ? (
              <View className="items-center justify-center py-20">
                <MaterialCommunityIcons
                  name="food-off"
                  size={80}
                  color="#ddd"
                />
                <Text className="text-gray-400 text-base mt-4">
                  Không tìm thấy món ăn
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item as any}
                    onAddToCart={handleAddToCart as any}
                    onPress={handleProductPress}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Cart Button and Modal are now handled globally in App.tsx */}
    </View>
  );
}
