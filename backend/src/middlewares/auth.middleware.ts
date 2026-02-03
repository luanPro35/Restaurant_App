import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

export const auth =
  (...requiredRights: string[]) =>
  async (req: any, res: any, next: any) => {
    next();
  };
