import { Controller, Get, Post, Param, UseGuards, ParseIntPipe } from "@nestjs/common";
import { MilestoneService } from "./milestone.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiTags("Milestones")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("milestones")
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current milestone progress and claimed IDs" })
  async getMe(@CurrentUser() user: any) {
    return this.milestoneService.getUserProgress(user.sub);
  }

  @Post("claim/:id")
  @ApiOperation({ summary: "Claim a milestone reward" })
  async claimReward(
    @CurrentUser() user: any,
    @Param("id", ParseIntPipe) milestoneId: number,
  ) {
    return this.milestoneService.claimMilestone(user.sub, milestoneId);
  }
}
