import React from "react";
import { View, DeviceEventEmitter, Alert } from "react-native";
import { useCart } from "./CartContext";
import { useNavigationState } from "@react-navigation/native";
import Shopping_Cart from "../providers/Shopping_Cart";
import CartModal from "../../features/menu/components/CartModal";

export const GlobalCart: React.FC = () => {
  const {
    cartItems,
    totalItems,
    isCartVisible,
    setIsCartVisible,
    updateQuantity,
    removeItem,
    clearCart,
    shouldHideFloatingCart,
  } = useCart();

  let currentRouteName: string | null = null;
  try {
    currentRouteName = useNavigationState((state) => {
      if (!state) return null;
      let route = state.routes[state.index] as any;
      while (route.state && route.state.index !== undefined) {
        route = route.state.routes[route.state.index];
      }
      return route.name as string;
    });
  } catch (e) {}

  const isAdminScreen = currentRouteName?.startsWith("Admin");

  if (isAdminScreen) return null;
  if (cartItems.length === 0 && !isCartVisible) return null;

  return (
    <>
      {!shouldHideFloatingCart && (
        <View
          className="absolute bottom-5 right-5 z-[1000]"
          pointerEvents="box-none"
        >
          <Shopping_Cart
            itemCount={totalItems}
            onPress={() => setIsCartVisible(true)}
          />
        </View>
      )}

      <CartModal
        visible={isCartVisible}
        items={cartItems}
        onClose={() => setIsCartVisible(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={() => {
          setIsCartVisible(false);
          clearCart();
          Alert.alert("Thành công", "Đơn hàng của bạn đã được gửi đi!");
          DeviceEventEmitter.emit("checkoutSuccess");
        }}
      />
    </>
  );
};
