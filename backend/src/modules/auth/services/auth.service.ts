import {
  Injectable,
  UnauthorizedException,
  BadGatewayException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "../validations/auth.validation";
import * as bcrypt from "bcrypt";
import { OtpService } from "../otp/otp.service";
import { TokenService } from "../tokens/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (registerDto.otp) {
      await this.otpService.verifyOtp(registerDto.email, registerDto.otp);
    } else {
      throw new BadRequestException("OTP is required for registration");
    }

    const existUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (existUser) {
      throw new BadGatewayException("User already exists");
    }

    const { email, password, name } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    if (!user) {
      throw new BadGatewayException("User not created");
    }

    return user;
  }

  async generateTokens(user: any) {
    const payload = {
      sub: user.id || user.sub,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.generateTokens(user);
    return {
      message: "Login successful",
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.tokenService.generateAccessToken(payload);
    return {
      message: "Forgot password successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async resetPassword(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    const tokens = await this.generateTokens(updatedUser);
    return {
      message: "Reset password successful",
      ...tokens,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginAdmin(login: LoginDto) {
    const user = await this.validateUser(login.email, login.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      throw new UnauthorizedException("Insufficient permissions to access admin area");
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.generateTokens(user);
    return {
      message: "Login successful",
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken);
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      const accessToken = this.tokenService.generateAccessToken(newPayload);
      return {
        message: "Refresh token successful",
        accessToken,
      };
    } catch (e) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });
    return {
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }
}
