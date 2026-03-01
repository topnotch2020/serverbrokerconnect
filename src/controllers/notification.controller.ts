import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { NotificationService } from "../services/notification.service.js";
import { AppError } from "../utils/error.js";

interface AuthRequest extends Request {
  userId?: string;
}

const service = new NotificationService();

export class NotificationController {
  /**
   * Get all notifications for the current broker
   */
  getMyNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { limit, skip, unreadOnly } = req.query;

    const options = {
      limit: limit ? parseInt(limit as string, 10) : 20,
      skip: skip ? parseInt(skip as string, 10) : 0,
      unreadOnly: unreadOnly === "true",
    };

    const result = await service.getMyNotifications(req.userId!, options);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });

  /**
   * Mark a single notification as read
   */
  markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Notification ID is required", 400);
    }

    const notification = await service.markAsRead(id, req.userId!);

    res.json({
      success: true,
      data: notification,
      message: "Notification marked as read",
    });
  });

  /**
   * Mark all notifications as read
   */
  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await service.markAllAsRead(req.userId!);

    res.json({
      success: true,
      data: result,
      message: "All notifications marked as read",
    });
  });

  /**
   * Delete a notification
   */
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("Notification ID is required", 400);
    }

    const result = await service.delete(id, req.userId!);

    res.json({
      success: true,
      data: result,
      message: "Notification deleted",
    });
  });

  /**
   * Get unread notification count
   */
  getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await service.getUnreadCount(req.userId!);

    res.json({
      success: true,
      data: result,
    });
  });
}
