import api from "./axios.instance";
import { MealFoodSearchParams } from "./api-ai";

export const mealFoodApi = {
  search: async (params: MealFoodSearchParams) => {
    const response = await api.get(`/ai/meal-food/search`, { params });
    return response.data;
  },
};

export default mealFoodApi;
