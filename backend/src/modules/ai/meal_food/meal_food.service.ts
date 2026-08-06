import { Injectable, BadRequestException } from "@nestjs/common";
import { MealFoodRepository } from "./meal_food.repository";

@Injectable()
export class MealFoodService {
  constructor(private readonly mealFoodRepository: MealFoodRepository) {}

  private calculateBmi(heightCm: number, weightKg: number) {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      return null;
    }
    const heightM = heightCm / 100;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

    let bmiStatus = "Bình thường";
    let suggestedMealCalories = 600;

    if (bmi < 18.5) {
      bmiStatus = "Gầy / Cần tăng cân";
      suggestedMealCalories = 750;
    } else if (bmi >= 18.5 && bmi < 23) {
      bmiStatus = "Cân đối / Bình thường";
      suggestedMealCalories = 650;
    } else if (bmi >= 23 && bmi < 25) {
      bmiStatus = "Thừa cân nhẹ";
      suggestedMealCalories = 550;
    } else {
      bmiStatus = "Béo phì / Cần giảm cân";
      suggestedMealCalories = 450;
    }

    return {
      bmi,
      bmiStatus,
      suggestedMealCalories,
    };
  }

  async getMealRecommendations(params: {
    userId?: string;
    height?: number;
    weight?: number;
    budget?: number;
    mealType?: string;
    keyword?: string;
    calorieGoal?: number;
  }) {
    const { userId, height, weight, budget, mealType, keyword, calorieGoal } = params;

    let healthMetrics: any = null;
    if (height && weight) {
      healthMetrics = this.calculateBmi(height, weight);
    }

    let products: any[] = [];

    if (keyword && keyword.trim().length > 0) {
      const keywordsArray = keyword
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 1);
      products = await this.mealFoodRepository.findProductsByKeywords(keywordsArray);
    }

    if (products.length === 0 && budget && budget > 0) {
      products = await this.mealFoodRepository.findProductsByMaxPrice(budget);
    }

    if (products.length === 0) {
      const categories = await this.mealFoodRepository.getAllCategories();
      for (const cat of categories) {
        if (cat.products && cat.products.length > 0) {
          products.push(...cat.products);
        }
      }
    }

    if (budget && budget > 0) {
      products = products.filter((p) => p.price <= budget);
    }

    if (mealType) {
      const typeLower = mealType.toLowerCase();
      const filtered = products.filter((p) => {
        const nameLower = p.name.toLowerCase();
        const descLower = (p.description || "").toLowerCase();
        return nameLower.includes(typeLower) || descLower.includes(typeLower);
      });
      if (filtered.length > 0) {
        products = filtered;
      }
    }

    products = products.slice(0, 10);

    let advice = "Dưới đây là các món ăn phù hợp được gợi ý dành cho bạn:";
    if (healthMetrics) {
      advice = `Chỉ số BMI của bạn là ${healthMetrics.bmi} (${healthMetrics.bmiStatus}). Khẩu phần ăn khuyến nghị khoảng ${calorieGoal || healthMetrics.suggestedMealCalories} kcal/bữa. Gợi ý các món ăn phù hợp:`;
    }

    const responseResult = {
      success: true,
      healthMetrics,
      advice,
      products,
    };

    await this.mealFoodRepository.saveRecommendation({
      userId: userId || undefined,
      height,
      weight,
      bmi: healthMetrics?.bmi,
      bmiStatus: healthMetrics?.bmiStatus,
      suggestedCalories: calorieGoal || healthMetrics?.suggestedMealCalories,
      budget,
      mealType: mealType || undefined,
      keyword,
      recommendedData: products,
    });

    return responseResult;
  }
}