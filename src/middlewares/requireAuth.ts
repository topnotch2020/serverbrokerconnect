// middlewares/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";

/**
 * TypeScript assertion middleware
 * After this runs, req.userId is guaranteed to be string
 */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): asserts req is Request & { userId: string } {
  if (!req.userId) {
    throw new AppError("Authentication required", 401);
  }
  next();
}
