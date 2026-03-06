import React, { createContext, useContext, useState, useMemo } from "react";
import { MenuItem, CartItem } from "../../../features/menu/types";

interface RestaurantCartContextType {
  restaurantCartItems: CartItem[];
  addToRestaurantCart: (item: any) => void;
  updateRestaurantQuantity: (id: string, quantity: number) => void;
  removeRestaurantItem: (id: string) => void;
  clearRestaurantCart: () => void;
  totalRestaurantItems: number;
  totalRestaurantPrice: number;
}

const RestaurantCartContext = createContext<RestaurantCartContextType | undefined>(undefined);

export const RestaurantCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [restaurantCartItems, setRestaurantCartItems] = useState<CartItem[]>([]);

  const addToRestaurantCart = (item: any) => {
    setRestaurantCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const updateRestaurantQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeRestaurantItem(id);
      return;
    }
    setRestaurantCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeRestaurantItem = (id: string) => {
    setRestaurantCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearRestaurantCart = () => {
    setRestaurantCartItems([]);
  };

  const totalRestaurantItems = useMemo(
    () => restaurantCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [restaurantCartItems],
  );

  const totalRestaurantPrice = useMemo(
    () => restaurantCartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [restaurantCartItems],
  );

  const value = {
    restaurantCartItems,
    addToRestaurantCart,
    updateRestaurantQuantity,
    removeRestaurantItem,
    clearRestaurantCart,
    totalRestaurantItems,
    totalRestaurantPrice,
  };

  return (
    <RestaurantCartContext.Provider value={value}>
      {children}
    </RestaurantCartContext.Provider>
  );
};

export const useRestaurantCart = () => {
  const context = useContext(RestaurantCartContext);
  if (context === undefined) {
    throw new Error("useRestaurantCart must be used within a RestaurantCartProvider");
  }
  return context;
};
