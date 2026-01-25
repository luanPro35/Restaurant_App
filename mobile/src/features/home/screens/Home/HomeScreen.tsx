import React from "react";
import { View, ScrollView } from "react-native";
import Choose_Feature from "./Choose/Choose_Feature";
import Header from "./Header";
import Banner_Introduce from "./Banner_Introduce";
import Today_Feautured from "./Today_Feautured";
import Best_Seller_Today from "./Best_Seller_Today";
import New_Dish from "./New_Dish";
import Quick_Combo from "./Quick_Combo";
import MealOption from "./MealOption";
interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <Header onLogout={onLogout} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <Choose_Feature />
        </View>
        <View className="px-3">
          <Banner_Introduce />
        </View>
        <View className="px-3">
          <Today_Feautured />
        </View>
        <View className="px-3">
          <Best_Seller_Today />
        </View>
        <View className="px-3">
          <New_Dish />
        </View>
        <View className="px-3">
          <Quick_Combo />
        </View>
        <View className="px-3">
          <MealOption />
        </View>
      </ScrollView>
    </View>
  );
}
