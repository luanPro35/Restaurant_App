import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../../features/admin/screens/AdminDashboardScreen";
import AdminSettingsScreen from "../../features/admin/screens/AdminSettingsScreen";
import AdminProductsScreen from "../../features/admin/screens/AdminProductsScreen";
import AdminCreateProduct from "../../features/admin/screens/AdminProductsScreen/AdminCreateProduct";
import AdminCategoriesScreen from "../../features/admin/screens/AdminCategoriesScreen";
import AdminTablesScreen from "../../features/admin/screens/AdminTablesScreen";
import AdminEditTables from "../../features/admin/screens/AdminTablesScreen/AdminEditTables";
import AdminAddTables from "../../features/admin/screens/AdminTablesScreen/AdminAddTables";
import AdminOrdersScreen from "../../features/admin/screens/AdminOrdersScreen";
import AdminDetailOrder from "../../features/admin/screens/AdminOrdersScreen/AdminDetailOrder";
import AdminUsersScreen from "../../features/admin/screens/AdminUsersScreen";
import { AdminTable, AdminOrder } from "../../features/admin/types/admin.types";
import AdminPromotionsScreen from "@/features/admin/screens/AdminPromotionsScreen";
import AdminAddPromotionScreen from "@/features/admin/screens/AdminPromotionsScreen/AdminAddPromotionScreen";
import AdminEditPromotionScreen from "@/features/admin/screens/AdminPromotionsScreen/AdminEditPromotionScreen";
import AdminNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen";
import AdminAddNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminAddNotificationsScreen";
import AdminEditNotificationScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminEditNotificationScreen";
import AdminEditProduct from "@/features/admin/screens/AdminProductsScreen/AdminEditProduct";
import DetailProduct from "../../features/menu/screens/DetailProduct";

export type AdminStackParamList = {
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
  AdminAddPromotionScreen: undefined;
  AdminEditPromotionScreen: { promotionId: string };
  AdminNotificationsScreen: undefined;
  AdminAddNotificationsScreen: undefined;
  AdminEditNotificationScreen: { notificationId: string };
  AdminEditProduct: { productId: string };
  DetailProduct: { id: string };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
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
      <Stack.Screen
        name="AdminAddPromotionScreen"
        component={AdminAddPromotionScreen}
      />
      <Stack.Screen
        name="AdminEditPromotionScreen"
        component={AdminEditPromotionScreen}
      />
      <Stack.Screen
        name="AdminNotificationsScreen"
        component={AdminNotificationsScreen}
      />
      <Stack.Screen
        name="AdminAddNotificationsScreen"
        component={AdminAddNotificationsScreen}
      />
      <Stack.Screen
        name="AdminEditNotificationScreen"
        component={AdminEditNotificationScreen}
      />
      <Stack.Screen name="AdminEditProduct" component={AdminEditProduct} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
    </Stack.Navigator>
  );
}
