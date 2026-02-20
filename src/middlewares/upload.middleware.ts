import multer from "multer";
import path from "path";
import fs from "fs";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "video/mp4",
];

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const brokerId = req.userId;
    const propertyId = req.body.propertyId;

    if (!brokerId || !propertyId) {
      return cb(new Error("brokerId or propertyId missing"), "");
    }

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "properties",
      brokerId,
      propertyId
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req: any, file, cb) => {
    const brokerId = req.userId;
    const propertyId = req.body.propertyId;

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "properties",
      brokerId,
      propertyId
    );

    const existingFiles = fs.readdirSync(uploadPath);

    const imageCount = existingFiles.length + 1;

    const ext = path.extname(file.originalname);

    cb(null, `${imageCount}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
