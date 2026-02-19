import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { v4 as uuidv4 } from "uuid";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  const start = Date.now();

  req.headers["x-request-id"] = requestId;

  logger.info("Incoming Request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("Outgoing Response", {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
