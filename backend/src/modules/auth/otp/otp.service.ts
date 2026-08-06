import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { sendEmail } from "../../../jobs/email.job";

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async generateOtp(email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // 1. Lưu vào MySQL Database (Đảm bảo hoạt động 100% trên Cloud)
    await this.prisma.otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    // 2. Lưu vào Redis nếu Redis sẵn sàng
    try {
      await this.redisService.set(`otp:${email}`, otp, 300);
    } catch (e) {
      // Ignore redis error
    }

    // 3. Gửi Email OTP (chạy bất đồng bộ ngầm để phản hồi API ngay lập tức, tránh timeout)
    sendEmail(
      email,
      "Mã xác thực (OTP) của bạn",
      `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
    )
      .then(() =>
        this.logger.log(`OTP email sent successfully to: ${email}`),
      )
      .catch((error: any) =>
        this.logger.warn(
          `Could not send email to ${email}: ${error?.message}. Generated OTP: ${otp}`,
        ),
      );

    return { email, message: "OTP sent successfully", otp };
  }

  async verifyOtp(email: string, otp: string) {
    // 1. Kiểm tra từ MySQL Database
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email },
    });

    let isValid = false;

    if (otpRecord) {
      if (otpRecord.expiresAt > new Date() && otpRecord.otp === otp) {
        isValid = true;
        await this.prisma.otp.delete({ where: { email } }).catch(() => {});
      }
    }

    // 2. Kiểm tra thêm từ Redis nếu chưa match
    if (!isValid) {
      const redisOtp = await this.redisService.get(`otp:${email}`);
      if (redisOtp && redisOtp === otp) {
        isValid = true;
        await this.redisService.del(`otp:${email}`);
      }
    }

    if (!isValid) {
      if (!otpRecord) {
        throw new BadRequestException("Mã OTP đã hết hạn hoặc không tồn tại");
      }
      throw new UnauthorizedException("Mã OTP không hợp lệ");
    }

    return { email, verified: true };
  }
}
