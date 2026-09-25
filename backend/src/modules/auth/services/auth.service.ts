import {
  Injectable,
  UnauthorizedException,
  BadGatewayException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import {
  RegisterDto,
  LoginDto,
  GoogleAuthDto,
} from "../validations/auth.validation";
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

  async googleLogin(googleAuthDto: GoogleAuthDto) {
    let email = googleAuthDto.email;
    let name = googleAuthDto.name;

    // 1. If authorization code is provided, exchange it for tokens with Google
    if (googleAuthDto.code) {
      try {
        const clientId = process.env.GOOGLE_CLIENT_ID || "";
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        const redirectUri =
          googleAuthDto.redirectUri || "https://auth.expo.io/@anonymous/mobile";

        const tokenBody = new URLSearchParams({
          code: googleAuthDto.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        });

        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: tokenBody.toString(),
        });

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          const googleAccessToken = tokenData.access_token;
          const googleIdToken = tokenData.id_token;

          // Fetch user profile from Google userinfo API
          if (googleAccessToken) {
            const userInfoRes = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: { Authorization: `Bearer ${googleAccessToken}` },
              }
            );
            if (userInfoRes.ok) {
              const userData = await userInfoRes.json();
              if (userData.email) {
                email = userData.email;
                name = userData.name || name || userData.email.split("@")[0];
              }
            }
          }

          // Fallback to id_token if email not found from userinfo
          if (!email && googleIdToken) {
            const idRes = await fetch(
              `https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`
            );
            if (idRes.ok) {
              const idData = await idRes.json();
              if (idData.email) {
                email = idData.email;
                name = idData.name || name || idData.email.split("@")[0];
              }
            }
          }
        } else {
          const errText = await tokenResponse.text();
          console.error("Google token exchange failed:", tokenResponse.status, errText);
        }
      } catch (exchangeErr) {
        console.error("Error exchanging Google authorization code:", exchangeErr);
      }
    }

    // 2. Verify token with Google if access_token or id_token provided directly
    if (googleAuthDto.token) {
      try {
        const tokenRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${googleAuthDto.token}`
        );
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.email) {
            email = tokenData.email;
            name = tokenData.name || name || tokenData.email.split("@")[0];
          }
        } else {
          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${googleAuthDto.token}` },
            }
          );
          if (userInfoRes.ok) {
            const userData = await userInfoRes.json();
            if (userData.email) {
              email = userData.email;
              name = userData.name || name || userData.email.split("@")[0];
            }
          }
        }
      } catch (err) {
        console.warn("Google token verification warning:", err);
      }
    }

    if (!email) {
      throw new BadRequestException("Email is required for Google login");
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      const randomPassword =
        Math.random().toString(36).slice(-8) + Date.now().toString(36) + "Gg1@";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          password: hashedPassword,
          role: "USER" as any,
        },
      });
    }

    const tokens = await this.generateTokens(user);
    return {
      message: "Google login successful",
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
