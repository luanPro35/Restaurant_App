import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuItemCard from "../components/MenuItemCard";
import Shopping_Cart from "../../../app/providers/Shopping_Cart";
import CartModal from "../components/CartModal";
import Search_Dish from "../../delivery/Header/Search_Dish";
import { useMenu } from "../hooks/useMenu";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuScreen() {
  const navigation = useNavigation();
  const { menu, loading, fetchMenu, filter, setFilter } = useMenu();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);
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

  const menuItems: MenuItem[] = menu.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image:
      item.images ||
      "https://via.placeholder.com/400x300/E07B39/ffffff?text=" +
        encodeURIComponent(item.name),
    description: item.description || "",
    category: item.category?.name || "Khác",
  }));

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    console.log("Checkout with items:", cartItems);
    setIsCartVisible(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
      >
        {loading && menuItems.length === 0 ? (
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
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View className="absolute bottom-5 right-5 z-[1000]">
        <Shopping_Cart
          itemCount={totalItems}
          onPress={() => setIsCartVisible(true)}
        />
      </View>

      <CartModal
        visible={isCartVisible}
        items={cartItems as any}
        onClose={() => setIsCartVisible(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </View>
  );
}
