import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "../features/auth/screens/WelcomeScreen";
import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";
import HomeScreen from "../features/home/screens/Home/HomeScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register">(
    "login",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen("login");
  };

  const renderScreen = () => {
    if (currentScreen === "login") {
      return (
        <LoginScreen
          onRegisterPress={() => setCurrentScreen("register")}
          onLoginPress={handleLogin}
        />
      );
    } else {
      return <RegisterScreen onLoginPress={() => setCurrentScreen("login")} />;
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <StatusBar style="auto" />
        <HomeScreen onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <WelcomeScreen>{renderScreen()}</WelcomeScreen>
    </>
  );
}
