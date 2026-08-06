import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class MealFoodRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Truy vấn danh sách món ăn từ Database theo các tiêu chí lọc
   */
  async findProducts(filter: { keyword?: string; budget?: number; limit?: number }) {
    const { keyword, budget, limit = 5 } = filter;

    const whereCondition: any = {
      isAvailable: true,
    };

    if (keyword && keyword.trim() !== "") {
      whereCondition.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    if (budget && budget > 0) {
      whereCondition.price = {
        lte: budget,
      };
    }

    return this.prisma.product.findMany({
      where: whereCondition,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        price: "asc",
      },
    });
  }

  async saveRecommendation(data: {
    userId?: string | null;
    height?: number;
    weight?: number;
    bmi?: number;
    bmiStatus?: string;
    suggestedCalories?: number;
    budget?: number;
    mealType?: string;
    keyword?: string;
    recommendedData?: any;
  }) {
    try {
      return await this.prisma.mealRecommendation.create({
        data: {
          userId: data.userId || null,
          height: data.height || null,
          weight: data.weight || null,
          bmi: data.bmi || null,
          bmiStatus: data.bmiStatus || null,
          suggestedCalories: data.suggestedCalories || null,
          budget: data.budget || null,
          mealType: data.mealType || null,
          keyword: data.keyword || null,
          recommendedData: data.recommendedData ? JSON.parse(JSON.stringify(data.recommendedData)) : null,
        } as any,
      });
    } catch (error) {
      return await this.prisma.aiInteraction.create({
        data: {
          userId: data.userId || null,
          query: `Search: ${data.keyword || ''}, Height: ${data.height}, Weight: ${data.weight}`,
          response: `BMI: ${data.bmi} (${data.bmiStatus})`,
          type: "MEAL_FOOD_RECOMMENDATION",
          products: data.recommendedData ? JSON.parse(JSON.stringify(data.recommendedData)) : null,
        },
      });
    }
  }
}
