import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOtp(email: string) {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return await this.prisma.otp.upsert({
      where: { email: email },
      update: { otp: otp, expiresAt: expiresAt },
      create: { email: email, otp: otp, expiresAt: expiresAt },
    });
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this.prisma.otp.findUnique({
      where: { email },
    });

    if (!record) {
      throw new BadRequestException("OTP not found for this email");
    }

    if (record.otp !== otp) {
      throw new UnauthorizedException("Invalid OTP");
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException("OTP has expired");
    }

    return record;
  }
}
