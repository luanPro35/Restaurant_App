import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { SendMessageDTO } from "./dto/send-message.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  // Khi có người dùng kết nối qua Socket
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    console.log(`[Chat] User connected: ${client.id} (UserId: ${userId})`);
  }

  // Khi có người dùng ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`[Chat] User disconnected: ${client.id}`);
  }

  // Tham gia vào một phòng trò chuyện (ConversationId)
  @SubscribeMessage("join-room")
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(data.conversationId);
    console.log(`[Chat] Client ${client.id} joined room: ${data.conversationId}`);
    return { event: "room-joined", status: "success" };
  }

  // Rời khỏi phòng trò chuyện
  @SubscribeMessage("leave-room")
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(data.conversationId);
    console.log(`[Chat] Client ${client.id} left room: ${data.conversationId}`);
  }

  // Xử lý gửi tin nhắn
  @SubscribeMessage("send-message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDTO,
  ) {
    const savedMessage = await this.chatService.saveMessage(data);

    // Phát (Broadcast) tin nhắn chỉ trong phòng trò chuyện đó
    if (data.conversationId) {
      this.server.to(data.conversationId).emit("new-message", savedMessage);
    } else {
      // Nếu không có conversationId, phát toàn bộ (ít dùng)
      this.server.emit("new-message", savedMessage);
    }

    console.log(`[Chat] Message from ${data.senderId} in ${data.conversationId}`);
    return savedMessage;
  }

  // Sự kiện đang soạn tin nhắn (Typing...)
  @SubscribeMessage("typing")
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; senderName: string; isTyping: boolean },
  ) {
    client.to(data.conversationId).emit("user-typing", {
      senderName: data.senderName,
      isTyping: data.isTyping,
    });
  }
}
