import React, { useState, useEffect } from "react";
import { View, DeviceEventEmitter, Alert, Linking } from "react-native";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import Shopping_Cart from "../providers/Shopping_Cart";
import CartModal from "../../features/menu/components/CartModal";
import { useDelivery } from "./DeliveryContext";
import { packageApi } from "../../services/api/package-api";
import { paymentApi } from "../../services/api/api-payment";

interface GlobalCartProps {
  navigationRef: any;
}

export const GlobalCart: React.FC<GlobalCartProps> = ({ navigationRef }) => {
  const { isAuthenticated, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

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

  useEffect(() => {
    const updateRoute = () => {
      try {
        if (navigationRef.isReady()) {
          const rootState = navigationRef.getRootState();
          if (rootState) {
            let route = rootState.routes[rootState.index];
            while (route && route.state && route.state.index !== undefined) {
              route = (route.state.routes as any)[(route.state.index as any)];
            }
            if (route && route.name !== currentRoute) {
              setCurrentRoute(route.name);
            }
          }
        }
      } catch (e) {
      }
    };

    const interval = setInterval(updateRoute, 500); 
    const unsubscribe = navigationRef.addListener('state', updateRoute);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigationRef, currentRoute]);

  const isAdminScreen = currentRoute?.startsWith("Admin");
  const isAuthScreen = ["Login", "Register", "Welcome", "Forgot"].includes(currentRoute || "");

  if (isAdminScreen || isAuthScreen) return null;
  if (cartItems.length === 0 && !isCartVisible) return null;

  return (
    <>
      {!shouldHideFloatingCart && (
        <View
          style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}
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
        onCheckout={async (paymentMethod: string) => {
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
                    if (navigationRef.isReady()) navigationRef.navigate("Profile");
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
              paymentMethod: paymentMethod,
              status: "PENDING" as const
            };

            const createdPkg = await packageApi.create(newOrder);



            setIsCartVisible(false);
            clearCart();

            if (paymentMethod === "VietQR") {
              if (navigationRef.isReady()) {
                navigationRef.navigate("VietQr", { packageId: createdPkg.id });
              }
            } else {
              Alert.alert("Thành công", "Đơn hàng của bạn đã được gửi đi!");
              DeviceEventEmitter.emit("checkoutSuccess");
              if (navigationRef.isReady()) navigationRef.navigate("Package");
            }
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
