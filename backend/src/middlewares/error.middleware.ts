import { Request, Response, NextFunction } from "express";
// import httpStatus from 'http-status';
// import ApiError from '../utils/ApiError';

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(err);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const { statusCode, message } = err;
  res.status(500).send({
    code: 500,
    message: "Internal Server Error",
    stack: err.stack,
  });
};
