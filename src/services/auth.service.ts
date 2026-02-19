import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/env.js";
import { BrokerModel } from "../modals/broker.model.js";
import { AppError } from "../utils/error.js";

export class AuthService {

  async register(payload: {
    fname: string;
    lname: string;
    email: string;
    dob: string;
    phone: string;
    password: string;
  }) {
    const { fname, lname, dob, phone, password } = payload;
    const email = payload.email.trim().toLowerCase();
    const existing = await BrokerModel.findOne({ email });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const broker = await BrokerModel.create({
      fname,
      lname,
      email,
      dob,
      phone,
      password: hashedPassword,
    });

    return {
      id: broker._id,
      fname: broker.fname,
      lname: broker.lname,
      email: broker.email,
      phone: broker.phone,
    };
  }

async login(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const broker = await BrokerModel.findOne({ email: normalizedEmail });
  if (!broker) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, broker.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

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
