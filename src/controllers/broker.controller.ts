import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { BrokerService } from "../services/broker.service.js";
import { AppError } from "../utils/error.js";

interface AuthRequest extends Request {
  userId?: string;
}

const service = new BrokerService();

export class BrokerController {
  /**
   * Get the current broker's profile
   * GET /api/v1/brokers/me
   */
  getMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const broker = await service.getMyProfile(req.userId!);

    res.json({
      success: true,
      data: broker,
    });
  });

  /**
   * Update the current broker's profile
   * PUT /api/v1/brokers/me
   */
  updateMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const broker = await service.updateMyProfile(req.userId!, req.body);

    res.json({
      success: true,
      data: broker,
      message: "Profile updated successfully",
    });
  });

  /**
   * Get broker by ID (public profile)
   * GET /api/v1/brokers/:id
   */
  getBrokerById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Broker ID is required", 400);
    }

    const broker = await service.getBrokerById(id);

    res.json({
      success: true,
      data: broker,
    });
  });

  /**
   * Get all brokers (admin only)
   * GET /api/v1/brokers
   */
  getAllBrokers = asyncHandler(async (req: Request, res: Response) => {
    const { limit, skip } = req.query;

    const options = {
      limit: limit ? parseInt(limit as string, 10) : 20,
      skip: skip ? parseInt(skip as string, 10) : 0,
    };

    const result = await service.getAllBrokers(options);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });
}
