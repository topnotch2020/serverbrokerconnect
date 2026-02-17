import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    console.log("🔄 Connecting to MongoDB...");
    
    await mongoose.connect(ENV.MONGO_URI!, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log("✅ MongoDB Connected!");
  } catch (error: any) {
    console.error("❌ MongoDB Failed:", error.message);
    throw error; // NEVER process.exit in serverless
  }
};
