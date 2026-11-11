import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${path.extname(file.name) || ".jpg"}`;
      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${safeName}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Error uploading photos:", error);
    return NextResponse.json({ error: "Failed to upload photos" }, { status: 500 });
  }
}
