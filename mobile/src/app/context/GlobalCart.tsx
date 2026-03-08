import React from "react";
import { View, DeviceEventEmitter, Alert } from "react-native";
import { useCart } from "./CartContext";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthContext";
import Shopping_Cart from "../providers/Shopping_Cart";
import CartModal from "../../features/menu/components/CartModal";
import { useDelivery } from "./DeliveryContext";
import { packageApi } from "../../services/api/package-api";

export const GlobalCart: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, logout } = useAuth();
  const {
    cartItems,
    totalItems,
    isCartVisible,
    setIsCartVisible,
    updateQuantity,
    removeItem,
    clearCart,
    shouldHideFloatingCart,
    selectedVoucher,
    applyVoucher,
    removeVoucher,
    discountAmount,
    subtotal,
    totalPrice
  } = useCart();

  const { selectedAddress } = useDelivery();

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
  } catch (e) { }

  const isAdminScreen = currentRouteName?.startsWith("Admin");
  const isAuthScreen = ["Login", "Register", "Welcome", "Forgot"].includes(currentRouteName || "");

  if (isAdminScreen || isAuthScreen) return null;
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
        selectedVoucher={selectedVoucher}
        onApplyVoucher={applyVoucher}
        onRemoveVoucher={removeVoucher}
        discountAmount={discountAmount}
        subtotal={subtotal}
        totalPrice={totalPrice}
        onCheckout={async () => {
          if (!isAuthenticated) {
            Alert.alert(
              "Yêu cầu đăng nhập",
              "Bạn cần đăng nhập để thực hiện thanh toán.",
              [
                { text: "Bỏ qua", style: "cancel" },
                {
                  text: "Đăng nhập",
                  onPress: () => {
                    setIsCartVisible(false);
                    navigation.navigate("Profile");
                  }
                }
              ]
            );
            return;
          }
          if (cartItems.length === 0) return;
          if (!selectedAddress) {
            Alert.alert("Lỗi", "Vui lòng chọn hoặc thêm địa chỉ giao hàng trước khi đặt món.");
            return;
          }

          try {
            const orderDescription = cartItems
              .map((item) => `${item.quantity}x ${item.name}`)
              .join("\n") + (selectedVoucher ? `\n\nVoucher: ${selectedVoucher.code} (${selectedVoucher.name}) (-${discountAmount}đ)` : "");

            const newOrder = {
              name: selectedAddress.name,
              address: selectedAddress.address,
              description: orderDescription,
              price: totalPrice,
              status: "PENDING" as const
            };

            await packageApi.create(newOrder);

            setIsCartVisible(false);
            clearCart();
            Alert.alert("Thành công", "Đơn hàng của bạn đã được gửi đi!");
            DeviceEventEmitter.emit("checkoutSuccess");
            navigation.navigate("Package" as any);
          } catch (error: any) {
            console.error("Lỗi khi thanh toán:", error);
            if (error.response?.status === 401) {
                Alert.alert("Phiên hết hạn", "Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại.");
                logout();
                setIsCartVisible(false);
            } else {
                Alert.alert("Thất bại", "Không thể tạo đơn hàng, vui lòng thử lại!");
            }
          }
        }}
      />
    </>
  );
};
