import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MilestoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findClaimedMilestones(userId: string, startDate?: Date) {
    const where: any = { userId };
    if (startDate) {
      where.claimedAt = { gte: startDate };
    }
    return (this.prisma as any).userMilestone.findMany({
      where,
      select: { milestoneId: true, claimedAt: true },
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

  async findClaimInPeriod(userId: string, milestoneId: number, startDate: Date) {
    return (this.prisma as any).userMilestone.findFirst({
      where: {
        userId,
        milestoneId,
        claimedAt: { gte: startDate },
      },
    });
  }

  async deleteClaimsBefore(userId: string, beforeDate: Date) {
    return (this.prisma as any).userMilestone.deleteMany({
      where: {
        userId,
        claimedAt: { lt: beforeDate },
      },
    });
  }

  async deleteAllClaimsBefore(beforeDate: Date) {
    return (this.prisma as any).userMilestone.deleteMany({
      where: {
        claimedAt: { lt: beforeDate },
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
