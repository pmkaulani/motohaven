import crypto from "crypto";
import { getServerSupabase } from "@/lib/supabase/server";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file
export const MAX_FILES_PER_REQUEST = 10;
export const MAX_AGGREGATE_UPLOAD_BYTES = 30 * 1024 * 1024; // 30 MB

export type SupportedImageFormat = "jpeg" | "png" | "webp";

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  format: SupportedImageFormat;
}

/**
 * Validates image magic bytes to reject spoofed files.
 */
export function validateImageMagicBytes(buffer: Buffer): SupportedImageFormat | null {
  if (!buffer || buffer.length < 12) return null;

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

/**
 * Uploads a file buffer to persistent storage (Supabase bucket or local fallback).
 */
export async function uploadToStorage(
  buffer: Buffer,
  format: SupportedImageFormat,
  bucket: "car-photos" | "evidence-docs" = "car-photos"
): Promise<UploadResult> {
  const supabase = getServerSupabase();
  const fileHash = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const generatedKey = `${timestamp}-${fileHash}.${format}`;

  if (supabase) {
    const mimeType = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
    const { error } = await supabase.storage.from(bucket).upload(generatedKey, buffer, {
      contentType: mimeType,
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      throw new Error(`Failed to upload to ${bucket}: ${error.message}`);
    }

    if (bucket === "car-photos") {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(generatedKey);
      return {
        url: urlData.publicUrl,
        key: generatedKey,
        bucket,
        size: buffer.length,
        format,
      };
    } else {
      // Private evidence: return object key, not a public URL
      return {
        url: `private://${bucket}/${generatedKey}`,
        key: generatedKey,
        bucket,
        size: buffer.length,
        format,
      };
    }
  }

  // Local filesystem fallback for dev/test environments
  const fs = await import("fs");
  const path = await import("path");
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, generatedKey);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${generatedKey}`,
    key: generatedKey,
    bucket,
    size: buffer.length,
    format,
  };
}
