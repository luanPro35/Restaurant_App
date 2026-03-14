import { Module } from "@nestjs/common";
import { AI_Controller } from "./Ai.controller";
import { AI_Service } from "./AI.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { AiRepository } from "./Ai.repository";

@Module({
    imports: [PrismaModule],
    controllers: [AI_Controller],
    providers: [AI_Service, AiRepository],
})
export class AI_Module { }