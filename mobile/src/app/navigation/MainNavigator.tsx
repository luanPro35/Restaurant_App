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
import AdminDashboardScreen from "../../features/admin/screens/AdminDashboardScreen";
import AdminSettingsScreen from "../../features/admin/screens/AdminSettingsScreen";
import AdminProductsScreen from "../../features/admin/screens/AdminProductsScreen";
import AdminCreateProduct from "../../features/admin/screens/AdminProductsScreen/AdminCreateProduct";
import AdminCategoriesScreen from "../../features/admin/screens/AdminCategoriesScreen";
import AdminTablesScreen from "../../features/admin/screens/AdminTablesScreen";
import AdminEditTables from "../../features/admin/screens/AdminTablesScreen/AdminEditTables";
import { AdminTable, AdminOrder } from "../../features/admin/types/admin.types";
import AdminAddTables from "../../features/admin/screens/AdminTablesScreen/AdminAddTables";
import AdminOrdersScreen from "@/features/admin/screens/AdminOrdersScreen";
import AdminDetailOrder from "../../features/admin/screens/AdminOrdersScreen/AdminDetailOrder";
import AdminUsersScreen from "../../features/admin/screens/AdminUsersScreen";
import AdminPromotionsScreen from "@/features/admin/screens/AdminPromotionsScreen";

export type MainStackParamList = {
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
  ChangeProfile: undefined;
  AdminDashboard: undefined;
  AdminSettings: undefined;
  AdminProducts: undefined;
  AdminCreateProduct: undefined;
  AdminCategories: undefined;
  AdminTablesScreen: undefined;
  AdminEditTables: { table: AdminTable };
  AdminAddTables: undefined;
  AdminOrdersScreen: undefined;
  AdminDetailOrder: { order: AdminOrder };
  AdminUsersScreen: undefined;
  AdminPromotionsScreen: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
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
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminCreateProduct" component={AdminCreateProduct} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} />
      <Stack.Screen name="AdminTablesScreen" component={AdminTablesScreen} />
      <Stack.Screen name="AdminEditTables" component={AdminEditTables} />
      <Stack.Screen name="AdminAddTables" component={AdminAddTables} />
      <Stack.Screen name="AdminOrdersScreen" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminDetailOrder" component={AdminDetailOrder} />
      <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} />
      <Stack.Screen
        name="AdminPromotionsScreen"
        component={AdminPromotionsScreen}
      />
    </Stack.Navigator>
  );
}
