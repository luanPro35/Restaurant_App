import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SendMessageDTO } from "./dto/send-message.dto";

@Injectable()
export class ChatRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findConversationById(id: string) {
        return this.prisma.conversation.findUnique({
            where: { id },
        });
    }

    async createConversation(id?: string) {
        return this.prisma.conversation.create({
            data: id ? { id } : {},
        });
    }

    async saveMessage(data: SendMessageDTO, conversationId: string) {
        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderId: data.senderId || "unknown",
                senderRole: data.senderRole || "user",
                content: data.content,
                type: data.type.toString(),
                metadata: data.metadata ? (data.metadata as any) : undefined,
            },
        });

        // Update conversation's updatedAt to bubble it to the top of lists
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return message;
    }

    async getMessagesByConversationId(conversationId: string) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });
    }

    async getAllConversations() {
        return this.prisma.conversation.findMany({
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }
}
