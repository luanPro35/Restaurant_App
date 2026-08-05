import { Module } from "@nestjs/common";
import { MealFoodService } from "./meal_food.service";
import { MealFoodController } from "./meal_food.controller";
import { MealFoodRepository } from "./meal_food.repository";

@Module({
  controllers: [MealFoodController],
  providers: [MealFoodService, MealFoodRepository],
})
export class MealFoodModule {}