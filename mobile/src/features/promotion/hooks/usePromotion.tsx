import { useState, useEffect, useCallback } from "react";
import promotionService from "../services/Promotion.service";
import { Promotion, PromotionQuery } from "../types/promotion.types";

export const usePromotion = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchPromotions = useCallback(async (query: PromotionQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promotionService.fetchPromotions(query);
      setPromotions(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPromotionById = async (id: string) => {
    try {
      return await promotionService.getPromotionById(id);
    } catch (err: any) {
      throw new Error(err.message || "Không thể tải thông tin khuyến mãi");
    }
  };

  useEffect(() => {
    fetchPromotions({ page: 1, limit: 10 });
  }, [fetchPromotions]);

  return {
    promotions,
    loading,
    error,
    pagination,
    fetchPromotions,
    getPromotionById,
  };
};
