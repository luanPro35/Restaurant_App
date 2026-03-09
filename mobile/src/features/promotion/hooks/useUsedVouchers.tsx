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
        const match = pkg.description?.match(/Voucher: ([^(\n]+)/);
        if (match && match[1]) {
          const code = match[1].trim();
          codes.push(code);
        }
      });

      setUsedCodes([...new Set(codes)]);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.log("Unable to fetch used vouchers:", error?.message);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUsedCodes();
    const listener = DeviceEventEmitter.addListener("checkoutSuccess", fetchUsedCodes);
    return () => listener.remove();
  }, [fetchUsedCodes]);

  return { usedCodes, loading, refresh: fetchUsedCodes };
};
