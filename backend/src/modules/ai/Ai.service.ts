import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AiRepository } from "./Ai.repository";

@Injectable()
export class AI_Service {
    private readonly OLLAMA_URL = "http://localhost:11434/api/chat";
    private readonly MODEL_NAME = "llama3.2:1b";

    constructor(private aiRepository: AiRepository) { }

    /**
     * Huấn luyện AI thông qua Context (RAG)
     * Lấy toàn bộ thực đơn và danh mục để AI biết về nhà hàng
     */
    private async buildRestaurantContext(): Promise<string> {
        try {
            // Lấy tất cả sản phẩm từ DB thông qua Repository
            const products = await this.aiRepository.getAllProductsForAI();

            let context = "Bạn là trợ lý ảo thông minh của nhà hàng 'Luan Pro Restaurant'. ";
            context += "Dưới đây là thực đơn hiện tại của nhà hàng:\n\n";

            products.forEach(p => {
                context += `- Món: ${p.name}, Giá: ${p.price.toLocaleString('vi-VN')}đ, Mô tả: ${p.description || 'Ngon miệng'}, Danh mục: ${p.category?.name}\n`;
            });

            context += "\nNhiệm vụ của bạn là:\n";
            context += "1. Tư vấn món ăn dựa trên sở thích của khách.\n";
            context += "2. Nếu khách hỏi về món không có trong thực đơn, hãy lịch sự từ chối và gợi ý món tương tự.\n";
            context += "3. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.\n";
            context += "4. Luôn khuyến khích khách đặt bàn ngay trên ứng dụng.";

            return context;
        } catch (error) {
            console.error("Context Building Error:", error);
            return "Bạn là trợ lý ảo của nhà hàng Luan Pro Restaurant.";
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
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Ollama error: ${response.status} - ${errorData}`);
            }

            const result: any = await response.json();
            const aiText = result.message.content;

            // Xử lý gợi ý sản phẩm dựa trên câu trả lời của AI (NLP đơn giản)
            const recommendedProducts = await this.detectProductsInText(aiText);

            // Lưu log tương tác
            await this.logInteraction(userId, message, aiText, "OLLAMA", recommendedProducts);

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

    private async logInteraction(userId: string, query: string, response: string, type: string, products: any[]) {
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
                    image: p.image || (p.images ? p.images.split(',')[0] : null)
                })) : null
            });
        } catch (error) {
            console.error("AI Logging Error:", (error as Error).message);
        }
    }
}
