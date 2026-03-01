import { BrokerModel } from "../modals/broker.model.js";
import { AppError } from "../utils/error.js";
import mongoose from "mongoose";

export class BrokerService {
  /**
   * Get the current broker's profile
   */
  async getMyProfile(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    const broker = await BrokerModel.findById(brokerId).select("-password");

    if (!broker) {
      throw new AppError("Broker not found", 404);
    }

    return broker;
  }

  /**
   * Update the current broker's profile
   */
  async updateMyProfile(brokerId: string, payload: any) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    // Never allow updating password through this endpoint
    if (payload.password) {
      delete payload.password;
    }

    const broker = await BrokerModel.findByIdAndUpdate(
      brokerId,
      { $set: payload },
      { new: true, runValidators: true }
    ).select("-password");

    if (!broker) {
      throw new AppError("Broker not found", 404);
    }

    return broker;
  }

  /**
   * Get broker by ID (public profile)
   */
  async getBrokerById(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    const broker = await BrokerModel.findById(brokerId).select(
      "fname lname email phone role"
    );

    if (!broker) {
      throw new AppError("Broker not found", 404);
    }

    return broker;
  }

  /**
   * Add property to favorites
   */
  async addFavourite(brokerId: string, propertyId: string) {
    if (!brokerId || !propertyId) {
      throw new AppError("Broker ID and Property ID are required", 400);
    }

    // This would typically be handled by the FavoriteService
    // This is kept here for convenience
    throw new AppError(
      "Use FavoriteService for favorite operations",
      400
    );
  }

  /**
   * Remove property from favorites
   */
  async removeFavourite(brokerId: string, propertyId: string) {
    if (!brokerId || !propertyId) {
      throw new AppError("Broker ID and Property ID are required", 400);
    }

    // This would typically be handled by the FavoriteService
    throw new AppError(
      "Use FavoriteService for favorite operations",
      400
    );
  }

  /**
   * Get broker's favorite properties
   */
  async getFavourites(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Broker ID is required", 400);
    }

    // This would typically be handled by the FavoriteService
    throw new AppError(
      "Use FavoriteService for favorite operations",
      400
    );
  }

  /**
   * Get all brokers (admin only)
   */
  async getAllBrokers(
    options?: { limit?: number; skip?: number }
  ) {
    const limit = options?.limit || 20;
    const skip = options?.skip || 0;

    const [brokers, total] = await Promise.all([
      BrokerModel.find()
        .select("-password")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      BrokerModel.countDocuments(),
    ]);

    return {
      data: brokers,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    };
  }
}

