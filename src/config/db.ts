import mongoose from "mongoose";
import { ENV } from "./env.js";
import dns from "dns";

dns.resolveSrv("_mongodb._tcp.cluster0.tofqnvd.mongodb.net", (err, addresses) => {
  if (err) {
    console.error("DNS Error:", err);
  } else {
    console.log("DNS Success:", addresses);
  }
});

export const connectDB = async () => {
  try {
    console.log("🔄 Connecting...", ENV.MONGO_URI?.slice(0, 50) + "...");
    
    await mongoose.connect(ENV.MONGO_URI!, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4 only
      retryWrites: true,
      w: 'majority'
    });

    console.log("✅ MongoDB Connected!");
    console.log("📊 State:", mongoose.connection.readyState); // 1 = connected
  } catch (error: any) {
    console.error("❌ MongoDB Failed:");
    console.error("- Message:", error.message);
    console.error("- Code:", error.code);
    console.error("- Name:", error.name);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error("🔴 Connection error:", err.message);
});

