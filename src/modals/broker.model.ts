import mongoose, { Schema } from "mongoose";
import { BrokerRole, BrokerStatus } from "../enums/broker.enums.js";

const BrokerSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(BrokerRole) },
    status: { type: String, enum: Object.values(BrokerStatus) },
  },
  { timestamps: true }
);

export const BrokerModel = mongoose.model("Broker", BrokerSchema);
