import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

