import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Address } from "../../services/api/api-address";
import { deliveryAddressService } from "../../features/delivery/services/Address.service";
import { useAuth } from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tokenManager from "../../services/api/token.manager";

type DeliveryContextType = {
  selectedAddress: Address | null;
  selectAddress: (address: Address | null) => void;
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
};

const DeliveryContext = createContext<DeliveryContextType | undefined>(
  undefined,
);

const SELECTED_ADDRESS_KEY = "selected_delivery_address";

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedAddress, setSelectedAddressState] = useState<Address | null>(
    null,
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const saved = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
        if (saved) {
          setSelectedAddressState(JSON.parse(saved));
        }
      } catch (error) {}
    };
    loadSavedAddress();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchAddresses();
    } else if (!isAuthenticated && !authLoading) {
      setAddresses([]);
      setSelectedAddressState(null);
    }
  }, [isAuthenticated, authLoading]);

  const selectAddress = async (address: Address | null) => {
    setSelectedAddressState(address);
    try {
      if (address) {
        await AsyncStorage.setItem(
          SELECTED_ADDRESS_KEY,
          JSON.stringify(address),
        );
      } else {
        await AsyncStorage.removeItem(SELECTED_ADDRESS_KEY);
      }
    } catch (error) {}
  };

  const fetchAddresses = async () => {
    if (loading) return;

    const token = tokenManager.getToken();
    if (!token) return;

    setLoading(true);
    try {
      const data = await deliveryAddressService.getSavedAddresses();
      setAddresses(data);

      if (!selectedAddress && data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        selectAddress(defaultAddr);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{
        selectedAddress,
        selectAddress,
        addresses,
        loading,
        fetchAddresses,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error("useDelivery must be used within a DeliveryProvider");
  }
  return context;
};
