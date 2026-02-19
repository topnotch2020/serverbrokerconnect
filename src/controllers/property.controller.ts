import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { PropertyService } from "../services/property.service.js";
import { PropertyDTO } from "../dtos/property.dto.js";

const service = new PropertyService();

export class PropertyController {

  create = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.createDraft(req.userId, req.body);

    res.status(201).json(new PropertyDTO(property));
  });

  update = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.updateDraft(
      req.userId,
      req.params.id,
      req.body
    );

    res.json(new PropertyDTO(property));
  });

  submit = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.submit(req.userId, req.params.id);

    res.json(new PropertyDTO(property));
  });

  renew = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const property = await service.renew(
      req.userId,
      req.params.id,
      req.body.expiresAt
    );

    res.json(new PropertyDTO(property));
  });

  delete = asyncHandler(async (req: Request & { userId: string }, res: Response) => {
    const result = await service.delete(req.userId, req.params.id);

    res.json(result);
  });

  getMine = asyncHandler(
    async (req: Request & { userId: string }, res: Response) => {

      const { status } = req.query;

      const properties = await service.getMyProperties(
        req.userId,
        status as string
      );

      res.json(properties.map(p => new PropertyDTO(p)));
    }
  );


  getById = asyncHandler(async (req: Request, res: Response) => {
    const property = await service.getById(req.params.id);

    res.json(new PropertyDTO(property));
  });

  getPublic = asyncHandler(
    async (req: Request & { userId: string }, res: Response) => {
      const { listingType, search } = req.query;

      const properties = await service.getPublic(
        {
          listingType: listingType as any,
          search: search as string | undefined,
        },
        req.userId
      );

      res.json(properties.map((p) => new PropertyDTO(p)));
    }
  );





}
