import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy file tải lên" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and generate unique filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}_${cleanFileName}`;

    // Target directory in admin app public/images
    const adminPublicImagesDir = path.join(process.cwd(), "public", "images");
    if (!existsSync(adminPublicImagesDir)) {
      await fs.mkdir(adminPublicImagesDir, { recursive: true });
    }

    const adminFilePath = path.join(adminPublicImagesDir, uniqueFilename);
    await fs.writeFile(adminFilePath, buffer);

    // Also copy to client app public/images if exists
    try {
      const clientPublicImagesDir = path.join(process.cwd(), "..", "client", "public", "images");
      if (existsSync(clientPublicImagesDir)) {
        const clientFilePath = path.join(clientPublicImagesDir, uniqueFilename);
        await fs.writeFile(clientFilePath, buffer);
      }
    } catch (copyErr) {
      console.warn("Could not copy uploaded image to client app public folder:", copyErr);
    }

    return NextResponse.json({
      success: true,
      filename: uniqueFilename,
      url: `/images/${uniqueFilename}`,
    });
  } catch (err: any) {
    console.error("Lỗi upload ảnh:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Tải ảnh lên thất bại" },
      { status: 500 }
    );
  }
}
