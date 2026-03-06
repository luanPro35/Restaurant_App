import { useState, useCallback } from "react";
import { menuService } from "../services/menuService";

export const useMenu = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<{
    search: string;
    category: string;
    sortOrder: string;
    minPrice?: number;
    maxPrice?: number;
    unit: string;
    isAvailable: string;
    isBestSeller: string;
    limit: number;
  }>({
    search: "",
    category: "",
    sortOrder: "asc",
    minPrice: undefined,
    maxPrice: undefined,
    unit: "",
    isAvailable: "",
    isBestSeller: "",
    limit: 1000,
  });

  const fetchMenu = useCallback(
    async (currentFilter?: any) => {
      try {
        setLoading(true);
        setError(null);
        const response = await menuService.fetchMenu(currentFilter || filter);

        setMenu(response.data || response || []);
        setTotal(response.total || response?.length || 0);
        const actualMenu = response.data || response || [];
        setHasMore(actualMenu.length < (response.total || 0));
      } catch (err) {
        setError(err as any);
        console.error("Fetch menu error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  return {
    menu,
    loading,
    error,
    total,
    hasMore,
    filter,
    setMenu,
    setLoading,
    setError,
    setTotal,
    setHasMore,
    setFilter,
    fetchMenu,
  };
};
