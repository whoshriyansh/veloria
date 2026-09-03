import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { cloudinaryReady, maxUploadBytes, uploadImageBuffer } from "@/lib/cloudinary";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!cloudinaryReady()) {
    return NextResponse.json(
      {
        error:
          "Cloudinary API secret is missing. Paste CLOUDINARY_API_SECRET in .env and Vercel, then retry.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed (max 10MB)." }, { status: 400 });
  }

  if (file.size > maxUploadBytes()) {
    return NextResponse.json({ error: "Image must be 10MB or smaller." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadImageBuffer(buffer, file.name);

  return NextResponse.json(uploaded);
}
