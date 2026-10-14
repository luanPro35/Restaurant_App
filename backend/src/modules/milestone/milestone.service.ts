import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { MilestoneRepository } from "./milestone.repository";
import { OrderRepository } from "../order/order.repository";
import { PackageRepository } from "../package/package.repository";

function getStartOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getEndOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

@Injectable()
export class MilestoneService {
  private readonly logger = new Logger(MilestoneService.name);

  constructor(
    private readonly milestoneRepository: MilestoneRepository,
    private readonly orderRepository: OrderRepository,
    private readonly packageRepository: PackageRepository
  ) {}

  /**
   * Lấy tiến trình mốc thưởng của người dùng trong THÁNG HIỆN TẠI.
   * Tự động làm mới (reset) khi bước sang tháng mới.
   */
  async getUserProgress(userId: string) {
    const now = new Date();
    const startOfMonth = getStartOfMonth(now);
    const endOfMonth = getEndOfMonth(now);

    // Dọn sạch các mốc thưởng đã nhận ở tháng cũ (đảm bảo sang tháng mới được nhận lại từ đầu)
    await this.milestoneRepository.deleteClaimsBefore(userId, startOfMonth);

    // Đếm số đơn hoàn thành trong tháng hiện tại
    const orderCount = await this.orderRepository.countCompletedByUserId(userId, startOfMonth);
    const packageCount = await this.packageRepository.count(userId, startOfMonth);
    const totalOrders = orderCount + packageCount;

    // Lấy danh sách ID mốc đã nhận trong tháng hiện tại
    const claimedMilestones = await this.milestoneRepository.findClaimedMilestones(userId, startOfMonth);
    const claimedIds = claimedMilestones.map((m: any) => m.milestoneId);

    // Tính số ngày còn lại trong tháng
    const msDiff = endOfMonth.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return {
      currentOrders: orderCount,
      packageCount: packageCount,
      totalOrders,
      claimedIds,
      cycleMonth: `${now.getMonth() + 1}/${now.getFullYear()}`,
      daysRemaining,
      resetDate: nextMonth.toLocaleDateString("vi-VN"),
      isMaxReached: totalOrders >= 30,
    };
  }

  /**
   * Nhận thưởng mốc trong tháng hiện tại
   */
  async claimMilestone(userId: string, milestoneId: number) {
    const now = new Date();
    const startOfMonth = getStartOfMonth(now);

    // Dọn sạch các mốc của tháng cũ
    await this.milestoneRepository.deleteClaimsBefore(userId, startOfMonth);

    // Kiểm tra xem trong tháng này đã nhận mốc này chưa
    const existing = await this.milestoneRepository.findClaimInPeriod(userId, milestoneId, startOfMonth);
    if (existing) {
      throw new BadRequestException(
        "Bạn đã nhận phần thưởng cho mốc này trong tháng hiện tại. Mốc thưởng sẽ được làm mới vào ngày 01 tháng sau!"
      );
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

    // Đếm số đơn trong tháng hiện tại
    const orderCount = await this.orderRepository.countCompletedByUserId(userId, startOfMonth);
    const packageCount = await this.packageRepository.count(userId, startOfMonth);
    const totalCount = orderCount + packageCount;

    if (totalCount < threshold) {
      throw new BadRequestException(
        `Trong tháng này bạn có ${totalCount} đơn (${orderCount} tại nhà hàng, ${packageCount} giao hàng). Cần đạt ${threshold} đơn để nhận thưởng!`
      );
    }

    const claim = await this.milestoneRepository.createClaim(userId, milestoneId);

    return {
      success: true,
      message: "Nhận thưởng thành công!",
      data: claim,
    };
  }

  /**
   * Cron Job chạy tự động lúc 00:00 ngày đầu tiên mỗi tháng (0 0 1 * *)
   * Tự động reset chu kỳ tích lũy mốc thưởng cho toàn bộ khách hàng.
   */
  @Cron("0 0 1 * *")
  async handleMonthlyResetCron() {
    this.logger.log("Bắt đầu reset chu kỳ tích lũy mốc thưởng hàng tháng...");
    const startOfMonth = getStartOfMonth();
    const result = await this.milestoneRepository.deleteAllClaimsBefore(startOfMonth);
    this.logger.log(`Hoàn tất reset mốc thưởng tháng mới. Đã dọn ${result?.count || 0} bản ghi cũ.`);
  }
}
