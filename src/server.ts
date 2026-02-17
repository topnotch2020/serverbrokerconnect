import app from "./app.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = ENV.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
