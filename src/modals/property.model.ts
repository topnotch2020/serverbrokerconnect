import mongoose, { Schema } from "mongoose";
import {
  ListingType,
  PropertyAge,
  PropertyStatus,
  PropertyType,
  Furnishing,
  FloorLevel,
} from "../enums/property.enums.js";

const PropertySchema = new Schema(
  {
    brokerId: { type: Schema.Types.ObjectId, ref: "Broker" },
    listingType: { type: String, enum: Object.values(ListingType) },
    status: { type: String, enum: Object.values(PropertyStatus) },
    propertyType: { type: String, enum: Object.values(PropertyType) },
    propertyAge: { type: String, enum: Object.values(PropertyAge) },
    furnishing: { type: String, enum: Object.values(Furnishing) },
    
    floor: {
      totalFloors: Number,
      level: { type: String, enum: Object.values(FloorLevel) },
    },
    area: {
      carpet: Number,
      builtUp: Number,
    },

    expiresAt: Date,
  },
  { timestamps: true }
);

export const PropertyModel = mongoose.model("Property", PropertySchema);

