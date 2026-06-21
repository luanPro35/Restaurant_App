export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
}

export class SendMessageDTO {
    conversationId?: string;
    senderId?: string;
    senderRole?: "admin" | "user";
    content!: string;
    type: MessageType = MessageType.TEXT;
    metadata?: Record<string, any>;
}