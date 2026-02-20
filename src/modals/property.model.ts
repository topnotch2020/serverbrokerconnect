import mongoose, { Schema, Types, Document } from "mongoose";
import {
  ListingType,
  PropertyAge,
  PropertyStatus,
  PropertyType,
  Furnishing,
  FloorLevel,
  BHKType,
} from "../enums/property.enums.js";

/* ========================================================= */
/* ===================== INTERFACE ========================= */
/* ========================================================= */

export interface Property extends Document {
  _id: Types.ObjectId;
  brokerId: Types.ObjectId;

  listingType: ListingType;
  status: PropertyStatus;
  propertyType: PropertyType;
  propertyAge?: PropertyAge;
  furnishing?: Furnishing;
  bhkType: BHKType;

  pricing: {
    price: number;
    maintenance?: number;
    deposit?: number;
  };

  tenantsAllowed: string[];

  // 🔥 changed to string to match frontend
  availableFrom?: string;

  amenities?: string[];

  facing?: "East" | "West" | "North" | "South";

  floor?: {
    totalFloors?: number;
    floorNumber?: number;
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

  address: {
    line1: string;
    line2?: string;
    landmark?: string;
    locality: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    location?: {
      type: "Point";
      coordinates: [number, number];
    };
  };

  slug?: string;
  views?: number;
  isApproved?: boolean;
  isDeleted?: boolean;

  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/* ========================================================= */
/* ===================== SCHEMA ============================ */
/* ========================================================= */

const PropertySchema = new Schema<Property>(
  {
    brokerId: {
      type: Schema.Types.ObjectId,
      ref: "Broker",
      required: true,
      index: true,
    },

    listingType: {
      type: String,
      enum: Object.values(ListingType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.DRAFTED,
      index: true,
    },

    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
    },

    propertyAge: {
      type: String,
      enum: Object.values(PropertyAge),
    },

    furnishing: {
      type: String,
      enum: Object.values(Furnishing),
    },

    bhkType: {
      type: String,
      enum: Object.values(BHKType),
      required: true,
    },

    pricing: {
      price: { type: Number, required: true, min: 0 },
      maintenance: { type: Number, default: 0 },
      deposit: { type: Number, default: 0 },
    },

    tenantsAllowed: {
      type: [String],
      enum: ["Family", "Bachelors", "Students", "Company Lease"],
      default: [],
    },

    // 🔥 now string to support Immediate / 15 days etc
    availableFrom: {
      type: String,
    },

    amenities: [
      {
        type: String,
        enum: [
          "Balcony",
          "Lift",
          "Parking",
          "Power Backup",
          "Gym",
          "Garden",
          "AC",
          "Modular Kitchen",
          "Gas Pipeline",
          "Security",
          "Pets Allowed", // 🔥 moved here
        ],
      },
    ],

    facing: {
      type: String,
      enum: ["East", "West", "North", "South"],
    },

    floor: {
      totalFloors: Number,
      floorNumber: Number,
      level: {
        type: String,
        enum: Object.values(FloorLevel),
      },
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
      city: { type: String, required: true, index: true },
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
          type: [Number],
          index: "2dsphere",
        },
      },
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    expiresAt: Date,
  },
  { timestamps: true }
);

/* ========================================================= */
/* ===================== INDEXES =========================== */
/* ========================================================= */

PropertySchema.index({ listingType: 1, propertyType: 1 });
PropertySchema.index({ "pricing.price": 1 });
PropertySchema.index({ "address.city": 1, "address.locality": 1 });
PropertySchema.index({ amenities: 1 });
PropertySchema.index({ createdAt: -1 });

/* ========================================================= */
/* ===================== HOOKS ============================= */
/* ========================================================= */

// Ensure only one primary image
PropertySchema.pre("save", function (next) {
  if (this.images) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length > 1) {
      return next(new Error("Only one primary image allowed"));
    }
  }
  next();
});

// Auto-generate slug
PropertySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug =
      `${this.propertyType}-${this.bhkType}-${this._id
        .toString()
        .slice(-6)}`.toLowerCase();
  }
  next();
});

// Enforce rental logic
PropertySchema.pre("validate", function (next) {
  if (this.listingType === ListingType.SALE) {
    this.pricing.deposit = undefined;
    this.pricing.maintenance = undefined;
  }
  next();
});

// Auto-expire rental properties after 30 days
PropertySchema.pre("save", function (next) {
  if (
    this.status === PropertyStatus.VERIFIED &&
    this.listingType === ListingType.RENT
  ) {
    this.expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );
  }
  next();
});

/* ========================================================= */
/* ===================== MODEL ============================= */
/* ========================================================= */

export const PropertyModel = mongoose.model<Property>(
  "Property",
  PropertySchema
);
