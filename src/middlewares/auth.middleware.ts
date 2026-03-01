// middlewares/authGuard.ts
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";

export const authGuard = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
    (req as any).userId = payload.id;

    next();
  } catch (error: any) {
    // Pass error to error handler middleware
    if (error instanceof AppError) {
      next(error);
    } else if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid token", 401));
    } else if (error.name === "TokenExpiredError") {
      next(new AppError("Token expired", 401));
    } else {
      next(error);
    }
  }
};
