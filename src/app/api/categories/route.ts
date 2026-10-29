import { NextResponse } from "next/server";
import {
  getCategories,
  getAllCategoriesIncludingInactive,
  saveCategory,
  deleteCategory,
} from "@/lib/db";
import { Category } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "true";

  const categories = includeInactive
    ? await getAllCategoriesIncludingInactive()
    : await getCategories();

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Category;
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const saved = await saveCategory({
      ...body,
      id: body.id || `cat_${Date.now()}`,
      display_order: Number(body.display_order) || 1,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Category;
    if (!body.id || !body.name || !body.slug) {
      return NextResponse.json(
        { error: "ID, name, and slug are required" },
        { status: 400 }
      );
    }

    const saved = await saveCategory({
      ...body,
      display_order: Number(body.display_order) || 1,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
