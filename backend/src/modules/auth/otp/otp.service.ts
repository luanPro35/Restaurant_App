import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";
import { sendEmail } from "../../../jobs/email.job";

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) { }

  async generateOtp(email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp:${email}`;
    await this.redisService.set(redisKey, otp, 300);
    try {
      await sendEmail(
        email,
        "Mã xác thực (OTP) của bạn",
        `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
      );
      console.log(`OTP email sent successfully to: ${email}`);
    } catch (error: any) {
      console.error("Failed to send OTP email:", error?.message || error);
      throw new BadRequestException(
        `Không thể gửi email OTP đến ${email}. Lỗi: ${error?.message || "Unknown error"}`,
      );
    }

    return { email, message: "OTP sent successfully" };
  }

  async verifyOtp(email: string, otp: string) {
    const redisKey = `otp:${email}`;
    const storedOtp = await this.redisService.get(redisKey);

    if (!storedOtp) {
      throw new BadRequestException("OTP has expired or does not exist");
    }

    if (storedOtp !== otp) {
      throw new UnauthorizedException("Invalid OTP");
    }
    await this.redisService.del(redisKey);
    return { email, verified: true };
  }
}
