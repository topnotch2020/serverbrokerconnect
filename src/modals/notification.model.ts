import mongoose, { Schema } from "mongoose";
import { NotificationType } from "../enums/notification.enums.js";

const NotificationSchema = new Schema(
  {
    brokerId: { type: Schema.Types.ObjectId, ref: "Broker" },
    type: { type: String, enum: Object.values(NotificationType) },
    message: String,
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model("Notification", NotificationSchema);
