import mongoose, { Schema, Types } from "mongoose";
import {
  ListingType,
  PropertyAge,
  PropertyStatus,
  PropertyType,
  Furnishing,
  FloorLevel,
  BHKType,
} from "../enums/property.enums.js";


export interface Property {
  _id: Types.ObjectId;
  brokerId: Types.ObjectId;
  listingType: ListingType;
  status: PropertyStatus;
  propertyType: PropertyType;
  propertyAge?: PropertyAge;
  furnishing?: Furnishing;
  bhkType: BHKType;
  price: number;
  floor?: {
    totalFloors?: number;
    level?: FloorLevel;
  };
  area?: {
    carpet?: number;
    builtUp?: number;
  };
  images?: {
    url: string;
    type: "INTERIOR" | "EXTERIOR" | "FLOORPLAN" | "VIDEO";
    isPrimary: boolean;
  }[];
  address?: {
    line1: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema(
  {
    brokerId: { 
  type: Schema.Types.ObjectId, 
  ref: "Broker",
  required: true,
  index: true
},


    listingType: { type: String, enum: Object.values(ListingType) },
    status: { type: String, enum: Object.values(PropertyStatus) },
    propertyType: { type: String, enum: Object.values(PropertyType) },
    propertyAge: { type: String, enum: Object.values(PropertyAge) },
    furnishing: { type: String, enum: Object.values(Furnishing) },
  bhkType: {
    type: String,
    enum: Object.values(BHKType),
    required: true
  },

  price: {
  type: Number,
  required: true,
  min: 0,
},

    floor: {
      totalFloors: Number,
      level: { type: String, enum: Object.values(FloorLevel) },
    },

    area: {
      carpet: Number,
      builtUp: Number,
    },

    images: [
      {
        url: { type: String, required: true },
        type: {
          type: String,
          enum: ["INTERIOR", "EXTERIOR", "FLOORPLAN", "VIDEO"],
          default: "INTERIOR",
        },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    address: {
      line1: { type: String, required: true },
      line2: String,
      landmark: String,
      locality: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      pincode: { type: String, required: true },

      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
    },

    expiresAt: Date,
  },
  { timestamps: true }
);


PropertySchema.pre("save", function(next) {
  if (!this.images) return next();

  const primaryImages = this.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    return next(new Error("Only one primary image allowed"));
  }
  next();
});



export const PropertyModel = mongoose.model<Property>("Property", PropertySchema);

