import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️  Cloudinary credentials not configured");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: `broker-connect/${process.env.NODE_ENV || 'development'}/properties`,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 1920, height: 1920, crop: "limit", quality: "auto" },
      ],
    };
  },
});

export const cloudinaryUpload = multer({ storage });

// Get optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: any = {}) => {
  const defaultTransformations = [
    { fetch_format: "auto", quality: "auto" },
    { width: 800, crop: "scale" }, // For display
  ];

  return cloudinary.url(publicId, {
    transformation: [...defaultTransformations, options],
  });
};

// Delete image from Cloudinary
export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    return false;
  }
};

// Batch delete images
export const deleteCloudinaryBatch = async (publicIds: string[]) => {
  try {
    const results = await Promise.all(
      publicIds.map(id => cloudinary.uploader.destroy(id))
    );
    return results;
  } catch (error) {
    console.error("Error batch deleting Cloudinary images:", error);
    return null;
  }
};

export default cloudinary;
