import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getProducts, getCategories, getSiteSettings, getOrders, getBlogPosts } from "@/lib/db";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const SUPABASE_FREE_TIER_BYTES = 1024 * 1024 * 1024; // 1 GB in bytes

export async function GET() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const dirents = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });

    const [products, categories, settings, orders, blogPosts] = await Promise.all([
      getProducts(),
      getCategories(),
      getSiteSettings(),
      getOrders(),
      getBlogPosts(true),
    ]);

    // Gather all referenced URLs
    const referencedUrls = new Set<string>();

    products.forEach((p) => {
      p.images?.forEach((img) => referencedUrls.add(img.image_url));
    });

    categories.forEach((c) => {
      if (c.image_url) referencedUrls.add(c.image_url);
    });

    settings?.hero_banners?.forEach((b) => {
      if (b.image_url) referencedUrls.add(b.image_url);
    });
    if (settings?.custom_upi_qr_url) {
      referencedUrls.add(settings.custom_upi_qr_url);
    }

    orders.forEach((o) => {
      if (o.utr_proof_image) referencedUrls.add(o.utr_proof_image);
    });

    blogPosts.forEach((b) => {
      if (b.cover_image) referencedUrls.add(b.cover_image);
    });

    let totalBytes = 0;
    const files = [];

    for (const d of dirents) {
      if (d.isFile()) {
        const filePath = path.join(UPLOADS_DIR, d.name);
        const stat = await fs.stat(filePath);
        totalBytes += stat.size;

        const publicUrl = `/uploads/${d.name}`;
        const isReferenced = referencedUrls.has(publicUrl);

        // Categorize file
        let category = "Product Asset";
        if (d.name.includes("qr_") || publicUrl === settings?.custom_upi_qr_url) {
          category = "Merchant Standee QR";
        } else if (d.name.includes("proof") || d.name.includes("utr")) {
          category = "Payment Verification Proof";
        } else if (d.name.includes("banner")) {
          category = "Hero Banner";
        } else if (d.name.includes("blog")) {
          category = "Blog Featured Image";
        }

        files.push({
          name: d.name,
          url: publicUrl,
          size: stat.size,
          sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
          created_at: stat.birthtime.toISOString(),
          isOrphan: !isReferenced,
          category,
        });
      }
    }

    // Sort newest first
    files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      totalBytes,
      totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
      quotaBytes: SUPABASE_FREE_TIER_BYTES,
      quotaMB: 1024,
      percentUsed: ((totalBytes / SUPABASE_FREE_TIER_BYTES) * 100).toFixed(2),
      fileCount: files.length,
      orphanCount: files.filter((f) => f.isOrphan).length,
      files,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze storage" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, fileName } = body;

    if (action === "delete_file" && fileName) {
      const safeName = path.basename(fileName);
      const filePath = path.join(UPLOADS_DIR, safeName);
      await fs.unlink(filePath).catch(() => {});
      return NextResponse.json({ success: true, message: `Deleted ${safeName}` });
    }

    if (action === "clean_orphans") {
      const getRes = await GET();
      const data = await getRes.json();
      const orphanFiles = data.files.filter((f: any) => f.isOrphan);

      let deletedCount = 0;
      let freedBytes = 0;

      for (const f of orphanFiles) {
        const filePath = path.join(UPLOADS_DIR, path.basename(f.name));
        await fs.unlink(filePath).catch(() => {});
        deletedCount++;
        freedBytes += f.size;
      }

      return NextResponse.json({
        success: true,
        deletedCount,
        freedMB: (freedBytes / (1024 * 1024)).toFixed(2),
      });
    }

    if (action === "purge_old_proofs") {
      const getRes = await GET();
      const data = await getRes.json();
      const proofFiles = data.files.filter((f: any) => f.category === "Payment Verification Proof");

      let deletedCount = 0;
      for (const f of proofFiles) {
        const filePath = path.join(UPLOADS_DIR, path.basename(f.name));
        await fs.unlink(filePath).catch(() => {});
        deletedCount++;
      }

      return NextResponse.json({
        success: true,
        deletedCount,
      });
    }

    return NextResponse.json({ error: "Invalid storage action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Storage operation failed" }, { status: 500 });
  }
}

