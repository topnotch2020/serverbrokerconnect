import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";
import { BrokerModel } from "../modals/broker.model.js";
import { AppError } from "../utils/error.js";

export class AuthService {

  async register(email: string, password: string) {
    console.log("EMAIL23", email,password)
    const existing = await BrokerModel.findOne({ email });
    if (existing) {
    throw new AppError("Email already registered", 409);
  }

    const hashedPassword = await bcrypt.hash(password, 10);

    const broker = await BrokerModel.create({
      email,
      password: hashedPassword,
    });

    return broker;
  }

  async login(email: string, password: string) {
    const broker = await BrokerModel.findOne({ email });
    if (!broker) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, broker.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return jwt.sign(
      { id: broker._id },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  async logout(_brokerId: string) {
    // JWT is stateless → nothing to invalidate
    return { message: "Logged out successfully" };
  }

  async getMe(brokerId: string) {
    const broker = await BrokerModel.findById(brokerId)
      .select("-password");

    if (!broker) throw new Error("Broker not found");

    return broker;
  }
}


// register(payload)
// login(email, password)
// logout(brokerId)
// getMe(brokerId)


// POST   /api/auth/register
// POST   /api/auth/login
// POST   /api/auth/logout
// GET    /api/auth/me
