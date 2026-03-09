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
import Shopping_Cart from "../../../app/providers/Shopping_Cart";
import Navbar from "./Navbar";
import { useCart } from "../../../app/context/CartContext";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }: any) {
  const { totalItems, setIsCartVisible, setShouldHideFloatingCart } = useCart();

  useFocusEffect(
    React.useCallback(() => {
      setShouldHideFloatingCart(true);
      return () => setShouldHideFloatingCart(false);
    }, [setShouldHideFloatingCart]),
  );
  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <Header navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          <Choose_Feature navigation={navigation} />
        </View>
        <View className="px-3">
          <Banner_Introduce />
        </View>
        <View className="px-3">
          <Today_Feautured navigation={navigation} />
        </View>
        <View className="px-3">
          <Best_Seller_Today navigation={navigation} />
        </View>
        <View className="px-3">
          <New_Dish navigation={navigation} />
        </View>
        <View className="px-3">
          <Quick_Combo navigation={navigation} />
        </View>
        <View className="px-3">
          <MealOption navigation={navigation} />
        </View>
        <View className="h-32" />
      </ScrollView>

      <View className="absolute bottom-8 left-4 right-4 flex-row items-center">
        <View className="flex-1 mr-3">
          <Navbar navigation={navigation} />
        </View>
        <Shopping_Cart
          itemCount={totalItems}
          onPress={() => setIsCartVisible(true)}
        />
      </View>
    </View>
  );
}
