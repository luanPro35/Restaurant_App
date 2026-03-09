export interface Message {
    id: number;
    conversationId: string;
    senderId: string;
    senderRole: "admin" | "user";
    content: string;
    type: string;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}