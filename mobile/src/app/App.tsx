import React from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { DeliveryProvider } from "./context/DeliveryContext";
import { GlobalCart } from "./context/GlobalCart";
import { RestaurantCartProvider } from "../features/at_restaurant/context/RestaurantCartContext";

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const navigationRef = useNavigationContainerRef();

  React.useEffect(() => {
    // Small delay to ensure everything is mounted
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DeliveryProvider>
          <CartProvider>
            <RestaurantCartProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={() => console.log("Navigation ready")}
              >
                <StatusBar style="auto" />
                <RootNavigator />
                <GlobalCart navigationRef={navigationRef} />
              </NavigationContainer>
            </RestaurantCartProvider>
          </CartProvider>
        </DeliveryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
