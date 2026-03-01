import { NotificationModel } from "../modals/notification.model.js";
import { NotificationType } from "../enums/notification.enums.js";
import { AppError } from "../utils/error.js";
import mongoose from "mongoose";

export class NotificationService {
  /**
   * Send a notification to a broker
   */
  async send(
    brokerId: string,
    type: NotificationType,
    message: string
  ) {
    if (!brokerId || !type || !message) {
      throw new AppError("Broker ID, type, and message are required", 400);
    }

    return await NotificationModel.create({
      brokerId: new mongoose.Types.ObjectId(brokerId),
      type,
      message,
      unread: true,
    });
  }

  /**
   * Get all notifications for a broker
   */
  async getMyNotifications(
    brokerId: string,
    options?: { limit?: number; skip?: number; unreadOnly?: boolean }
  ) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    const limit = options?.limit || 20;
    const skip = options?.skip || 0;

    const query: any = { brokerId: new mongoose.Types.ObjectId(brokerId) };

    if (options?.unreadOnly) {
      query.unread = true;
    }

    const [notifications, total] = await Promise.all([
      NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      NotificationModel.countDocuments(query),
    ]);

    return {
      data: notifications,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, brokerId: string) {
    if (!notificationId || !brokerId) {
      throw new AppError("Notification ID and Broker ID are required", 400);
    }

    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        brokerId: new mongoose.Types.ObjectId(brokerId),
      },
      { unread: false },
      { new: true }
    );

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }

  /**
   * Mark all notifications as read for a broker
   */
  async markAllAsRead(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    const result = await NotificationModel.updateMany(
      { brokerId: new mongoose.Types.ObjectId(brokerId), unread: true },
      { unread: false }
    );

    return {
      modifiedCount: result.modifiedCount,
      success: result.modifiedCount > 0,
    };
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string, brokerId: string) {
    if (!notificationId || !brokerId) {
      throw new AppError("Notification ID and Broker ID are required", 400);
    }

    const notification = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      brokerId: new mongoose.Types.ObjectId(brokerId),
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return { success: true, message: "Notification deleted" };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    const count = await NotificationModel.countDocuments({
      brokerId: new mongoose.Types.ObjectId(brokerId),
      unread: true,
    });

    return { unreadCount: count };
  }
}
