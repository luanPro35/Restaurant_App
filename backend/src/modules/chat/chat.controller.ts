import { Controller, Get, Param, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get("conversations")
    async getConversations() {
        return this.chatService.getAllConversations();
    }

    @Get("messages/:conversationId")
    async getMessages(@Param("conversationId") conversationId: string) {
        return this.chatService.getMessages(conversationId);
    }
}
