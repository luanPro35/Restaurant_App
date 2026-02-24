import { promotionApi } from "../../../services/api/api-promotion";
import { Promotion, PromotionQuery } from "../types/promotion.types";

const promotionService = {
  fetchPromotions: async (query: PromotionQuery = {}) => {
    return await promotionApi.getPromotions(query);
  },

  getPromotionById: async (id: string) => {
    return await promotionApi.getPromotionById(id);
  },

  createPromotion: async (promotion: Omit<Promotion, "id">) => {
    return await promotionApi.createPromotion(promotion);
  },

  updatePromotion: async (
    promotionId: string,
    promotion: Partial<Promotion>,
  ) => {
    return await promotionApi.updatePromotion(promotionId, promotion);
  },

  deletePromotion: async (promotionId: string) => {
    return await promotionApi.deletePromotion(promotionId);
  },
};

export default promotionService;
