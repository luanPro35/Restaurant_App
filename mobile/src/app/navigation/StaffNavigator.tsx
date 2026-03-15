import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StaffHomeScreen from "../../features/staff/screens/StaffHomeScreen";
import AdminOrdersScreen from "../../features/admin/screens/AdminOrdersScreen";
import AdminTablesScreen from "../../features/admin/screens/AdminTablesScreen";
import AdminEditTables from "../../features/admin/screens/AdminTablesScreen/AdminEditTables";
import AdminAddTables from "../../features/admin/screens/AdminTablesScreen/AdminAddTables";
import AdminNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen";
import AdminAddNotificationsScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminAddNotificationsScreen";
import AdminEditNotificationScreen from "@/features/admin/screens/AdminNotificationsScreen/AdminEditNotificationScreen";
import { AdminTable } from "../../features/admin/types/admin.types";

export type StaffStackParamList = {
  StaffHome: undefined;
  AdminOrdersScreen: undefined;
  AdminTablesScreen: undefined;
  AdminEditTables: { table: AdminTable };
  AdminAddTables: undefined;
  AdminNotificationsScreen: undefined;
  AdminAddNotificationsScreen: undefined;
  AdminEditNotificationScreen: { notificationId: string };
};

const Stack = createNativeStackNavigator<StaffStackParamList>();

export default function StaffNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StaffHome" component={StaffHomeScreen} />
      <Stack.Screen name="AdminOrdersScreen" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminTablesScreen" component={AdminTablesScreen} />
      <Stack.Screen name="AdminEditTables" component={AdminEditTables} />
      <Stack.Screen name="AdminAddTables" component={AdminAddTables} />
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
    </Stack.Navigator>
  );
}
