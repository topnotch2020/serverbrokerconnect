import express from "express";
import swaggerUi from "swagger-ui-express";

import v1Routes from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSpec } from "./docs/swagger.js";
import { requestLogger } from "./utils/requestLogger.js";
import { uploadRoutes } from "./routes/v1/upload.route.js";
import path from "path";

const app = express();
app.use(express.json());
app.use(requestLogger);


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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/docs", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Broker Connect API Docs</title>
        <link rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              spec: ${JSON.stringify(swaggerSpec)},
              dom_id: '#swagger-ui'
            });
          };
        </script>
      </body>
    </html>
  `);
});

app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1", v1Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});
app.use(errorHandler);


process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION 💥", err);
});

export default app;
