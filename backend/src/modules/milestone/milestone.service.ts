import { Injectable, BadRequestException } from "@nestjs/common";
import { MilestoneRepository } from "./milestone.repository";
import { OrderRepository } from "../order/order.repository";
import { PackageRepository } from "../package/package.repository";

@Injectable()
export class MilestoneService {
  constructor(
    private readonly milestoneRepository: MilestoneRepository,
    private readonly orderRepository: OrderRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  async getUserProgress(userId: string) {
    const orderCount = await this.orderRepository.countCompletedByUserId(userId);
    const packageCount = await this.packageRepository.count(userId);
    const claimedMilestones = await this.milestoneRepository.findClaimedMilestones(userId);

    const claimedIds = claimedMilestones.map((m: any) => m.milestoneId);

    return {
      currentOrders: orderCount,
      packageCount: packageCount,
      totalOrders: orderCount + packageCount,
      claimedIds,
    };
  }

  async claimMilestone(userId: string, milestoneId: number) {
    const existing = await this.milestoneRepository.findClaim(userId, milestoneId);

    if (existing) {
      throw new BadRequestException("Milestone đã được nhận thưởng trước đó.");
    }

    const thresholds: Record<number, number> = {
      1: 3,
      2: 5,
      3: 10,
      4: 15,
      5: 20,
      6: 30,
    };

    const threshold = thresholds[milestoneId];
    if (!threshold) {
      throw new BadRequestException("Mốc thưởng không hợp lệ.");
    }

    const orderCount = await this.orderRepository.countCompletedByUserId(userId);
    const packageCount = await this.packageRepository.count(userId);
    const totalCount = orderCount + packageCount;

    if (orderCount + packageCount < threshold) {
      const total = orderCount + packageCount;
      throw new BadRequestException(
        `Bạn hiện có ${total} đơn hàng (${orderCount} tại chỗ, ${packageCount} giao hàng). Cần ít nhất ${threshold} đơn để nhận!`
      );
    }

    const claim = await this.milestoneRepository.createClaim(userId, milestoneId);

    return {
      success: true,
      message: "Nhận thưởng thành công!",
      data: claim,
    };
  }
}
