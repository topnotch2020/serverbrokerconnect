import { PropertyModel } from "../modals/property.model.js";
import { ListingType, PropertyStatus } from "../enums/property.enums.js";
import { AppError } from "../utils/error.js";
import { assertTransition } from "../utils/assertTransition.js";
import mongoose from "mongoose";
import { IPropertyPopulated } from "../types/property.types.js";

type PublicPropertyQuery = {
  listingType: ListingType;
  search?: string;
};


export class PropertyService {
  // CREATE (Step 1)
  async createDraft(brokerId: string, payload: any) {
    if (!brokerId) {
      throw new AppError("Broker not authenticated", 401);
    }

    if (!payload || Object.keys(payload).length === 0) {
      throw new AppError("Property data is required", 400);
    }

    // Ensure only one primary image
    if (payload.images) {
      const primaryCount = payload.images.filter(
        (img: any) => img.isPrimary
      ).length;

      if (primaryCount > 1) {
        throw new AppError("Only one primary image allowed", 400);
      }
    }

    return PropertyModel.create({
      brokerId,
      status: PropertyStatus.DRAFTED,
      ...payload,
    });
  }

  // UPDATE (Steps 2–6)
  async updateDraft(brokerId: string, propertyId: string, payload: any) {
    if (payload.images) {
      const primaryCount = payload.images.filter(
        (img: any) => img.isPrimary
      ).length;

      if (primaryCount > 1) {
        throw new AppError("Only one primary image allowed", 400);
      }
    }

    const property = await PropertyModel.findOneAndUpdate(
      { _id: propertyId, brokerId, status: PropertyStatus.DRAFTED },
      { $set: payload },
      { new: true, runValidators: true }

    );

    if (!property) {
      throw new AppError(
        "Draft property not found or cannot be updated",
        404
      );
    }

    return property;
  }

  // SUBMIT (Final step)
  async submit(brokerId: string, propertyId: string) {
    if (!brokerId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!propertyId) {
      throw new AppError("Property ID is required", 400);
    }
    const property = await PropertyModel.findOne({
      _id: propertyId,
      brokerId,
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }
    try {
      assertTransition(property.status, PropertyStatus.UNVERIFIED);
    } catch {
      throw new AppError(
        `Cannot submit property from status ${property.status}`,
        400
      );
    }
    property.status = PropertyStatus.UNVERIFIED;
    await property.save();

    return property;
  }

  // VERIFY (Admin)
  async verify(propertyId: string) {
    if (!propertyId) {
      throw new AppError("Property ID is required", 400);
    }
    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404);
    }
    try {
      assertTransition(property.status, PropertyStatus.VERIFIED);
    } catch {
      throw new AppError(
        `Property cannot be verified from status ${property.status}`,
        400
      );
    }
    property.status = PropertyStatus.VERIFIED;
    await property.save();

    return property;
  }

  // EXPIRE (Cron / Job)
  async expire(propertyId: string) {
    if (!propertyId) return null;

    const property = await PropertyModel.findById(propertyId);
    if (!property) return null;

    try {
      assertTransition(property.status, PropertyStatus.EXPIRED);
    } catch {
      return null;
    }
    property.status = PropertyStatus.EXPIRED;
    await property.save();

    return property;
  }

// RENEW
  async renew(brokerId: string, propertyId: string, newExpiry: Date) {
    if (!brokerId) {
      throw new AppError("Unauthorized", 401);
    }
    if (!propertyId) {
      throw new AppError("Property ID is required", 400);
    }
    if (!newExpiry || isNaN(new Date(newExpiry).getTime())) {
      throw new AppError("Invalid expiry date", 400);
    }
    const property = await PropertyModel.findOne({
      _id: propertyId,
      brokerId,
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }
    try {
      assertTransition(property.status, PropertyStatus.VERIFIED);
    } catch {
      throw new AppError(
        `Only verified properties can be renewed (current: ${property.status})`,
        400
      );
    }
    property.expiresAt = newExpiry;
    await property.save();

    return property;
  }

  // DELETE
  async delete(brokerId: string, propertyId: string) {
    if (!brokerId) {
      throw new AppError("Unauthorized", 401);
    }

    if (!propertyId) {
      throw new AppError("Property ID is required", 400);
    }

    const deleted = await PropertyModel.findOneAndDelete({
      _id: propertyId,
      brokerId,
    });

    if (!deleted) {
      throw new AppError("Property not found", 404);
    }

    return { success: true };
  }

  // READ

  async getById(propertyId: string) {
    if (!propertyId) {
      throw new AppError("Property ID is required", 400);
    }

  const property = await PropertyModel
    .findById(propertyId)
    .populate({
      path: "brokerId",
      select: "fname lname email phone profileImage",
    });


    if (!property) {
      throw new AppError("Property not found", 404);
    }

    return property;
  }


  async getMyProperties(brokerId: string, status?: string) {
    if (!brokerId) {
      throw new AppError("Unauthorized", 401);
    }

    const filter: any = { brokerId };

    const now = new Date();

    if (status === "ACTIVE") {
    filter.status = { $ne: "EXPIRED" };
      filter.expiresAt = { $gte: now };
    }

    if (status === "EXPIRED") {
      filter.$or = [
        { status: "EXPIRED" },
        { expiresAt: { $lt: now } }
      ];
    }

    return PropertyModel.find(filter).sort({ createdAt: -1 });
  }


    async getPublic(
      params: PublicPropertyQuery,
      currentUserId: string
    ) {
      if (!currentUserId) {
        throw new AppError("Unauthorized", 401);
      }

      if (!params.listingType) {
        throw new AppError("listingType is required", 400);
      }

      const now = new Date();

      const matchStage: any = {
        status: { $ne: PropertyStatus.EXPIRED },
        listingType: params.listingType,
        brokerId: { $ne: new mongoose.Types.ObjectId(currentUserId) },
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gte: now } },
        ],
      };

      const pipeline: any[] = [
        { $match: matchStage },

        {
          $lookup: {
            from: "brokers",
            localField: "brokerId",
            foreignField: "_id",
            as: "broker",
          },
        },

        { $unwind: "$broker" },

        // 🔥 ONLY ADDITION STARTS HERE
        {
          $lookup: {
            from: "favorites",
            let: { propertyId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$property", "$$propertyId"] },
                      {
                        $eq: [
                          "$broker",
                          new mongoose.Types.ObjectId(currentUserId),
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "favoriteData",
          },
        },

        {
          $addFields: {
            isFavorited: {
              $gt: [{ $size: "$favoriteData" }, 0],
            },
          },
        },

        {
          $project: {
            favoriteData: 0,
          },
        },
        // 🔥 ONLY ADDITION ENDS HERE
      ];

      // 🔥 KEEP YOUR SEARCH EXACTLY AS IT IS
      if (params.search) {
        const regex = new RegExp(params.search, "i");

        pipeline.push({
          $match: {
            $or: [
              { "address.city": regex },
              { "address.locality": regex },
              { "broker.fname": regex },
              { "broker.lname": regex },
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$broker.fname", " ", "$broker.lname"] },
                    regex: regex,
                  },
                },
              },
            ],
          },
        });
      }

      // 🔥 KEEP SORT
      pipeline.push({ $sort: { createdAt: -1 } });

      const properties = await PropertyModel.aggregate(pipeline);

      return properties;
    }






};
