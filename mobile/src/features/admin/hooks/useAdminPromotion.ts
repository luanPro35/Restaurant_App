import { useState, useEffect, useCallback } from "react";
import promotionApi from "../../../services/api/api-promotion";
import { Alert } from "react-native";
import { AdminPagination } from "../types/admin.types";
import {
  AdminPromotionQuery,
  AdminPromotionResponse,
} from "../../../services/api/api-promotion";
import { AdminPromotion } from "../types/admin.types";

export const useAdminPromotion = () => {
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<AdminPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchPromotions = useCallback(async (query?: AdminPromotionQuery) => {
    setLoading(true);
    try {
      const response: AdminPromotionResponse = await promotionApi.getPromotions(
        query as any,
      );
      setPromotions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching admin promotions:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPromotions({ page: 1 });
    setRefreshing(false);
  };

  const getPromotions = async () => {
    setLoading(true);
    try {
      const response: AdminPromotionResponse = await promotionApi.getPromotions(
        {},
      );
      setPromotions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching admin promotions:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const getPromotionById = async (id: string) => {
    setLoading(true);
    try {
      const response: AdminPromotion = await promotionApi.getPromotionById(id);
      setPromotions((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error fetching admin promotion:", error);
      Alert.alert("Lỗi", "Không thể tải khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const togglePromotionStatus = async (id: string, isActive: boolean) => {
    try {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive } : p)),
      );
      await promotionApi.updatePromotion(id, { isActive });
    } catch (error) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: !isActive } : p)),
      );
      console.error("Error toggling promotion status:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái khuyến mãi");
    }
  };

  const deletePromotion = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa khuyến mãi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await promotionApi.deletePromotion(id);
            setPromotions((prev) => prev.filter((p) => p.id !== id));
            Alert.alert("Thành công", "Đã xóa khuyến mãi");
          } catch (error) {
            console.error("Error deleting promotion:", error);
            Alert.alert("Lỗi", "Không thể xóa khuyến mãi");
          }
        },
      },
    ]);
  };

  const createPromotion = async (promotion: Omit<AdminPromotion, "id">) => {
    try {
      const response = await promotionApi.createPromotion(promotion);
      setPromotions((prev) => [...prev, response]);
      Alert.alert("Thành công", "Đã tạo khuyến mãi");
    } catch (error) {
      console.error("Error creating promotion:", error);
      Alert.alert("Lỗi", "Không thể tạo khuyến mãi");
    }
  };

  const updatePromotion = async (
    id: string,
    promotion: Partial<AdminPromotion>,
  ) => {
    try {
      const response = await promotionApi.updatePromotion(id, promotion);
      setPromotions((prev) => prev.map((p) => (p.id === id ? response : p)));
      Alert.alert("Thành công", "Đã cập nhật khuyến mãi");
    } catch (error) {
      console.error("Error updating promotion:", error);
      Alert.alert("Lỗi", "Không thể cập nhật khuyến mãi");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return {
    promotions,
    loading,
    refreshing,
    pagination,
    fetchPromotions,
    handleRefresh,
    togglePromotionStatus,
    deletePromotion,
    createPromotion,
    updatePromotion,
    getPromotionById,
    getPromotions,
  };
};
