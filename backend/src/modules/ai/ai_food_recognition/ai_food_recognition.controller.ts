import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AiFoodRecognitionService, RecognizeFoodDto } from "./ai_food_recognition.service";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";

@ApiTags("ai/food-recognition")
@Controller("ai/food-recognition")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT")
export class AiFoodRecognitionController {
  constructor(private readonly aiFoodRecognitionService: AiFoodRecognitionService) {}

  @Post("recognize")
  async recognizeFood(@Body() dto: RecognizeFoodDto) {
    return this.aiFoodRecognitionService.recognizeFoodFromImage(dto);
  }
}