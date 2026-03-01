import dotenv from "dotenv";

// Load environment file based on NODE_ENV
const envFile = {
  production: ".env.production",
  staging: ".env.staging",
  development: ".env.development",
  test: ".env.test",
}[process.env.NODE_ENV || "development"] || ".env";

dotenv.config({ path: envFile });
dotenv.config({ path: ".env" }); // Always load .env as fallback

const validateEnv = (envVar: string, name: string): string => {
  if (!envVar) {
    console.warn(`⚠️  WARNING: Environment variable ${name} is not set`);
    return "";
  }
  return envVar;
};

export const ENV = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "4000", 10),
  API_VERSION: process.env.API_VERSION || "v1",

  // Database
  MONGO_URI: validateEnv(
    process.env.MONGO_URI!,
    "MONGO_URI"
  ),

  // Authentication
  JWT_SECRET: validateEnv(
    process.env.JWT_SECRET!,
    "JWT_SECRET"
  ),
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || "",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_DIR: process.env.LOG_DIR || "logs",

  // Development
  DEBUG: process.env.DEBUG || "",
  NGROK_URL: process.env.NGROK_URL || "",

  // Feature Flags
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER !== "false",
  ENABLE_MOCK_DATA: process.env.ENABLE_MOCK_DATA === "true",
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true",

  // Email (Optional)
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",

  // Sentry (Error Tracking)
  SENTRY_DSN: process.env.SENTRY_DSN || "",
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || "",
};
