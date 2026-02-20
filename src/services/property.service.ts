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
    console.log("CALLED HERE,.,.,.,.")
    if (!brokerId) {
      throw new AppError("Broker not authenticated", 401);
    }

    console.log("payload", payload)
    if (!payload) {
      throw new AppError("Property data is required", 400);
    }

    console.log("CALLED HERE")
    this.validatePrimaryImage(payload);

    return PropertyModel.create({
      brokerId,
      status: PropertyStatus.DRAFTED,
      ...payload,
    });
  }
  // UPDATE (Steps 2–6)
  async updateDraft(brokerId: string, propertyId: string, payload: any) {
    this.validatePrimaryImage(payload);

    const property = await PropertyModel.findOneAndUpdate(
      {
        _id: propertyId,
        brokerId,
        status: PropertyStatus.DRAFTED,
        isDeleted: false,
      },
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
    const property = await PropertyModel.findOne({
      _id: propertyId,
      brokerId,
      isDeleted: false,
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    assertTransition(property.status, PropertyStatus.UNVERIFIED);

    property.status = PropertyStatus.UNVERIFIED;
    await property.save();

    return property;
  }


  // VERIFY (Admin)
  async verify(propertyId: string) {
    const property = await PropertyModel.findById(propertyId);

    if (!property || property.isDeleted) {
      throw new AppError("Property not found", 404);
    }

    assertTransition(property.status, PropertyStatus.VERIFIED);

    property.status = PropertyStatus.VERIFIED;
    await property.save();

    return property;
  }


  // EXPIRE (Cron / Job)
  async expire(propertyId: string) {
    const property = await PropertyModel.findById(propertyId);

    if (!property || property.isDeleted) return null;

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
    const property = await PropertyModel.findOne({
      _id: propertyId,
      brokerId,
      isDeleted: false,
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    assertTransition(property.status, PropertyStatus.VERIFIED);

    property.expiresAt = newExpiry;
    await property.save();

    return property;
  }


  // DELETE
  async delete(brokerId: string, propertyId: string) {
    const property = await PropertyModel.findOne({
      _id: propertyId,
      brokerId,
      isDeleted: false,
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    property.isDeleted = true;
    await property.save();

    return { success: true };
  }

  // READ


  async getById(propertyId: string) {
    const property = await PropertyModel.findOne({
      _id: propertyId,
      isDeleted: false,
    }).populate({
      path: "brokerId",
      select: "fname lname email phone profileImage",
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    return property;
  }

  async getMyProperties(brokerId: string, status?: string) {
    const filter: any = {
      brokerId,
      isDeleted: false,
    };

    const now = new Date();

    if (status === "ACTIVE") {
      filter.status = { $ne: PropertyStatus.EXPIRED };
      filter.expiresAt = { $gte: now };
    }

    if (status === "EXPIRED") {
      filter.$or = [
        { status: PropertyStatus.EXPIRED },
        { expiresAt: { $lt: now } },
      ];
    }

    return PropertyModel.find(filter).sort({ createdAt: -1 });
  }


  async getPublic(params: PublicPropertyQuery, currentUserId: string) {
    console.log("PORPSSS.", params, currentUserId)
    const now = new Date();

    console.log("CALLED HERE,.,.,.,.")
    const matchStage: any = {
      status: {
        $in: [
          PropertyStatus.DRAFTED,
          PropertyStatus.UNVERIFIED,
          PropertyStatus.VERIFIED,
        ],
      },
      listingType: params.listingType,
      isDeleted: false,
      brokerId: { $ne: new mongoose.Types.ObjectId(currentUserId) },
    };
    console.log("MATCH STAGE:", JSON.stringify(matchStage, null, 2));

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
          isFavorited: { $gt: [{ $size: "$favoriteData" }, 0] },
        },
      },

      { $project: { favoriteData: 0 } },
    ];

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

    pipeline.push({ $sort: { createdAt: -1 } });

    return PropertyModel.aggregate(pipeline);
  }



  private validatePrimaryImage(payload: any) {
    if (payload.images) {
      const primaryCount = payload.images.filter(
        (img: any) => img.isPrimary
      ).length;

      if (primaryCount > 1) {
        throw new AppError("Only one primary image allowed", 400);
      }
    }
  }
};
