import express from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";

import v1Routes from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSpec } from "./docs/swagger.js";
import { requestLogger } from "./utils/requestLogger.js";
import { uploadRoutes } from "./routes/v1/upload.route.js";
import path from "path";

const app = express();

// Security middleware with CSP for Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://unpkg.com"],
      fontSrc: ["'self'", "https://unpkg.com"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

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

app.get("/api-spec", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec || {});
});

app.get("/docs", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Broker Connect API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js" charset="UTF-8"></script>
        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: "/api-spec",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "BaseLayout"
            });
            window.ui = ui;
          };
        </script>
      </body>
    </html>
  `;
  res.send(htmlContent);
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
