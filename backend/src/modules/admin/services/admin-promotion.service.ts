import { Injectable, NotFoundException } from "@nestjs/common";
import { AdminRepository } from "../repositories/admin-repository";
import {
  GetPromotionsDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  DeletePromotionDto,
} from "../dtos/admin-promotion.dto";
import { ADMIN_PROMOTION_MESSAGES } from "../constants/admin-promotion.constant";

@Injectable()
export class AdminPromotionService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getPromotions(query: GetPromotionsDto) {
    const data = await this.adminRepository.getPromotions(query);
    const total = await this.adminRepository.countPromotions(query);

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
    const promotion = await this.adminRepository.findById(id);
    if (!promotion) {
      throw new NotFoundException(ADMIN_PROMOTION_MESSAGES.NOT_FOUND);
    }
    return promotion;
  }

  async createPromotion(data: CreatePromotionDto) {
    return this.adminRepository.createPromotion(data);
  }

  async updatePromotion(data: UpdatePromotionDto) {
    await this.findById(data.id);
    return this.adminRepository.updatePromotion(data);
  }

  async deletePromotion(data: DeletePromotionDto) {
    await this.findById(data.id);
    return this.adminRepository.deletePromotion(data);
  }
}
