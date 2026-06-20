import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "../../features/admin/screens/AdminDashboardScreen";
import AdminProductsScreen from "../../features/admin/screens/AdminProductsScreen";
import AdminCategoriesScreen from "../../features/admin/screens/AdminCategoriesScreen";
import AdminTablesScreen from "../../features/admin/screens/AdminTablesScreen";
import AdminOrdersScreen from "../../features/admin/screens/AdminOrdersScreen";
import AdminUsersScreen from "../../features/admin/screens/AdminUsersScreen";
import { AdminTable, AdminOrder } from "../../features/admin/types/admin.types";
import AdminPromotionsScreen from "@/features/admin/screens/AdminPromotionsScreen";
import AdminAddPromotionScreen from "@/features/admin/screens/AdminPromotionsScreen/AdminAddPromotionScreen";
import AdminEditPromotionScreen from "@/features/admin/screens/AdminPromotionsScreen/AdminEditPromotionScreen";
import AdminNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen";
import AdminAddNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminAddNotificationsScreen";
import AdminEditNotificationScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminEditNotificationScreen";
import AdminEditProduct from "@/features/admin/screens/AdminProductsScreen/AdminEditProduct";
import AdminCreateProduct from "@/features/admin/screens/AdminProductsScreen/AdminCreateProduct";
import DetailProduct from "../../features/menu/screens/DetailProduct";
import AdminCommentManagement from "../../features/admin/screens/AdminCommentScreen/AdminCommentManagement";
import AdminConversationsScreen from "../../features/admin/screens/AdminChatScreen/AdminConversationsScreen";
import AdminChatDetailScreen from "../../features/admin/screens/AdminChatScreen/AdminChatDetailScreen";
import AdminPaymentsScreen from "../../features/admin/screens/AdminPaymentsScreen/AdminPaymentsScreen";
import AdminAnalysisScreen from "../../features/admin/screens/AdminPaymentsScreen/AdminAnalysisScreen";
import AdminStaffScreen from "../../features/admin/screens/AdminStaffScreen/AdminStaffScreen";
import VietQrScreen from "../../features/vietQr/screen/vietQr";
import UploadImagePayment from "../../features/vietQr/screen/UploadImagePayment";
import PaymentSuccessful from "../../features/vietQr/screen/PaymentSuccessful";
import AiChatScreen from "../../features/AI/Screens/AiChatScreen";
import AdminSettingsScreen from "../../features/admin/screens/AdminSettingsScreen";
import AdminAddTables from "../../features/admin/screens/AdminTablesScreen/AdminAddTables";
import AdminEditTables from "../../features/admin/screens/AdminTablesScreen/AdminEditTables";

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminProducts: undefined;
  AdminCategories: undefined;
  AdminTablesScreen: undefined;
  AdminOrdersScreen: undefined;
  AdminUsersScreen: undefined;
  AdminPromotionsScreen: undefined;
  AdminAddPromotionScreen: undefined;
  AdminEditPromotionScreen: { promotionId: string };
  AdminNotificationsScreen: undefined;
  AdminAddNotificationsScreen: undefined;
  AdminEditNotificationScreen: { notificationId: string };
  AdminEditProduct: { productId: string };
  AdminCreateProduct: undefined;
  DetailProduct: { id: string };
  AdminConversations: undefined;
  AdminChatDetail: { conversationId: string; userName: string };
  AdminPaymentsScreen: undefined;
  AdminAnalysisScreen: undefined;
  AdminStaffScreen: undefined;
  VietQr: { packageId?: string, orderId?: string };
  UploadImagePayment: { packageId?: string, orderId?: string };
  PaymentSuccessful: undefined;
  AI: { product?: string, initialMessage?: string } | undefined;
  AdminComment: undefined;
  AdminSettings: undefined;
  AdminAddTables: undefined;
  AdminEditTables: { table: any };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} />
      <Stack.Screen name="AdminTablesScreen" component={AdminTablesScreen} />
      <Stack.Screen name="AdminOrdersScreen" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} />
      <Stack.Screen name="AdminPromotionsScreen" component={AdminPromotionsScreen} />
      <Stack.Screen name="AdminAddPromotionScreen" component={AdminAddPromotionScreen} />
      <Stack.Screen name="AdminEditPromotionScreen" component={AdminEditPromotionScreen} />
      <Stack.Screen name="AdminNotificationsScreen" component={AdminNotificationsScreen} />
      <Stack.Screen name="AdminAddNotificationsScreen" component={AdminAddNotificationsScreen} />
      <Stack.Screen name="AdminEditNotificationScreen" component={AdminEditNotificationScreen} />
      <Stack.Screen name="AdminCreateProduct" component={AdminCreateProduct} />
      <Stack.Screen name="AdminEditProduct" component={AdminEditProduct} />
      <Stack.Screen name="DetailProduct" component={DetailProduct} />
      <Stack.Screen name="AdminConversations" component={AdminConversationsScreen} />
      <Stack.Screen name="AdminChatDetail" component={AdminChatDetailScreen} />
      <Stack.Screen name="AdminPaymentsScreen" component={AdminPaymentsScreen} />
      <Stack.Screen name="AdminAnalysisScreen" component={AdminAnalysisScreen} />
      <Stack.Screen name="AdminStaffScreen" component={AdminStaffScreen} />
      <Stack.Screen name="VietQr" component={VietQrScreen} />
      <Stack.Screen name="UploadImagePayment" component={UploadImagePayment} />
      <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
      <Stack.Screen name="AI" component={AiChatScreen} />
      <Stack.Screen name="AdminComment" component={AdminCommentManagement} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminAddTables" component={AdminAddTables} />
      <Stack.Screen name="AdminEditTables" component={AdminEditTables} />
    </Stack.Navigator>
  );
}
