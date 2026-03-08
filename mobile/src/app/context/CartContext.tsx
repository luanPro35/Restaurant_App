import React, { createContext, useContext, useState, useMemo } from "react";
import { MenuItem, CartItem } from "../../features/menu/types";
import { Promotion as Voucher } from "../../features/promotion/types/promotion.types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalPrice: number;
  isCartVisible: boolean;
  setIsCartVisible: (visible: boolean) => void;
  shouldHideFloatingCart: boolean;
  setShouldHideFloatingCart: (hide: boolean) => void;
  selectedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher) => void;
  removeVoucher: () => void;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [shouldHideFloatingCart, setShouldHideFloatingCart] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const applyVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const removeVoucher = () => {
    setSelectedVoucher(null);
  };

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedVoucher(null);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const discountAmount = useMemo(() => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.discount > 100) {
      return selectedVoucher.discount;
    } else {
      return subtotal * (selectedVoucher.discount / 100);
    }
  }, [subtotal, selectedVoucher]);

  const totalPrice = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount],
  );

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
    totalPrice,
    isCartVisible,
    setIsCartVisible,
    shouldHideFloatingCart,
    setShouldHideFloatingCart,
    selectedVoucher,
    applyVoucher,
    removeVoucher,
    discountAmount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
