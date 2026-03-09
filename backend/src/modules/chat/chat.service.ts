import { Injectable } from "@nestjs/common";
import { SendMessageDTO } from "./dto/send-message.dto";
import { ChatRepository } from "./chat.repository";

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository) {}

    async saveMessage(data: SendMessageDTO) {
        let conversationId = data.conversationId;

        if (!conversationId || conversationId === "default") {
            const newConversation = await this.chatRepository.createConversation();
            conversationId = newConversation.id;
        } else {
            const existingConv = await this.chatRepository.findConversationById(conversationId);
            
            if (!existingConv) {
                await this.chatRepository.createConversation(conversationId);
            }
        }

        return this.chatRepository.saveMessage(data, conversationId as string);
    }

    async getMessages(conversationId: string) {
        return this.chatRepository.getMessagesByConversationId(conversationId);
    }

    async getAllConversations() {
        return this.chatRepository.getAllConversations();
    }
}
