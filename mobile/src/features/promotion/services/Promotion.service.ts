import { promotionApi } from "../../../services/api/api-promotion";
import { PromotionQuery } from "../types/promotion.types";

const promotionService = {
  fetchPromotions: async (query: PromotionQuery = {}) => {
    return await promotionApi.getPromotions(query);
  },

  getPromotionById: async (id: string) => {
    return await promotionApi.getPromotionById(id);
  },
};

export default promotionService;
