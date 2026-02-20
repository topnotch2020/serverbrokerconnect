import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { PropertyService } from "../services/property.service.js";
import { PropertyDTO } from "../dtos/property.dto.js";
import { AppError } from "../utils/error.js";

const service = new PropertyService();

interface AuthRequest extends Request {
  userId: string;
}

export class PropertyController {

  /* ========================================================= */
  /* ===================== CREATE DRAFT ====================== */
  /* ========================================================= */

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const property = await service.createDraft(req.userId, req.body);

    res.status(201).json(new PropertyDTO(property));
  });

  /* ========================================================= */
  /* ===================== UPDATE DRAFT ====================== */
  /* ========================================================= */

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.params.id) {
      throw new AppError("Property ID is required", 400);
    }

    const property = await service.updateDraft(
      req.userId,
      req.params.id,
      req.body
    );

    res.json(new PropertyDTO(property));
  });

  /* ========================================================= */
  /* ===================== SUBMIT ============================ */
  /* ========================================================= */

  submit = asyncHandler(async (req: AuthRequest, res: Response) => {
    const property = await service.submit(req.userId, req.params.id);

    res.json(new PropertyDTO(property));
  });

  /* ========================================================= */
  /* ===================== RENEW ============================= */
  /* ========================================================= */

  renew = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.body.expiresAt) {
      throw new AppError("expiresAt is required", 400);
    }

    const expiryDate = new Date(req.body.expiresAt);

    if (isNaN(expiryDate.getTime())) {
      throw new AppError("Invalid expiry date", 400);
    }

    const property = await service.renew(
      req.userId,
      req.params.id,
      expiryDate
    );

    res.json(new PropertyDTO(property));
  });

  /* ========================================================= */
  /* ===================== SOFT DELETE ======================= */
  /* ========================================================= */

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await service.delete(req.userId, req.params.id);

    res.json(result);
  });

  /* ========================================================= */
  /* ===================== GET MY PROPERTIES ================= */
  /* ========================================================= */

  getMine = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.query;

    const properties = await service.getMyProperties(
      req.userId,
      status as string | undefined
    );

    res.json(properties.map((p) => new PropertyDTO(p)));
  });

  /* ========================================================= */
  /* ===================== GET BY ID ========================= */
  /* ========================================================= */

  getById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.params.id) {
      throw new AppError("Property ID is required", 400);
    }

    const property = await service.getById(req.params.id);

    res.json(new PropertyDTO(property));
  });

  /* ========================================================= */
  /* ===================== PUBLIC LIST ======================= */
  /* ========================================================= */

  getPublic = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { listingType, search } = req.query;

    if (!listingType) {
      throw new AppError("listingType is required", 400);
    }

    const properties = await service.getPublic(
      {
        listingType: listingType as any,
        search: search as string | undefined,
      },
      req.userId
    );

    console.log("properties",properties)
    res.json(properties.map((p) => new PropertyDTO(p)));
  });
}
