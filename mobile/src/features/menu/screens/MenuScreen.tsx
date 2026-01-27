import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MENU_SECTIONS, PRODUCTS, Product } from "../../../data/dish";
import MenuItemCard from "../components/MenuItemCard";
import Shopping_Cart from "../../../app/providers/Shopping_Cart";
import CartModal from "../components/CartModal";
import Search_Dish from "../../delivery/Header/Search_Dish";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const categoryMap: { [key: number]: string } = {};
  MENU_SECTIONS.forEach((section, index) => {
    categoryMap[index + 1] = section.title;
  });

  const convertToMenuItem = (product: Product): MenuItem => ({
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    image:
      product.image ||
      "https://via.placeholder.com/400x300/E07B39/ffffff?text=" +
        encodeURIComponent(product.name),
    description: product.description || "",
    category: categoryMap[product.categoryId] || "",
  });

  const getFilteredItems = (): MenuItem[] => {
    let filtered = PRODUCTS;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    return filtered.map(convertToMenuItem);
  };

  const menuItems = getFilteredItems();

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

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg">
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
          <View className="bg-white/20 px-3 py-2 rounded-full">
            <Text className="text-white font-semibold">
              {menuItems.length} món
            </Text>
          </View>
        </View>

        <Search_Dish
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {searchQuery && (
          <View className="bg-orange-100 px-4 py-2 rounded-full mb-4 self-start">
            <Text className="text-orange-600 font-semibold text-sm">
              Tìm thấy {menuItems.length} món
            </Text>
          </View>
        )}

        {menuItems.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialCommunityIcons name="food-off" size={80} color="#ddd" />
            <Text className="text-gray-400 text-base mt-4">
              Không tìm thấy món ăn
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Shopping_Cart
          itemCount={totalItems}
          onPress={() => setIsCartVisible(true)}
        />
      </View>
      <CartModal
        visible={isCartVisible}
        items={cartItems}
        onClose={() => setIsCartVisible(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </View>
  );
}
