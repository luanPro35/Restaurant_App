import { Module } from "@nestjs/common";
import { AiFoodRecognitionService } from "./ai_food_recognition.service";
import { AiFoodRecognitionController } from "./ai_food_recognition.controller";
import { AiFoodRecognitionRepository } from "./ai_food_recognition.repository";
import { PrismaModule } from "../../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AiFoodRecognitionController],
  providers: [AiFoodRecognitionService, AiFoodRecognitionRepository],
  exports: [AiFoodRecognitionService, AiFoodRecognitionRepository],
})
export class AiFoodRecognitionModule {}