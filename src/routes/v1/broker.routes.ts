import { Router } from "express";
import { BrokerController } from "../../controllers/broker.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const router = Router();
const controller = new BrokerController();

/**
 * GET /api/v1/brokers
 * Get all brokers (with pagination)
 */
router.get("/", asyncHandler(controller.getAllBrokers));

/**
 * GET /api/v1/brokers/me
 * Get current broker's profile (requires auth)
 */
router.get("/me", authGuard, asyncHandler(controller.getMyProfile));

/**
 * PUT /api/v1/brokers/me
 * Update current broker's profile (requires auth)
 */
router.put("/me", authGuard, asyncHandler(controller.updateMyProfile));

/**
 * GET /api/v1/brokers/:id
 * Get broker profile by ID
 */
router.get("/:id", asyncHandler(controller.getBrokerById));

export const brokerRoutes = router;
