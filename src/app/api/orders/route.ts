import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus, deleteOrder, getSiteSettings } from "@/lib/db";
import { Order } from "@/lib/types";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customer_name || !body.customer_phone || !body.total_amount) {
      return NextResponse.json(
        { error: "Customer name, phone, and total amount are required." },
        { status: 400 }
      );
    }

    const settings = await getSiteSettings();
    if (body.payment_method === "COD" && settings.enable_cod === false) {
      return NextResponse.json(
        { error: "Cash on Delivery is currently disabled by store administration." },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `EV-${randomSuffix}`;

    const newOrder = await createOrder({
      order_number: orderNumber,
      customer_id: body.customer_id || undefined,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || "",
      shipping_address: body.shipping_address,
      shipping_city: body.shipping_city,
      shipping_pincode: body.shipping_pincode,
      shipping_state: body.shipping_state,
      total_amount: Number(body.total_amount),
      payment_method: body.payment_method || "DIRECT_UPI",
      utr_number: body.utr_number || "",
      utr_proof_image: body.utr_proof_image || "",
      payment_status: body.payment_status || "PENDING",
      fulfillment_status: "PENDING",
      notes: body.notes || "",
      items: body.items || [],
    });

    return NextResponse.json(newOrder);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, payment_status, fulfillment_status, tracking_number, utr_number, utr_proof_image } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, {
      payment_status,
      fulfillment_status,
      tracking_number,
      utr_number,
      utr_proof_image,
    });

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    await deleteOrder(id);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete order" },
      { status: 500 }
    );
  }
}

