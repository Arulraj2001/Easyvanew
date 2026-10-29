import { NextResponse } from "next/server";
import { getCoupons, saveCoupon, deleteCoupon } from "@/lib/db";
import { Coupon } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const coupons = await getCoupons();

  if (code) {
    const matching = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase() && c.is_active
    );
    if (!matching) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }
    return NextResponse.json(matching);
  }

  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Coupon;
    if (!body.code || !body.discount_percent) {
      return NextResponse.json(
        { error: "Coupon code and discount percent are required" },
        { status: 400 }
      );
    }

    const saved = await saveCoupon({
      ...body,
      id: body.id || `cpn_${Date.now()}`,
      code: body.code.toUpperCase().trim(),
      discount_percent: Number(body.discount_percent),
      min_order_value: body.min_order_value ? Number(body.min_order_value) : 0,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id") || searchParams.get("code");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id || body.code;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Coupon ID or Code is required" },
        { status: 400 }
      );
    }

    await deleteCoupon(id);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
