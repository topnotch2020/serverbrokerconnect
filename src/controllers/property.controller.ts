import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { PropertyService } from "../services/property.service.js";

const service = new PropertyService();

export class PropertyController {
  create = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.createDraft(req.userId, req.body);
    res.status(201).json(property);
  });

  update = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.updateDraft(
      req.userId,
      req.params.id,
      req.body
    );
    res.json(property);
  });

  submit = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.submit(req.userId, req.params.id);
    res.json(property);
  });

  renew = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.renew(
      req.userId,
      req.params.id,
      req.body.expiresAt
    );
    res.json(property);
  });

  delete = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const result = await service.delete(req.userId, req.params.id);
    res.json(result);
  });

  getMine = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    res.json(await service.getMyProperties(req.userId));
  });
}
