import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileExtension = path.extname(file.name);
    const fileNameWithoutExt = path.basename(file.name, fileExtension);
    const sanitizedName = fileNameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${Date.now()}_${sanitizedName}${fileExtension}`;

    // Target directories: save to both admin and client apps
    const adminUploadDir = path.resolve("public/images");
    const clientUploadDir = path.resolve("../client/public/images");

    // Ensure target directories exist
    await mkdir(adminUploadDir, { recursive: true });
    await mkdir(clientUploadDir, { recursive: true });

    // Write file to Admin public/images
    const adminFilePath = path.join(adminUploadDir, uniqueFileName);
    await writeFile(adminFilePath, buffer);

    // Write file to Client public/images
    const clientFilePath = path.join(clientUploadDir, uniqueFileName);
    await writeFile(clientFilePath, buffer);

    return NextResponse.json({
      success: true,
      filename: uniqueFileName,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
