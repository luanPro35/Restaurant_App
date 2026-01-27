import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MENU_SECTIONS, PRODUCTS, Product } from "../../../data/dish";
import Search_Dish from "../../delivery/Header/Search_Dish";
interface MenuItem {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

interface MenuSectionProps {
  onAddItem?: (item: MenuItem) => void;
}

export default function MenuSection({ onAddItem }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categoryMap: { [key: number]: string } = {};
  MENU_SECTIONS.forEach((section, index) => {
    categoryMap[index + 1] = section.title;
  });

  const convertToMenuItem = (product: Product): MenuItem => ({
    id: product.id.toString(),
    name: product.name,
    price: product.price,
    image: product.image || "https://via.placeholder.com/150",
    description: product.description || "",
    category: categoryMap[product.categoryId] || "",
  });

  const getFilteredItems = (): MenuItem[] => {
    const filtered =
      selectedCategory === null
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.categoryId === selectedCategory);
    return filtered.map(convertToMenuItem);
  };

  const menuItems = getFilteredItems();

  const categories = [
    { id: null, name: "Tất cả" },
    ...MENU_SECTIONS.map((section, index) => ({
      id: index + 1,
      name: section.title,
    })),
  ];

  return (
    <View className="flex-1">
      <Search_Dish />
      <View className="flex-1 bg-white rounded-t-3xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800">Thực đơn</Text>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="text-orange-600 font-semibold">
              {menuItems.length} món
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {menuItems.map((item) => (
            <View
              key={item.id}
              className="flex-row bg-gray-50 rounded-2xl p-3 mb-3 shadow-sm"
            >
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-xl"
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
                    onPress={() => onAddItem?.(item)}
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
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
