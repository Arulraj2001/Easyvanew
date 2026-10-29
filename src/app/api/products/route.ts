import { NextResponse } from "next/server";
import { getProducts, saveProduct, deleteProduct } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") || undefined;
  const isFeatured = searchParams.get("featured") === "true" ? true : undefined;
  const searchQuery = searchParams.get("q") || undefined;

  const products = await getProducts({
    categorySlug,
    isFeatured,
    searchQuery,
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Product;
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const saved = await saveProduct({
      ...body,
      id: body.id || `prod_${Date.now()}`,
      slug,
      price: Number(body.price),
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : undefined,
      stock: Number(body.stock) || 0,
      rating: body.rating || 5.0,
      reviews_count: body.reviews_count || 0,
      is_featured: Boolean(body.is_featured),
      is_published: body.is_published ?? true,
      images: body.images || [],
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

