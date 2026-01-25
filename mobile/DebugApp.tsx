import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "./global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        console.log("App is ready, hiding splash screen...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Verify delay
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800">
        Debug App Working
      </Text>
      <Text className="mt-4 text-blue-500 font-semibold">
        NativeWind Active ✅
      </Text>
      <Text className="mt-2 text-gray-500">Next: Restore Main App</Text>
    </View>
  );
}
