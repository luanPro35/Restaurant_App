import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MilestoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findClaimedMilestones(userId: string) {
    return (this.prisma as any).userMilestone.findMany({
      where: { userId },
      select: { milestoneId: true },
    });
  }

  async findClaim(userId: string, milestoneId: number) {
    return (this.prisma as any).userMilestone.findUnique({
      where: {
        userId_milestoneId: {
          userId,
          milestoneId,
        },
      },
    });
  }

  async createClaim(userId: string, milestoneId: number) {
    return (this.prisma as any).userMilestone.create({
      data: {
        userId,
        milestoneId,
      },
    });
  }
}
