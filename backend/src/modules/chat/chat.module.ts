import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatRepository } from "./chat.repository";
import { ChatController } from "./chat.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [ChatController],
    providers: [ChatService, ChatRepository, ChatGateway],
})
export class ChatModule { }