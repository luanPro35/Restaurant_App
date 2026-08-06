import { Injectable } from "@nestjs/common";
import { MealFoodRepository } from "./meal_food.repository";

export interface MealRecommendationFilter {
  userId?: string; // ID người dùng (nếu có)
  height?: number; // chiều cao (cm)
  weight?: number; // cân nặng (kg)
  age?: number; // tuổi
  gender?: "male" | "female"; // giới tính
  activityLevel?: number; // hệ số vận động (1.2 -> 1.9)
  calorieGoal?: number; // mục tiêu calo
  budget?: number; // ngân sách tối đa (VND)
  mealType?: "BREAKFAST" | "LUNCH" | "DINNER" | "ALL" | string; // Bữa ăn (Sáng, Trưa, Tối, Tất cả)
  keyword?: string; // từ khóa tìm kiếm
  limit?: number; // số lượng món trả về
}

@Injectable()
export class MealFoodService {
  private readonly MEAL_FOOD_API_KEY = process.env.MEAL_FOOD;
  private readonly OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
  private readonly MODEL_NAME = "gemma3:4b";

  constructor(private readonly mealFoodRepository: MealFoodRepository) {}

  /**
   * Tính chỉ số BMI và Lịch trình Nhu cầu Calo khuyến nghị (Bữa Sáng / Trưa / Tối)
   */
  calculateHealthMetrics(
    height?: number,
    weight?: number,
    mealType?: string,
    age: number = 25,
    gender: "male" | "female" = "male",
    activityLevel: number = 1.375
  ) {
    if (!height || !weight) return null;

    // Tính BMI = Cân nặng (kg) / (Chiều cao (m) ^ 2)
    const heightInMeters = height / 100;
    const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Tính BMR theo công thức Mifflin-St Jeor
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Tính TDEE (Tổng năng lượng tiêu thụ hàng ngày)
    const tdee = Math.round(bmr * activityLevel);

    let bmiStatus = "Bình thường";
    if (bmi < 18.5) bmiStatus = "Gầy";
    else if (bmi >= 25 && bmi < 29.9) bmiStatus = "Thừa cân";
    else if (bmi >= 30) bmiStatus = "Béo phì";

    // Lịch trình Calo chi tiết cho cả 3 bữa ăn trong ngày
    const mealSchedule = {
      breakfastCalories: Math.round(tdee * 0.30), // 30% TDEE
      lunchCalories: Math.round(tdee * 0.40),     // 40% TDEE
      dinnerCalories: Math.round(tdee * 0.30),    // 30% TDEE
    };

    // Phân bổ Calo theo Bữa ăn được chọn
    let suggestedMealCalories = Math.round(tdee / 3);
    if (mealType === "BREAKFAST") suggestedMealCalories = mealSchedule.breakfastCalories;
    else if (mealType === "LUNCH") suggestedMealCalories = mealSchedule.lunchCalories;
    else if (mealType === "DINNER") suggestedMealCalories = mealSchedule.dinnerCalories;

    return {
      bmi,
      bmiStatus,
      bmr: Math.round(bmr),
      recommendedDailyCalories: tdee,
      suggestedMealCalories,
      mealSchedule,
    };
  }

