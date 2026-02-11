import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log only in dev
  if (process.env.NODE_ENV !== "production") {
    console.error("ERROR 💥", err);
  }
  // Mongo duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }
  // Mongoose validation errors (THIS FIXES YOUR ISSUE)
  if (err.name === "ValidationError") {
    const errors: Record<string, string> = {};

    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(400).json({
      success: false,
      message: "Invalid property data",
      errors,
    });
  }

  // Known app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // Fallback
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
