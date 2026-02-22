import { z } from "zod";

export default {
  getPromotions: {
    query: z.object({
      name: z.string().optional(),
      limit: z.string().optional().transform(Number),
      page: z.string().optional().transform(Number),
    }),
  },
  createPromotion: {
    body: z.object({
      name: z.string().min(2, "Tên khuyến mãi quá ngắn"),
      discount: z.number().min(0).max(100, "Giảm giá không được quá 100%"),
      until: z.string().min(1, "Vui lòng chọn ngày hết hạn"),
      isActive: z.boolean(),
      description: z.string().optional(),
    }),
  },
  updatePromotion: {
    body: z.object({
      id: z.string(),
      name: z.string().min(2, "Tên khuyến mãi quá ngắn").optional(),
      discount: z.number().min(0).max(100).optional(),
      until: z.string().optional(),
      isActive: z.boolean().optional(),
      description: z.string().optional(),
    }),
  },
  deletePromotion: {
    body: z.object({
      id: z.string(),
    }),
  },
};
