import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../../features/auth/screens/WelcomeScreen";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import RegisterScreen from "../../features/auth/screens/RegisterScreen";
import ForgotScreen from "../../features/auth/screens/ForgotScreen";

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Forgot: undefined;
  QRScanner: undefined;
  AtRestaurant: { 
    scannedTableId?: number; 
    scannedTableName?: string; 
    initialTab?: "tables" | "order" | "menu" 
  } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

import QRScannerScreen from "../../features/at_restaurant/screens/QRScannerScreen";
import AtRestaurant from "../../features/at_restaurant/screens/AtRestaurant";

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Forgot" component={ForgotScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="AtRestaurant" component={AtRestaurant} />
    </Stack.Navigator>
  );
}
