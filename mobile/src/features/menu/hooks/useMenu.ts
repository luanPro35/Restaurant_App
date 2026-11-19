import { useState, useCallback, useRef } from "react";
import { menuService } from "../services/menuService";

const PAGE_SIZE = 40;

export const useMenu = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  const requestVersion = useRef(0);
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
    limit: PAGE_SIZE,
  });

  const fetchMenu = useCallback(
    async (currentFilter?: any) => {
      const requestId = ++requestVersion.current;
      loadingMoreRef.current = false;
      setLoadingMore(false);
      try {
        setLoading(true);
        setError(null);
        const response = await menuService.fetchMenu({
          ...(currentFilter || filter),
          page: 1,
          limit: PAGE_SIZE,
        });
        if (requestId !== requestVersion.current) return;

        const actualMenu = response.data || response || [];
        const resultTotal = Number(response.total) || actualMenu.length;
        setMenu(actualMenu);
        setTotal(resultTotal);
        setPage(1);
        setHasMore(actualMenu.length < resultTotal);
      } catch (err) {
        if (requestId !== requestVersion.current) return;
        setError(err as any);
        console.error("Fetch menu error:", err);
      } finally {
        if (requestId === requestVersion.current) setLoading(false);
      }
    },
    [filter],
  );

  const fetchMoreMenu = useCallback(async () => {
    if (!hasMore || loading || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const requestId = requestVersion.current;
    const nextPage = page + 1;
    try {
      const response = await menuService.fetchMenu({
        ...filter,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      if (requestId !== requestVersion.current) return;
      const nextItems = response.data || response || [];
      setMenu((current) => [...current, ...nextItems]);
      setPage(nextPage);
      setHasMore(nextPage * PAGE_SIZE < (Number(response.total) || 0));
    } catch (err) {
      if (requestId !== requestVersion.current) return;
      setError(err as any);
      console.error("Fetch more menu error:", err);
    } finally {
      if (requestId === requestVersion.current) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [filter, hasMore, loading, page]);

  return {
    menu,
    loading,
    error,
    total,
    hasMore,
    loadingMore,
    filter,
    setMenu,
    setLoading,
    setError,
    setTotal,
    setHasMore,
    setFilter,
    fetchMenu,
    fetchMoreMenu,
  };
};
