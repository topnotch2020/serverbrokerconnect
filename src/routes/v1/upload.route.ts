import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
import { requireAuth } from "../../middlewares/requireAuth";
import { upload } from "../../middlewares/upload.middleware";
import path from "path";

const router = Router();

router.post(
  "/property",
  authGuard,
  requireAuth,
  upload.single("image"),
  (req: any, res) => {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File missing"
      });
    }

    // Get relative path from uploads folder
    const relativePath = path
      .relative(
        path.join(process.cwd(), "uploads"),
        req.file.path
      )
      .replace(/\\/g, "/"); // Windows fix

    const localUrl = `http://localhost:4000/uploads/${relativePath}`;

    const ngrokDomain = process.env.NGROK_URL;
    const cleanDomain = ngrokDomain?.replace(/\/+$/, "");
    const ngrokUrl = cleanDomain
      ? `${cleanDomain}/uploads/${relativePath}`
      : null;

    console.log({ localUrl, publicUrl: ngrokUrl });

    res.json({
      localUrl,
      publicUrl: ngrokUrl,
    });
  }
);

export const uploadRoutes = router;
