import { useState } from "react";
import mealFoodApi from "../../../services/api/api-meal-food";
import { MealFoodSearchParams } from "../../../services/api/api-ai";

export interface HealthMetrics {
  bmi: number;
  bmiStatus: string;
  bmr: number;
  recommendedDailyCalories: number;
  suggestedMealCalories: number;
}

export interface MealFoodResult {
  healthMetrics: HealthMetrics | null;
  aiAdvice: string | null;
  targetCalorieGoal: number | null;
  maxBudget: number | null;
  recommendedProducts: any[];
  usdaNutritionData: any[];
}

export const useMealFood = () => {
  const [result, setResult] = useState<MealFoodResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMealFood = async (params: MealFoodSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await mealFoodApi.search(params);
      setResult(data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Không thể lấy gợi ý món ăn";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    recommendations: result?.recommendedProducts || [],
    healthMetrics: result?.healthMetrics || null,
    aiAdvice: result?.aiAdvice || null,
    loading,
    error,
    searchMealFood,
  };
};

export default useMealFood;
