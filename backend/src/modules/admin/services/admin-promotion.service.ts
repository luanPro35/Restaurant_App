import { Injectable, NotFoundException } from "@nestjs/common";
import { AdminPromotionRepository } from "../repositories/admin-promotion.repository";
import {
  GetPromotionsDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  DeletePromotionDto,
} from "../dtos/admin-promotion.dto";
import { ADMIN_PROMOTION_MESSAGES } from "../constants/admin-promotion.constant";

@Injectable()
export class AdminPromotionService {
  constructor(private readonly repository: AdminPromotionRepository) {}

  async getPromotions(query: GetPromotionsDto) {
    const data = await this.repository.getPromotions(query);
    const total = await this.repository.countPromotions(query);

    return {
      data,
      pagination: {
        total,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  async findById(id: string) {
    const promotion = await this.repository.findById(id);
    if (!promotion) {
      throw new NotFoundException(ADMIN_PROMOTION_MESSAGES.NOT_FOUND);
    }
    return promotion;
  }

  async createPromotion(data: CreatePromotionDto) {
    return this.repository.createPromotion(data);
  }

  async updatePromotion(data: UpdatePromotionDto) {
    await this.findById(data.id);
    return this.repository.updatePromotion(data);
  }

  async deletePromotion(data: DeletePromotionDto) {
    await this.findById(data.id);
    return this.repository.deletePromotion(data);
  }
}
