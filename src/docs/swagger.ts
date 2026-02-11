import fs from "fs";
import yaml from "yaml";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "openapi.yaml");

const file = fs.readFileSync(filePath, "utf8");

export const swaggerSpec = yaml.parse(file);
