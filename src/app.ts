import express from "express";
import swaggerUi from "swagger-ui-express";

import v1Routes from "./routes/v1/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use("/api/v1", v1Routes);

app.use(errorHandler);



export default app;
