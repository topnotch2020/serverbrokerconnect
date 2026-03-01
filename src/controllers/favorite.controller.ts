// controllers/favorite.controller.ts

import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { FavoriteDTO } from "../dtos/favorite.dto.js";
import { PropertyDTO } from "../dtos/property.dto.js";
import { Console } from "console";

export class FavoriteController {

  addFavorite = asyncHandler(
    async (req: Request & { userId?: string }, res: Response) => {
      const { propertyId } = req.params;

      const favorite = await new FavoriteService().addFavorite(
        req.userId!,
        propertyId
      );

      res.status(201).json({ message: "Added to favorites" });
    }
  );

  removeFavorite = asyncHandler(
    async (req: Request & { userId?: string }, res: Response) => {
      const { propertyId } = req.params;

      const result = await new FavoriteService().removeFavorite(
        req.userId!,
        propertyId
      );

      res.json(result);
    }
  );

    getMyFavorites = asyncHandler(
      async (req: Request & { userId?: string }, res: Response) => {
        const favorites = await new FavoriteService().getMyFavorites(
          req.userId!
        );

        const properties = favorites.map((fav: any) => {
          const property = fav.property;

          // 🔥 Map brokerId → broker (so DTO works same as public API)
          if (property.brokerId) {
            property.broker = property.brokerId;
          }

          return new PropertyDTO(property);
        });


        res.json(properties);
      }
    );


  isFavorited = asyncHandler(
    async (req: Request & { userId?: string }, res: Response) => {
      const { propertyId } = req.params;

      const result = await new FavoriteService().isFavorited(
        req.userId!,
        propertyId
      );

      res.json(result);
    }
  );
}
