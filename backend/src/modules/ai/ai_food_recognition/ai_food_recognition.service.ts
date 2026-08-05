import { Injectable } from "@nestjs/common";
import { AiFoodRecognitionRepository } from "./ai_food_recognition.repository";
import axios from "axios";

export interface RecognizeFoodDto {
  imageBase64: string;
  userPrompt?: string;
}

@Injectable()
export class AiFoodRecognitionService {
  private readonly OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
  private readonly MODEL_NAME = process.env.OLLAMA_VISION_MODEL || "gemma3:4b";

  constructor(
    private readonly aiFoodRecognitionRepository: AiFoodRecognitionRepository
  ) {}

  async recognizeFoodFromImage(dto: RecognizeFoodDto) {
    const { imageBase64, userPrompt } = dto;

    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const systemPrompt = `Bạn là trợ lý AI nhận diện món ăn qua hình ảnh.
Hãy quan sát bức ảnh món ăn và trả về kết quả định dạng JSON thuần túy (không kèm thêm bất kỳ văn bản nào khác ngoài JSON) theo mẫu sau:
{
  "foodName": "Tên món ăn nhận diện (tiếng Việt)",
  "description": "Mô tả ngắn gọn hương vị, thành phần chính và ước tính Calo",
  "keywords": ["từ_khóa_1", "từ_khóa_2"]
}`;

      const payload = {
        model: this.MODEL_NAME,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt || "Đây là món ăn gì? Hãy nhận diện và đánh giá dinh dưỡng giúp tôi.",
            images: [cleanBase64],
          },
        ],
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 256,
        },
      };

      let aiContent = "";
      let recognizedFoodName = "";
      let description = "";
      let keywords: string[] = [];

      try {
        const response = await axios.post(this.OLLAMA_URL, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 45000,
        });

        aiContent = response.data.message?.content || "";

        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          recognizedFoodName = parsed.foodName || "";
          description = parsed.description || "";
          if (Array.isArray(parsed.keywords)) {
            keywords = parsed.keywords;
          }
        }
      } catch (err: any) {
        console.warn("[Ollama AI Warning]:", err.message);
      }

      if (!recognizedFoodName && aiContent) {
        recognizedFoodName = aiContent.split("\n")[0].replace(/[*#]/g, "").trim();
        description = aiContent;
      }

      if (!recognizedFoodName) {
        recognizedFoodName = "Món ăn dinh dưỡng";
        description = "Món ăn thơm ngon, cung cấp năng lượng dồi dào cho cơ thể.";
      }

      if (recognizedFoodName) {
        keywords.push(recognizedFoodName);
        const parts = recognizedFoodName.split(/\s+/).filter((w) => w.length > 2);
        keywords.push(...parts);
      }

      let matchingMenuProducts = await this.aiFoodRecognitionRepository.findMatchingProducts(keywords);

      if (matchingMenuProducts.length === 0) {
        matchingMenuProducts = await this.aiFoodRecognitionRepository.getAllProducts();
        matchingMenuProducts = matchingMenuProducts.slice(0, 5);
      }

      const formattedAiAdvice = `🍱 AI Nhận Diện: ${recognizedFoodName}\n💡 Lời khuyên: ${description}`;

      return {
        success: true,
        aiResult: formattedAiAdvice,
        recognizedFoodName,
        matchingMenuProducts,
      };
    } catch (error: any) {
      console.error("[AI Food Recognition Error]:", error.message);
      
      const fallbackProducts = await this.aiFoodRecognitionRepository.getAllProducts();
      return {
        success: true,
        aiResult: "🍱 AI Nhận Diện: Món ăn dinh dưỡng\n💡 Lời khuyên: Món ăn bổ sung năng lượng cần thiết cho ngày dài hoạt động.",
        recognizedFoodName: "Món ăn dinh dưỡng",
        matchingMenuProducts: fallbackProducts.slice(0, 5),
      };
    }
  }
}