// routes/v1/favorite.routes.ts

import { Router } from "express";

import { authGuard } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { FavoriteController } from "../../controllers/favorite.controller.js";

const router = Router();
const controller = new FavoriteController();

router.post("/:propertyId", authGuard, asyncHandler(controller.addFavorite));
router.delete("/:propertyId", authGuard, asyncHandler(controller.removeFavorite));
router.get("/my", authGuard, asyncHandler(controller.getMyFavorites));
router.get("/check/:propertyId", authGuard, asyncHandler(controller.isFavorited));


export const favoriteRoutes = router;