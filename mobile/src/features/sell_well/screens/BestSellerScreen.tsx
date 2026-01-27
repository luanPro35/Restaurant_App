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
import { LinearGradient } from "expo-linear-gradient";
import { PRODUCTS, Product } from "../../../data/dish";
import BestSellerCard from "../components/BestSellerCard";
import Shopping_Cart from "../../../app/providers/Shopping_Cart";
import CartModal from "../../menu/components/CartModal";
import Search_Dish from "../../delivery/Header/Search_Dish";

interface BestSellerItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  soldCount: number;
  rating: number;
  rank: number;
}

interface CartItem extends BestSellerItem {
  quantity: number;
}

type FilterType = "all" | "today" | "week" | "month";

export default function BestSellerScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Mock best seller data with ranking
  const getBestSellerItems = (): BestSellerItem[] => {
    return PRODUCTS.slice(0, 20).map((product, index) => ({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image:
        product.image ||
        "https://via.placeholder.com/400x300/E07B39/ffffff?text=" +
          encodeURIComponent(product.name),
      description: product.description || "",
      soldCount: Math.floor(Math.random() * 500) + 100,
      rating: 4 + Math.random() * 1,
      rank: index + 1,
    }));
  };

  const getFilteredItems = (): BestSellerItem[] => {
    let items = getBestSellerItems();

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    // Sort by rank
    return items.sort((a, b) => a.rank - b.rank);
  };

  const bestSellerItems = getFilteredItems();

  const handleAddToCart = (item: BestSellerItem) => {
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

  const filters: { type: FilterType; label: string; icon: string }[] = [
    { type: "all", label: "Tất cả", icon: "fire" },
    { type: "today", label: "Hôm nay", icon: "calendar-today" },
    { type: "week", label: "Tuần này", icon: "calendar-week" },
    { type: "month", label: "Tháng này", icon: "calendar-month" },
  ];

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

      <LinearGradient
        colors={["#FF6B6B", "#FF8E53"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: 48,
          paddingBottom: 24,
          paddingHorizontal: 16,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 12 }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <MaterialCommunityIcons name="fire" size={32} color="#FFD700" />
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginLeft: 12,
              }}
            >
              Bán Chạy
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.25)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              Top {bestSellerItems.length}
            </Text>
          </View>
        </View>

        {/* Search */}
        <Search_Dish
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Tìm món bán chạy..."
        />

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              onPress={() => setActiveFilter(filter.type)}
              style={{
                backgroundColor:
                  activeFilter === filter.type
                    ? "white"
                    : "rgba(255,255,255,0.25)",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 8,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeFilter === filter.type ? 0.15 : 0,
                shadowRadius: 4,
                elevation: activeFilter === filter.type ? 3 : 0,
              }}
            >
              <MaterialCommunityIcons
                name={filter.icon as any}
                size={18}
                color={activeFilter === filter.type ? "#FF6B6B" : "white"}
              />
              <Text
                style={{
                  color: activeFilter === filter.type ? "#FF6B6B" : "white",
                  fontWeight: "600",
                  marginLeft: 6,
                  fontSize: 14,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Best Seller List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {searchQuery && (
          <View
            style={{
              backgroundColor: "#FFE5E5",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginBottom: 16,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#FF6B6B", fontWeight: "600", fontSize: 13 }}>
              Tìm thấy {bestSellerItems.length} món
            </Text>
          </View>
        )}

        {bestSellerItems.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <MaterialCommunityIcons name="fire-off" size={80} color="#ddd" />
            <Text style={{ color: "#999", fontSize: 16, marginTop: 16 }}>
              Không tìm thấy món ăn
            </Text>
          </View>
        ) : (
          bestSellerItems.map((item) => (
            <BestSellerCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </ScrollView>

      {/* Shopping Cart Button */}
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

      {/* Cart Modal */}
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
