import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";
import { logger } from "../utils/logger.js";


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers["x-request-id"];

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors: any = undefined;

  /*
   * -----------------------------
   * Mongo Duplicate Key Error
   * -----------------------------
   */
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    statusCode = 409;
    message = `${field} already exists`;
  }

  /*
   * -----------------------------
   * Mongoose Validation Error
   * -----------------------------
   */
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
  }

  /*
   * -----------------------------
   * Invalid Mongo ObjectId
   * -----------------------------
   */
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  /*
   * -----------------------------
   * JWT Errors
   * -----------------------------
   */
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  /*
   * -----------------------------
   * Custom App Errors
   * -----------------------------
   */
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  /*
   * -----------------------------
   * Log Everything
   * -----------------------------
   */
  logger.error("Unhandled Error", {
    requestId,
    statusCode,
    message,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  /*
   * -----------------------------
   * Send Response
   * -----------------------------
   */
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
