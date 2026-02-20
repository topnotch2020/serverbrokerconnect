// services/favorite.service.ts

import { FavoriteModel } from "../modals/favorite.model.js";
import { PropertyModel } from "../modals/property.model.js";
import { AppError } from "../utils/error.js";

export class FavoriteService {

  async addFavorite(brokerId: string, propertyId: string) {
    console.log("ADD CALLED");

    const property = await PropertyModel.findById(propertyId);

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    if (property.brokerId.toString() === brokerId) {
      throw new AppError("Cannot favorite your own property", 400);
    }

    try {
      return await FavoriteModel.create({
        broker: brokerId,
        property: propertyId,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("Already added to favorites", 409);
      }
      throw error;
    }
  }


  async removeFavorite(brokerId: string, propertyId: string) {
     console.log("REMOVE CALLED")
    const favorite = await FavoriteModel.findOneAndDelete({
      broker: brokerId,
      property: propertyId,
    });

    if (!favorite) {
      throw new AppError("Favorite not found", 404);
    }

    return { message: "Removed from favorites" };
  }

  async getMyFavorites(brokerId: string) {

    console.log("BROKERID",brokerId)
    const favorites = await FavoriteModel.find({ broker: brokerId })
      .populate({
        path: "property",
        populate: {
          path: "brokerId",
          select: "fname lname email phone",
        },
      })
      .sort({ createdAt: -1 });

    console.log("FAVVVVV", favorites)
    return favorites;
  }

  async isFavorited(brokerId: string, propertyId: string) {
    const exists = await FavoriteModel.exists({
      broker: brokerId,
      property: propertyId,
    });

    return { isFavorited: !!exists };
  }
}
