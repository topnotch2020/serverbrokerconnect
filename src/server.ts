import dns from "dns";
import app from "./app.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = ENV.PORT || 4000;

// Force Node to use Google IPv4 DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
