import { NextResponse } from "next/server";
import { 
  getOrdersByCustomer, 
  getCustomerAddresses, 
  saveCustomerAddress, 
  deleteCustomerAddress 
} from "@/lib/db";
import { CustomerAddress } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lookup = searchParams.get("lookup");

    if (!lookup) {
      return NextResponse.json({ error: "Lookup email or customer ID is required" }, { status: 400 });
    }

    const [orders, addresses] = await Promise.all([
      getOrdersByCustomer(lookup),
      getCustomerAddresses(lookup),
    ]);

    return NextResponse.json({ orders, addresses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load customer data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, address, addressId, customerId } = body;

    if (action === "save_address" && address) {
      const addressData: CustomerAddress = {
        ...address,
        id: address.id || `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        customer_id: customerId || address.customer_id || "guest",
      };
      const saved = await saveCustomerAddress(addressData);
      const addresses = await getCustomerAddresses(addressData.customer_id!);
      return NextResponse.json({ success: true, saved, addresses });
    }

    if (action === "delete_address" && addressId) {
      await deleteCustomerAddress(addressId);
      const addresses = customerId ? await getCustomerAddresses(customerId) : [];
      return NextResponse.json({ success: true, addresses });
    }

    if (action === "set_default_address" && addressId && customerId) {
      const currentAddresses = await getCustomerAddresses(customerId);
      for (const addr of currentAddresses) {
        await saveCustomerAddress({
          ...addr,
          is_default: addr.id === addressId,
        });
      }
      const updated = await getCustomerAddresses(customerId);
      return NextResponse.json({ success: true, addresses: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process customer action" }, { status: 500 });
  }
}

