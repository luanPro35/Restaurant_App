import { Injectable } from "@nestjs/common";
import { AiRepository } from "./Ai.repository";

@Injectable()
export class AI_Service {
    constructor(private aiRepository: AiRepository) { }

    async chatRecommend(message: string, userId?: string) {
        const lowerMsg = message.toLowerCase();
        let responseData: any = null;
        let type = "DEFAULT";


        const recommendationMap = [

            {
                key: ["ít calo", "giảm cân", "healthy", "thanh đạm"],
                food: ["Nước Ép Cam Tươi", "Trà Đào Cam Sả", "Cà Phê Sữa Đá"],
                text: 'Dưới đây là các món thanh đạm, ít năng lượng rất tốt cho sức khỏe:'
            },
            {
                key: ["vừa calo", "cân bằng", "đủ chất"],
                food: ["Bánh Mì Hội An", "Mì Quảng Tôm Thịt", "Khoai Tây Chiên", "Nem Chua Rán", "Trà Sữa Trân Châu", "Bia Heineken"],
                text: 'Các món ăn với mức năng lượng vừa phải, giúp bạn ngon miệng mà vẫn cân đối:'
            },
            {
                key: ["nhiều calo", "béo", "thèm ăn", "đạm", "năng lượng"],
                food: ["Gà Rán KFC Style", "Phở Bò Đặc Biệt", "Cơm Tấm Sườn Bì Chả", "Bún Chả Hà Nội"],
                text: 'Nếu bạn đang cần nạp nhiều năng lượng, đừng bỏ qua các món cực phẩm này:'
            },

            {
                key: ["trẻ em", "con nít", "bé"],
                food: ["Mì Quảng Tôm Thịt", "Phở Bò Đặc Biệt", "Bánh Mì Hội An", "Khoai Tây Chiên", "Trà Sữa Trân Châu", "Trà Đào Cam Sả", "Nước Ép Cam Tươi"],
                text: 'Các món ăn ngon miệng, dễ ăn và rất được các bạn nhỏ yêu thích:'
            },
            {
                key: ["người lớn", "thanh niên", "trung niên"],
                food: ["Gà Rán KFC Style", "Trà Sữa Trân Châu", "Mì Quảng Tôm Thịt", "Cà Phê Sữa Đá", "Bánh Mì Hội An", "Khoai Tây Chiên", "Trà Đào Cam Sả", "Nem Chua Rán", "Phở Bò Đặc Biệt", "Cơm Tấm Sườn Bì Chả", "Nước Ép Cam Tươi", "Bia Heineken", "Bún Chả Hà Nội"],
                text: 'Danh sách món ăn đa dạng phù hợp với khẩu vị của người lớn:'
            },
            {
                key: ["người già", "người cao tuổi", "ông bà"],
                food: ["Phở Bò Đặc Biệt", "Mì Quảng Tôm Thịt", "Bún Chả Hà Nội", "Nước Ép Cam Tươi", "Trà Đào Cam Sả", "Bánh Mì Hội An"],
                text: 'Các món ăn mềm, dễ tiêu hóa và bồi bổ sức khỏe cho người cao tuổi:'
            },

            {
                key: ["đồ ăn vặt", "ăn vặt", "vặt", "snack"],
                food: ["Khoai Tây Chiên", "Nem Chua Rán", "Bánh Mì Hội An"],
                text: 'Những món ăn vặt "lai rai" cực kỳ hấp dẫn cho bạn đây:'
            },
            {
                key: ["nước uống", "đồ uống", "giải khát", "nước"],
                food: ["Trà Sữa Trân Châu", "Cà Phê Sữa Đá", "Trà Đào Cam Sả", "Nước Ép Cam Tươi", "Bia Heineken"],
                text: 'Giải khát ngay với danh sách đồ uống được yêu thích nhất:'
            },
            {
                key: ["món chính", "menu chính", "thực đơn", "ăn cơm"],
                food: ["Cơm Tấm Sườn Bì Chả", "Phở Bò Đặc Biệt", "Bún Chả Hà Nội", "Mì Quảng Tôm Thịt"],
                text: 'Thực đơn món chính đầy đủ dinh dưỡng cho bữa ăn của bạn:'
            },
            {
                key: ["gà", "món gà", "chicken"],
                food: ["Gà Rán KFC Style"],
                text: 'Các món về gà giòn tan, đậm vị đang chờ bạn thưởng thức:'
            }
        ];


        const match = recommendationMap.find(item =>
            item.key.some(k => lowerMsg.includes(k))
        );

        if (match) {
            const products = await this.aiRepository.getProductsByNames(match.food);
            if (products.length > 0) {
                responseData = { text: match.text, recommendedProducts: products };
                type = "RECOMMENDATION";
            }
        }


        if (!responseData && lowerMsg.length > 1) {
            const searchProducts = await this.aiRepository.searchProducts(message);
            if (searchProducts.length > 0) {
                responseData = {
                    text: `Tôi đã tìm thấy một số món liên quan đến yêu cầu của bạn:`,
                    recommendedProducts: searchProducts
                };
                type = "SEARCH";
            }
        }


        if (!responseData) {
            responseData = {
                text: "Chào bạn! Tôi là trợ lý AI. Bạn hãy thử chọn các gợi ý bên dưới để tôi hỗ trợ nhanh nhất nhé!",
                suggestions: ["Năng lượng", "Nước uống", "Đồ ăn vặt", "Món gà", "Menu chính"]
            };
        }


        await this.logInteraction(userId, message, responseData.text, type, responseData.recommendedProducts);

        return responseData;
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
