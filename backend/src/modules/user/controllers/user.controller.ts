import { userService } from "./user.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../utils/asyncHandler";

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.userId);
    res.status(StatusCodes.OK).json({ data: user });
  },
);

export const getUserByEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.getUserByEmial(req.params.email);
    res.status(StatusCodes.OK).json({ data: user });
  },
);
