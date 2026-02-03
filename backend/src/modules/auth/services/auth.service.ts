import {
  Injectable,
  UnauthorizedException,
  BadGatewayException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../../prisma/prisma.service";
import { RegisterDto, LoginDto } from "../validations/auth.validation";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
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
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    const accessToken = this.jwtService.sign(payload);
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

  async resetPassword(email: string, password: string, token: string) {
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
    const accessToken = this.jwtService.sign(payload);
    return {
      message: "Reset password successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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

    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Invalid credentials");
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
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      const accessToken = this.jwtService.sign(newPayload);
      return {
        message: "Refresh token successful",
        accessToken,
      };
    } catch (e) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
