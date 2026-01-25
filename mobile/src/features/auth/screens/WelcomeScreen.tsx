import React, { useEffect, useRef, useState } from "react";
import { View, Image, Animated, Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

interface WelcomeProps {
  children: React.ReactNode;
}

export default function WelcomeScreen({ children }: WelcomeProps) {
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Note: Adjust the import path for the logo if necessary,
  // since this file moved deeper into the directory structure.
  // Previous: ../../assets/Logo.png (from src/screens)
  // New: ../../../../assets/Logo.png (from src/features/auth/screens)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animation sequence
      Animated.parallel([
        Animated.timing(logoTranslateY, {
          toValue: -height * 0.3, // Move up by 30% of screen height
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500); // Wait 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#F9F6E7] items-center justify-center">
      {/* Animated Logo */}
      <Animated.View
        className="absolute items-center justify-center"
        style={{
          transform: [{ translateY: logoTranslateY }, { translateX: 5 }],
        }}
      >
        <Image
          source={require("../../../../assets/Logo.png")}
          className="w-[150px] h-[150px]"
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content (Login/Register Forms) */}
      <Animated.View
        className="w-full items-center"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </Animated.View>
    </View>
  );
}
