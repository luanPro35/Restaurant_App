import api from "./axios.instance";
import {
  AdminPromotion,
  AdminPagination,
} from "../../features/admin/types/admin.types";

export interface AdminPromotionResponse {
  data: AdminPromotion[];
  pagination: AdminPagination;
}

export interface AdminPromotionQuery {
  name?: string;
  page?: number;
  limit?: number;
}

export const promotionApi = {
  // GET: /admin/promotions
  getPromotions: async (
    query: AdminPromotionQuery,
  ): Promise<AdminPromotionResponse> => {
    const response = await api.get("/admin/promotions", { params: query });
    return response.data;
  },

  // GET: /admin/promotions/:id
  getPromotionById: async (id: string): Promise<AdminPromotion> => {
    const response = await api.get(`/admin/promotions/${id}`);
    return response.data;
  },

  // POST: /admin/promotions
  createPromotion: async (
    data: Omit<AdminPromotion, "id">,
  ): Promise<AdminPromotion> => {
    const response = await api.post("/admin/promotions", data);
    return response.data;
  },

  // PATCH: /admin/promotions/:id
  updatePromotion: async (
    id: string,
    data: Partial<AdminPromotion>,
  ): Promise<AdminPromotion> => {
    const response = await api.patch(`/admin/promotions/${id}`, data);
    return response.data;
  },

  // DELETE: /admin/promotions/:id
  deletePromotion: async (id: string): Promise<void> => {
    await api.delete(`/admin/promotions/${id}`);
  },
};

export default promotionApi;
