import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../features/home/screens/HomeScreen";
import AtRestaurantScreen from "../../features/at_restaurant/screens/AtRestaurantScreen";

export type MainStackParamList = {
  Home: undefined;
  AtRestaurant: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AtRestaurant" component={AtRestaurantScreen} />
    </Stack.Navigator>
  );
}
