import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { cloudinaryUpload } from "../../services/cloudinary.service.js";

const router = Router();

/**
 * @route POST /api/v1/upload/property
 * @desc Upload property image to Cloudinary
 * @param {File} image - Property image file (jpg, jpeg, png, webp)
 * @returns {Object} Cloudinary public_id and secure_url
 */
router.post(
  "/property",
  authGuard,
  requireAuth,
  cloudinaryUpload.single("image"),
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File missing",
          code: "FILE_MISSING"
        });
      }

      // Cloudinary response
      const imageUrl = req.file.secure_url;
      const publicId = req.file.public_id;

      res.json({
        success: true,
        data: {
          url: imageUrl,
          publicId: publicId,
          width: req.file.width,
          height: req.file.height,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Image upload failed",
        code: "UPLOAD_FAILED"
      });
    }
  }
);

export const uploadRoutes = router;
