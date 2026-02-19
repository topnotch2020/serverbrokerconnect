import mongoose, { Schema } from "mongoose";
import { BrokerRole, BrokerStatus } from "../enums/broker.enums.js";

const BrokerSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    dob: { type: Date, required: true },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,   
      trim: true,     
    },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(BrokerRole),
      default: BrokerRole.BROKER,
    },

    status: { type: String, enum: Object.values(BrokerStatus) },
  },
  { timestamps: true }
);

export const BrokerModel = mongoose.model("Broker", BrokerSchema);
