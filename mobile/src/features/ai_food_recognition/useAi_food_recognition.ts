import aiFoodRecognitionApi from "../../services/api/api-ai_food_recognition";
import { useState } from "react";

export interface RecognitionResult {
  success: boolean;
  aiResult?: string;
  recognizedFoodName?: string;
  matchingMenuProducts?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    images?: string;
    image?: string;
  }>;
  message?: string;
}

export const useAiFoodRecognition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecognitionResult | null>(null);

  const recognizeFood = async (imageBase64: string, userPrompt?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiFoodRecognitionApi.recognize(imageBase64, userPrompt);
      setData(response);
      return response;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể kết nối đến server nhận diện.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setData(null);
    setError(null);
  };

  return { recognizeFood, loading, error, data, resetData };
};