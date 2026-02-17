import express from "express";
import swaggerUi from "swagger-ui-express";

import v1Routes from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Broker Connect API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/v1", v1Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});
app.use(errorHandler);



export default app;
