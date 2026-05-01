// apps/client/app/api/optimize-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, null, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: 'lanczos3'
      })
      .webp({ quality: 95 })
      .toBuffer();

    const timestamp = Date.now();
    const filename = `optimized-${timestamp}.webp`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Lưu file
    fs.writeFileSync(filepath, optimizedBuffer);
    
    // Trả về URL
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      size: optimizedBuffer.length,
      format: 'webp'
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}