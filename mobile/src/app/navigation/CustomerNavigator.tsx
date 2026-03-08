import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../features/home/screens/HomeScreen";
import DeliveryScreen from "../../features/delivery/screens/DeliveryScreen";
import AtRestaurant from "../../features/at_restaurant/screens/AtRestaurant";
import MenuScreen from "../../features/menu/screens/MenuScreen";
import BestSellerScreen from "../../features/sell_well/screens/BestSellerScreen";
import PromotionScreen from "../../features/promotion/screens/PromotionScreen";
import HistoryScreen from "../../features/history/screens/HistoryScreen";
import PackageScreen from "../../features/package/screens/PackageScreen";
import PaymentScreen from "../../features/payment/screens/PaymentScreen";
import MessagesScreen from "../../features/messages/screens/MessagesScreen";
import ProfileScreen from "../../features/profile/screens/ProfileScreen";
import ChangeProfileScreen from "../../features/profile/components/ChangeProfile";
import DetailProduct from "../../features/menu/screens/DetailProduct";
import { AdminUser } from "../../features/admin/types/admin-user.types";
import FormAddress from "../../features/delivery/Header/FormAddress";
import AddAdress from "../../features/delivery/Header/AddAdress";
import GamePromotion from "../../features/profile/games/GamePromotion";


export type CustomerStackParamList = {
  Home: undefined;
  AtRestaurant: undefined;
  Delivery: undefined;
  Menu: undefined;
  BestSeller: undefined;
  Promotion: undefined;
  History: undefined;
  Package: undefined;
  Payment: undefined;
  Messages: undefined;
  Profile: undefined;
  ChangeProfile: { item?: AdminUser | null };
  DetailProduct: { id: string };
  FormAddress: undefined;
  AddAdress: undefined;
  GamePromotion: undefined;

};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AtRestaurant" component={AtRestaurant} />
      <Stack.Screen name="Delivery" component={DeliveryScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="BestSeller" component={BestSellerScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Package" component={PackageScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChangeProfile" component={ChangeProfileScreen} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
      <Stack.Screen name="FormAddress" component={FormAddress} />
      <Stack.Screen name="AddAdress" component={AddAdress} />
      <Stack.Screen name="GamePromotion" component={GamePromotion} />

    </Stack.Navigator>
  );
}
