import { Controller, Get, Query } from "@nestjs/common";
import { MealFoodService } from "./meal_food.service";

@Controller("ai/meal-food")
export class MealFoodController {
  constructor(private readonly mealFoodService: MealFoodService) {}

  @Get("search")
  async search(
    @Query("userId") userId?: string,
    @Query("height") height?: string,
    @Query("weight") weight?: string,
    @Query("calorieGoal") calorieGoal?: string,
    @Query("budget") budget?: string,
    @Query("mealType") mealType?: string,
    @Query("keyword") keyword?: string
  ) {
    const result = await this.mealFoodService.getMealRecommendations({
      userId,
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      calorieGoal: calorieGoal ? Number(calorieGoal) : undefined,
      budget: budget ? Number(budget) : undefined,
      mealType,
      keyword,
    });
    return result;
  }
}