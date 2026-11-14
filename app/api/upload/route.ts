import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

type ImageFormat = "jpeg" | "png" | "webp";

function detectImageFormat(buffer: Buffer): ImageFormat | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  // WebP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return "webp";
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Guard endpoint: staff only
    requireStaff(req);

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No photos provided." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed size of 5 MB.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const detectedFormat = detectImageFormat(buffer);

      if (!detectedFormat) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a valid JPEG, PNG, or WebP image.` },
          { status: 400 }
        );
      }

      // Generate strictly trusted extension from verified magic bytes
      const ext = detectedFormat === "jpeg" ? ".jpg" : `.${detectedFormat}`;
      const safeRandomName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
      const filePath = path.join(uploadDir, safeRandomName);

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${safeRandomName}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error uploading photos:", error);
    return NextResponse.json({ error: "Failed to upload photos." }, { status: 500 });
  }
}
