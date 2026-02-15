import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import config from "../../../config/env";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  TOKEN_SECRET = config.jwt.secret;
  ACCESS_TOKEN_EXPIRATION = `${config.jwt.accessExpirationMinutes}m`;
  REFRESH_TOKEN_EXPIRATION = `${config.jwt.refreshExpirationDays}d`;

  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.TOKEN_SECRET,
      expiresIn: this.ACCESS_TOKEN_EXPIRATION as any,
    });
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.TOKEN_SECRET,
      expiresIn: this.REFRESH_TOKEN_EXPIRATION as any,
    });
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.TOKEN_SECRET,
    });
  }
}
