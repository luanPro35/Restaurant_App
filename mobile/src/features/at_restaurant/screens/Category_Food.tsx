import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const List_Dish = [
  {
    id: 1,
    name: "Khai vị",
    icon: "food-fork-drink",
  },
  {
    id: 2,
    name: "Súp các loại",
    icon: "bowl-mix",
  },
  {
    id: 3,
    name: "Rau theo mùa",
    icon: "leaf",
  },
  {
    id: 4,
    name: "Nộm và Salad",
    icon: "salad",
  },
  {
    id: 5,
    name: "Gà ta",
    icon: "food-drumstick",
  },
  {
    id: 6,
    name: "Gà đen",
    icon: "food-turkey",
  },
  {
    id: 7,
    name: "Trà Trái Cây & Giải Nhiệt",
    icon: "tea",
  },
  {
    id: 8,
    name: "Nước Ép Tươi",
    icon: "cup",
  },
  {
    id: 9,
    name: "Đồ Uống Truyền Thống & Sữa",
    icon: "bottle-soda-classic",
  },
  {
    id: 10,
    name: "Cà Phê",
    icon: "coffee",
  },
  {
    id: 11,
    name: "Đồ Đóng Chai & Có Cồn",
    icon: "beer",
  },
];
interface CategoryFoodProps {
  onSelectCategory: (index: number) => void;
}

export default function Category_Food({ onSelectCategory }: CategoryFoodProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-[#F9F6E7]">
      <View className="px-4 pt-4">
        <Text className="text-xl font-bold text-[#2D2D2D] mb-4">
          Danh mục món ăn
        </Text>
        <FlatList
          data={List_Dish}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="items-center mr-5"
              activeOpacity={0.7}
              onPress={() => onSelectCategory(index)}
            >
              <View
                className="items-center justify-center mb-2 bg-white shadow-sm"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={32}
                  color="#E07B39"
                />
              </View>
              <Text
                className="text-xs font-semibold text-[#2D2D2D] text-center"
                style={{ width: 80 }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
