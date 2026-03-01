import fs from "fs";
import yaml from "yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "openapi.yaml");

let swaggerSpec = {};

try {
  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath, "utf8");
    swaggerSpec = yaml.parse(file);
    
    if (!swaggerSpec || Object.keys(swaggerSpec).length === 0) {
      console.warn("⚠️ Warning: swaggerSpec is empty after parsing");
    } else {
      console.log("✅ Swagger spec loaded successfully");
    }
  } else {
    console.error(`❌ Error: OpenAPI file not found at ${filePath}`);
  }
} catch (error) {
  console.error("❌ Error parsing OpenAPI YAML:", error instanceof Error ? error.message : error);
  swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Broker Connect API",
      version: "2.0.0"
    },
    paths: {}
  };
}

export { swaggerSpec };
