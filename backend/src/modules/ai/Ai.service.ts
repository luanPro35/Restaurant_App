import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AiRepository } from "./Ai.repository";

@Injectable()
export class AI_Service {
    private readonly OLLAMA_URL = "http://localhost:11434/api/chat";
    private readonly MODEL_NAME = "gemma3:4b";

    constructor(private aiRepository: AiRepository) { }

    private async buildRestaurantContext(): Promise<string> {
        try {
            const products = await this.aiRepository.getAllProductsForAI();

            let context = `Bạn là 'DOLIN Assistant', chuyên gia tư vấn món ăn tại nhà hàng DOLIN.
Hãy sử dụng danh sách thực đơn dưới đây để trả lời khách hàng:

${products.map(p => `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ (${p.category?.name || 'Khác'}) - ${p.description || 'Ngon miệng'}`).join('\n')}

Nguyên tắc trả lời:
1. Luôn thân thiện, lịch sự và sử dụng tiếng Việt.
2. Trả lời ngắn gọn, tập trung vào việc tư vấn món ăn.
3. Nếu khách hỏi món không có, hãy gợi ý món tương tự trong thực đơn.
4. LUÔN nhắc tên món ăn CHÍNH XÁC như trong danh sách để hệ thống có thể nhận diện.
5. Khuyến khích khách đặt bàn hoặc đặt món trực tiếp trên app.
6. Kết thúc câu trả lời bằng một lời mời hấp dẫn.`;

            return context;
        } catch (error) {
            console.error("Context Building Error:", error);
            return "Bạn là trợ lý ảo của nhà hàng DOLIN.";
        }
    }

    async chatWithOllama(message: string, userId?: string) {
        try {
            const context = await this.buildRestaurantContext();

            const response = await fetch(this.OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.MODEL_NAME,
                    messages: [
                        { role: 'system', content: context },
                        { role: 'user', content: message }
                    ],
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        num_predict: 200, // Giới hạn độ dài câu trả lời để tránh lan man
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Ollama error: ${response.status} - ${errorData}`);
            }

            const result: any = await response.json();
            const aiText = result.message.content;

            const recommendedProducts = await this.detectProductsInText(aiText);

            this.logInteraction(userId, message, aiText, "OLLAMA", recommendedProducts);

            return {
                text: aiText,
                recommendedProducts: recommendedProducts,
                type: "AI_OLLAMA"
            };
        } catch (error) {
            console.error("Ollama Chat Error:", error);
            // Fallback sang hệ thống cũ nếu Ollama chưa bật hoặc lỗi
            return this.oldSchoolRecommend(message, userId);
        }
    }

    private async detectProductsInText(text: string) {
        // Tìm xem AI có nhắc đến tên món nào trong thực đơn không
        const allProducts = await this.aiRepository.getAllProductsForAI();
        return allProducts.filter(p => text.toLowerCase().includes(p.name.toLowerCase()));
    }

    // Logic cũ để dự phòng (Fallback)
    private async oldSchoolRecommend(message: string, userId?: string) {
        // (Giữ lại logic cũ của bạn ở đây nếu cần)
        return { text: "Xin lỗi, tôi đang bận cập nhật kiến thức. Hãy thử lại sau nhé!", type: "ERROR" };
    }

    async getChatHistory(userId: string) {
        return this.aiRepository.getChatHistory(userId);
    }

    private async logInteraction(userId: string | undefined, query: string, response: string, type: string, products: any[]) {
        try {
            await this.aiRepository.logInteraction({
                userId: userId || null,
                query,
                response,
                type,
                products: products ? products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.image || (p.images ? (p.images.startsWith('data:image') ? p.images : p.images.split(',')[0]) : null)
                })) : null
            });
        } catch (error) {
            console.error("AI Logging Error:", (error as Error).message);
        }
    }
}
