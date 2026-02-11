import { Router } from "express";
import { PropertyController } from "../../controllers/property.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();
const controller = new PropertyController();
router.post("/", authGuard, requireAuth, controller.create);
router.patch("/:id", authGuard, requireAuth, controller.update);
router.post("/:id/submit", authGuard, requireAuth, controller.submit);
router.post("/:id/renew", authGuard, requireAuth, controller.renew);
router.delete("/:id", authGuard, requireAuth, controller.delete);
router.get("/me", authGuard, requireAuth, controller.getMine);


export const propertyRoutes = router;
