import { Controller, Get, Query } from "@nestjs/common";
import { AI_Service } from "./AI.service";

@Controller("ai")
export class AI_Controller {
    constructor(private readonly aiService: AI_Service) { }



    @Get("chat")
    async chat(@Query("message") message: string, @Query("userId") userId?: string) {
        return this.aiService.chatRecommend(message, userId);
    }

    @Get("history")
    async getHistory(@Query("userId") userId: string) {
        return this.aiService.getChatHistory(userId);
    }
}