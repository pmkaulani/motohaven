import { NextRequest, NextResponse } from "next/server";
import { requireStaff, handleAuthError } from "@/lib/auth/guards";
import {
  uploadToStorage,
  validateImageMagicBytes,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
  MAX_AGGREGATE_UPLOAD_BYTES,
} from "@/lib/storage/adapter";

export async function POST(req: NextRequest) {
  try {
    // 1. Guard endpoint: staff only
    requireStaff(req);

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];
    const bucketParam = formData.get("bucket") as string;
    const bucket = bucketParam === "evidence-docs" ? "evidence-docs" : "car-photos";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Too many files. Maximum allowed per request is ${MAX_FILES_PER_REQUEST}.` },
        { status: 400 }
      );
    }

    // Check aggregate request size
    let aggregateBytes = 0;
    for (const f of files) {
      aggregateBytes += f.size;
    }
    if (aggregateBytes > MAX_AGGREGATE_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Total upload size exceeds the permitted 30 MB aggregate limit." },
        { status: 400 }
      );
    }

    const uploadedResults = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the maximum allowed size of 5 MB.` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const detectedFormat = validateImageMagicBytes(buffer);

      if (!detectedFormat) {
        return NextResponse.json(
          { error: `File "${file.name}" is not a valid JPEG, PNG, or WebP image.` },
          { status: 400 }
        );
      }

      const result = await uploadToStorage(buffer, detectedFormat, bucket);
      uploadedResults.push(result);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedResults.map((r) => r.url),
      keys: uploadedResults.map((r) => r.key),
      files: uploadedResults,
    });
  } catch (error) {
    const authResp = handleAuthError(error);
    if (authResp) return authResp;

    console.error("Error uploading photos:", error);
    return NextResponse.json({ error: "Failed to upload photos." }, { status: 500 });
  }
}
