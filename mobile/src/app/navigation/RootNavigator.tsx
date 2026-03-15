import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import AdminNavigator from "./AdminNavigator";
import CustomerNavigator from "./CustomerNavigator";
import StaffNavigator from "./StaffNavigator";
import { useAuth } from "../context/AuthContext";

export type RootStackParamList = {
  Auth: undefined;
  Admin: undefined;
  Customer: undefined;
  Staff: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.role === "ADMIN" ? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : user?.role === "STAFF" ? (
        <Stack.Screen name="Staff" component={StaffNavigator} />
      ) : (
        <Stack.Screen name="Customer" component={CustomerNavigator} />
      )}
    </Stack.Navigator>
  );
}
