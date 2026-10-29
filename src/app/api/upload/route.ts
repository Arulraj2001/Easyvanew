import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeName}`;

    // 1. If Supabase Storage is configured, upload directly to Supabase bucket
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(uniqueFileName, buffer, {
            contentType: file.type || "image/jpeg",
            upsert: false,
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(uniqueFileName);
          return NextResponse.json({ url: publicUrl });
        }
      } catch (sbErr) {
        console.warn("Supabase storage upload attempt failed, falling back:", sbErr);
      }
    }

    // 2. Try saving to local filesystem (development / standard server)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, uniqueFileName);
      await fs.writeFile(filePath, buffer);
      const publicUrl = `/uploads/${uniqueFileName}`;
      return NextResponse.json({ url: publicUrl });
    } catch {
      // 3. Fallback for serverless (Vercel read-only filesystem): Return clean base64 data URL
      const mimeType = file.type || "image/jpeg";
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({ url: dataUrl });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
