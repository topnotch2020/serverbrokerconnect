import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { BrokerDTO } from "../dtos/auth.dto.js";

export class AuthController {
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("EMAIL",email,password);
    const token = await new AuthService().login(email, password);
    res.json({ token });
  };

  register = asyncHandler(async (req: Request, res: Response) => {
    const broker = await new AuthService().register(req.body);
    res.status(201).json(broker);
  });

  logout = async (req: Request & { userId?: string }, res: Response) => {
    const result = await new AuthService().logout(req.userId!);
    res.json(result);
  };

  getMe = async (req: Request & { userId?: string }, res: Response) => {
    const broker = await new AuthService().getMe(req.userId!);
    res.json(new BrokerDTO(broker));
  };
}
