import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller.js";
import { authGuard } from "../../middlewares/auth.middleware.js";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/register", controller.register);

router.post("/logout", authGuard, controller.logout);
router.get("/me", authGuard, controller.getMe);

export default router;
