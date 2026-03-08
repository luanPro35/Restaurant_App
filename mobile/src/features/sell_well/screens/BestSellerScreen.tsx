import React, { useState, useMemo } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import BestSellerCard from "../components/BestSellerCard";
import Search_Dish from "../../delivery/Header/Search_Dish";
import { useBestSellers, BestSellerItem } from "../hooks/useBestSellers";
import { useCart } from "../../../app/context/CartContext";

type FilterType = "all" | "today" | "week" | "month";

export default function BestSellerScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  const { items, loading, refresh } = useBestSellers();
  const { addToCart } = useCart();

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    if (activeFilter === "today") {
       result = [...result].sort((a, b) => (a.id.length % 3) - (b.id.length % 3));
    } else if (activeFilter === "week") {
       result = [...result].sort((a, b) => b.name.length - a.name.length);
    } else if (activeFilter === "month") {
       result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, searchQuery, activeFilter]);

  const handleAddToCart = (item: BestSellerItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.rawPrice,
      image: item.image,
      description: item.description,
      category: "Best Seller"
    });
  };

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
              Top {items.length}
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
              Tìm thấy {filteredItems.length} món
            </Text>
          </View>
        )}

        {loading ? (
          <View style={{ paddingVertical: 100 }}>
             <ActivityIndicator size="large" color="#FF6B6B" />
             <Text style={{ textAlign: 'center', color: '#999', marginTop: 12 }}>Đang tải món ăn...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <MaterialCommunityIcons name="fire-off" size={80} color="#ddd" />
            <Text style={{ color: "#999", fontSize: 16, marginTop: 16 }}>
              {searchQuery ? "Không tìm thấy món ăn phù hợp" : "Danh sách trống"}
            </Text>
            <TouchableOpacity 
              onPress={refresh}
              style={{ marginTop: 20, padding: 10, backgroundColor: '#FF6B6B', borderRadius: 10 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredItems.map((item) => (
            <BestSellerCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
