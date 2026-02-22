import { Module } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { LocalStrategy } from "../strategies/local.strategy";
import { JwtRefreshStrategy } from "../strategies/jwt-refresh.strategy";
import { RolesGuard } from "../guards/roles.guard";
import { OtpModule } from "../otp/otp.module";
import { TokenService } from "../tokens/token.service";

@Module({
  imports: [
    PassportModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, TokenService, RolesGuard, PassportModule],
})
export class AuthModule {}
