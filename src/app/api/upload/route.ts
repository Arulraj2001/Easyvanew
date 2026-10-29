import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

