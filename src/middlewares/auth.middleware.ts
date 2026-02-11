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
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = header.split(" ")[1];

  const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
  req.userId = payload.id;

  next();
};
