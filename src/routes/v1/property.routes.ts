import { Router } from "express";
import { PropertyController } from "../../controllers/property.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();
const controller = new PropertyController();

router.post("/", authGuard, requireAuth, controller.create);
router.patch("/:id", authGuard, requireAuth, controller.update);
router.patch("/:id/submit", authGuard, requireAuth, controller.submit);
router.patch("/:id/renew", authGuard, requireAuth, controller.renew);
router.delete("/:id", authGuard, requireAuth, controller.delete);
router.get("/me", authGuard, requireAuth, controller.getMine);
router.get("/public", controller.getPublic);  // ✅ Public - no auth required
router.get("/:id", authGuard, requireAuth, controller.getById);

export const propertyRoutes = router;
