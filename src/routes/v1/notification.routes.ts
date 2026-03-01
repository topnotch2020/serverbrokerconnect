import { Router } from "express";
import { NotificationController } from "../../controllers/notification.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();
const controller = new NotificationController();

// All notification routes require authentication
router.use(authGuard);

/**
 * GET /api/v1/notifications
 * Get all notifications for the current broker
 * Query: limit (optional), skip (optional), unreadOnly (optional)
 */
router.get("/", asyncHandler(controller.getMyNotifications));

/**
 * GET /api/v1/notifications/unread-count
 * Get unread notification count
 */
router.get("/unread-count", asyncHandler(controller.getUnreadCount));

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read
 */
router.patch("/:id/read", asyncHandler(controller.markAsRead));

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read
 */
router.patch("/read-all", asyncHandler(controller.markAllAsRead));

/**
 * DELETE /api/v1/notifications/:id
 * Delete a notification
 */
router.delete("/:id", asyncHandler(controller.delete));

export const notificationRoutes = router;
