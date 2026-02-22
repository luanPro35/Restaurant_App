import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  GetPromotionsDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  DeletePromotionDto,
} from "../dtos/admin-promotion.dto";

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(query: GetPromotionsDto) {
    const { name } = query;
    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }
    return where;
  }

  async findById(id: string) {
    return this.prisma.promotion.findUnique({
      where: { id },
    });
  }

  async getPromotions(query: GetPromotionsDto) {
    const { limit = 10, page = 1 } = query;
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(query);
    return this.prisma.promotion.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async createPromotion(data: CreatePromotionDto) {
    const { name, discount, until, isActive, description } = data;
    return this.prisma.promotion.create({
      data: {
        name,
        discount,
        isActive,
        description,
        until: new Date(until),
      },
    });
  }

  async updatePromotion(data: UpdatePromotionDto) {
    const { id, until, description, ...rest } = data;
    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...rest,
        description,
        ...(until ? { until: new Date(until) } : {}),
      },
    });
  }

  async deletePromotion(data: DeletePromotionDto) {
    return this.prisma.promotion.delete({
      where: { id: data.id },
    });
  }

  async countPromotions(query: GetPromotionsDto) {
    const where = this.buildWhereClause(query);
    return this.prisma.promotion.count({ where });
  }
}