  /**
   * Sử dụng Ollama AI (gemma3:4b) phân tích thể trạng và lên Lịch trình Thực đơn cho Bữa Sáng / Trưa / Tối
   */
  private async generateAiAdvice(
    healthMetrics: any,
    mealType?: string,
    budget?: number,
    keyword?: string,
    products: any[] = []
  ): Promise<string> {
    const isAll = !mealType || mealType === "ALL";

    let context = `Bạn là chuyên gia dinh dưỡng và Chef AI của nhà hàng DOLIN.
Hãy phân tích thể trạng khách hàng và đưa ra tư vấn lịch trình thực đơn phù hợp (trả lời bằng tiếng Việt lịch sự, ấm áp):
`;

    if (healthMetrics) {
      context += `- BMI: ${healthMetrics.bmi} (${healthMetrics.bmiStatus})
- Nhu cầu Calo 1 ngày (TDEE): ${healthMetrics.recommendedDailyCalories} kcal
`;

      if (isAll) {
        context += `- Phân bổ Lịch trình cả ngày: 🌅 Bữa sáng (${healthMetrics.mealSchedule.breakfastCalories} kcal), ☀️ Bữa trưa (${healthMetrics.mealSchedule.lunchCalories} kcal), 🌙 Bữa tối (${healthMetrics.mealSchedule.dinnerCalories} kcal)\n`;
      } else {
        context += `- Calo mục tiêu bữa này: ${healthMetrics.suggestedMealCalories} kcal\n`;
      }
    }

    if (budget) {
      context += `- Ngân sách tối đa: ${budget.toLocaleString("vi-VN")}đ\n`;
    }

    if (keyword) {
      context += `- Món ăn ưa thích: ${keyword}\n`;
    }

    if (products.length > 0) {
      context += `- Thực đơn đề xuất có sẵn: ${products.map((p) => `${p.name} (${p.price.toLocaleString("vi-VN")}đ)`).join(", ")}\n`;
    }

    const userPrompt = isAll
      ? `Hãy lập Lịch trình Thực đơn ăn uống trọn gói 1 ngày (Bữa Sáng, Bữa Trưa, Bữa Tối) kèm phân bổ calo và gợi ý chọn món cho tôi.`
      : `Hãy đưa ra đánh giá dinh dưỡng và gợi ý món ăn phù hợp nhất cho bữa ăn của tôi.`;

    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.MODEL_NAME,
          messages: [
            { role: "system", content: context },
            { role: "user", content: userPrompt },
          ],
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 250,
          },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data?.message?.content) {
          return data.message.content.trim();
        }
      }
    } catch (error) {
      console.warn("Ollama AI offline hoặc chưa bật, sử dụng lời khuyên mặc định:", (error as Error).message);
    }

    // Fallback thông minh theo Lịch trình nếu Ollama offline
    if (healthMetrics) {
      if (mealType === "BREAKFAST") {
        return `🌅 Bữa Sáng (Mục tiêu ~${healthMetrics.suggestedMealCalories} kcal): Với chỉ số BMI ${healthMetrics.bmi} (${healthMetrics.bmiStatus}), bạn hãy chọn món thanh nhẹ giàu năng lượng để khởi đầu ngày mới tỉnh táo!`;
      } else if (mealType === "LUNCH") {
        return `☀️ Bữa Trưa (Mục tiêu ~${healthMetrics.suggestedMealCalories} kcal): Nạp đủ đạm (Protein) và tinh bột tốt giúp duy trì sự tập trung suốt buổi chiều.`;
      } else if (mealType === "DINNER") {
        return `🌙 Bữa Tối (Mục tiêu ~${healthMetrics.suggestedMealCalories} kcal): Ưu tiên thực đơn nhiều rau xanh, thanh đạm, ít dầu mỡ giúp cơ thể dễ tiêu hóa.`;
      } else {
        const { breakfastCalories, lunchCalories, dinnerCalories } = healthMetrics.mealSchedule;
        return `📋 LỊCH TRÌNH DINH DƯỠNG KHUYẾN NGHỊ 1 NGÀY (TDEE: ${healthMetrics.recommendedDailyCalories} kcal):
• 🌅 Bữa Sáng (~${breakfastCalories} kcal): Món nhẹ khởi động năng lượng.
• ☀️ Bữa Trưa (~${lunchCalories} kcal): Đầy đủ đạm và tinh bột phục vụ hoạt động.
• 🌙 Bữa Tối (~${dinnerCalories} kcal): Thực đơn thanh nhẹ, ít béo giúp ngủ ngon.`;
      }
    }

    return `DOLIN Chef AI đã chọn lọc các món ăn ngon miệng nhất phù hợp với ngân sách của bạn!`;
  }

  /**
   * Gợi ý & Tìm kiếm thực đơn món ăn phù hợp với mục tiêu dinh dưỡng, lịch trình bữa ăn và ngân sách
   */
  async search(filter: MealRecommendationFilter) {
    const { userId, height, weight, calorieGoal, budget, mealType, keyword, limit = 5 } = filter;

    // 1. Tính toán chỉ số sức khỏe & Lịch trình Calo 3 bữa
    const healthMetrics = this.calculateHealthMetrics(height, weight, mealType);

    // 2. Lấy sản phẩm từ Repository
    const products = await this.mealFoodRepository.findProducts({
      keyword,
      budget,
      limit,
    });

    // 3. Tìm kiếm thêm dữ liệu dinh dưỡng từ USDA API bằng Fetch
    let usdaNutritionData: any[] = [];
    if (this.MEAL_FOOD_API_KEY && keyword) {
      try {
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
          keyword
        )}&api_key=${this.MEAL_FOOD_API_KEY}&pageSize=3`;

        const response = await fetch(url);
        if (response.ok) {
          const data: any = await response.json();
          if (data && data.foods) {
            usdaNutritionData = data.foods.map((food: any) => ({
              fdcId: food.fdcId,
              description: food.description,
              nutrients: food.foodNutrients?.slice(0, 5) || [],
            }));
          }
        }
      } catch (error) {
        console.warn("USDA API call skipped or failed:", (error as Error).message);
      }
    }

    // 4. Tạo Lời khuyên & Lịch trình Dinh Dưỡng Cả Ngày / Từng Bữa từ Ollama AI
    const aiAdvice = await this.generateAiAdvice(healthMetrics, mealType, budget, keyword, products);

    const responseResult = {
      healthMetrics,
      aiAdvice,
      mealType: mealType || "ALL",
      targetCalorieGoal: calorieGoal || healthMetrics?.suggestedMealCalories || null,
      maxBudget: budget || null,
      recommendedProducts: products,
      usdaNutritionData,
    };

    // 5. Lưu thông tin gợi ý vào Model MealRecommendation trong Prisma Database
    await this.mealFoodRepository.saveRecommendation({
      userId: userId || null,
      height,
      weight,
      bmi: healthMetrics?.bmi,
      bmiStatus: healthMetrics?.bmiStatus,
      suggestedCalories: calorieGoal || healthMetrics?.suggestedMealCalories,
      budget,
      mealType: mealType || null,
      keyword,
      recommendedData: products,
    });

    return responseResult;
  }
}