import { Router } from "express";
import authRoutes from "./auth.routes.js";
import { brokerRoutes } from "./broker.routes.js";
import { propertyRoutes } from "./property.routes.js";
import { notificationRoutes } from "./notification.routes.js";
import metaRoutes from "./meta.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/brokers", brokerRoutes);
router.use("/properties", propertyRoutes);
router.use("/notifications", notificationRoutes);
router.use("/meta", metaRoutes);

export default router;
