import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class MealFoodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        products: {
          take: 5,
        },
      },
    });
  }

  async findProductsByKeywords(keywords: string[]) {
    if (!keywords || keywords.length === 0) return [];

    return this.prisma.product.findMany({
      where: {
        OR: keywords.map((kw) => ({
          name: {
            contains: kw,
          },
        })),
      },
      take: 20,
    });
  }

  async findProductsByMaxPrice(maxPrice: number) {
    return this.prisma.product.findMany({
      where: {
        price: {
          lte: maxPrice,
        },
      },
      take: 20,
    });
  }

  async saveRecommendation(data: {
    userId?: string;
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

  async getRecentRecommendations(userId: string, limit: number = 5) {
    return this.prisma.mealRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
