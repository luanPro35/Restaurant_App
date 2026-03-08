import { useState, useEffect, useCallback } from "react";
import { DeviceEventEmitter } from "react-native";
import packageApi from "../../../services/api/package-api";
import { useAuth } from "../../../app/context/AuthContext";

export const useUsedVouchers = () => {
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchUsedCodes = useCallback(async () => {
    if (!isAuthenticated) {
      setUsedCodes([]);
      return;
    }
    
    setLoading(true);
    try {
      const packages = await packageApi.findAll();
      const codes: string[] = [];
      
      packages.forEach((pkg) => {
        console.log("Checking package desc:", pkg.description);
        const match = pkg.description?.match(/Voucher: ([^(\n]+)/);
        if (match && match[1]) {
          const code = match[1].trim();
          console.log("Found used voucher code:", code);
          codes.push(code);
        }
      });
      
      setUsedCodes([...new Set(codes)]);
    } catch (error) {
      console.error("Error fetching used vouchers:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUsedCodes();
    
    // Refresh when a checkout is successful
    const listener = DeviceEventEmitter.addListener("checkoutSuccess", fetchUsedCodes);
    return () => listener.remove();
  }, [fetchUsedCodes]);

  return { usedCodes, loading, refresh: fetchUsedCodes };
};
