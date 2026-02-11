import { PropertyModel } from "../modals/property.model.js";
import { PropertyStatus } from "../enums/property.enums.js";
import { AppError } from "../utils/error.js";
import { assertTransition } from "../utils/assertTransition.js";

export class PropertyService {
  // CREATE (Step 1)
  async createDraft(brokerId: string, payload: any) {
    if (!brokerId) {
      throw new AppError("Broker not authenticated", 401);
    }

    if (!payload || Object.keys(payload).length === 0) {
      throw new AppError("Property data is required", 400);
    }

    return PropertyModel.create({
      brokerId,
      status: PropertyStatus.DRAFTED,
      ...payload,
    });
  };
  // UPDATE (Steps 2–6)
  async updateDraft(brokerId: string, propertyId: string, payload: any) {
    const property = await PropertyModel.findOneAndUpdate(
      { _id: propertyId, brokerId, status: PropertyStatus.DRAFTED },
      { $set: payload },
      { new: true }
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

    const property = await PropertyModel.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404);
    }

    return property;
  }

  async getMyProperties(brokerId: string) {
    if (!brokerId) {
      throw new AppError("Unauthorized", 401);
    }

    return PropertyModel.find({ brokerId });
  }

  async getPublic(filters: any) {
    const safeFilters = filters || {};

    return PropertyModel.find({
      status: PropertyStatus.VERIFIED,
      ...safeFilters,
    });
  }
};
