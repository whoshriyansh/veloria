import { v2 as cloudinary } from "cloudinary";

const MAX_BYTES = 10 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function maxUploadBytes() {
  return MAX_BYTES;
}

export async function uploadImageBuffer(buffer: Buffer, filename: string) {
  if (!cloudinaryReady()) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_API_SECRET from the dashboard.",
    );
  }

  const folder = process.env.CLOUDINARY_FOLDER || "veloria";

  return new Promise<{ url: string; publicId: string; width: number; height: number }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"],
          use_filename: true,
          unique_filename: true,
          filename_override: filename.replace(/\.[^.]+$/, ""),
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );
      stream.end(buffer);
    },
  );
}
