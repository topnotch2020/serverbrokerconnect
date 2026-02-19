import mongoose, { Types } from "mongoose";
import { Property } from "./property.model"; // adjust path

export interface Favorite {
  broker: Types.ObjectId;
  property: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoritePopulated {
  broker: Types.ObjectId;
  property: Property; // 🔥 populated type
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new mongoose.Schema(
  {
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      required: true,
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ broker: 1, property: 1 }, { unique: true });

export const FavoriteModel =
  mongoose.model<Favorite>("Favorite", favoriteSchema);
