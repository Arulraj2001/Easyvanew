import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Package, 
  CheckCircle2, 
  MapPin,
  ExternalLink 
} from "lucide-react";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Shipping & Delivery Policy | Easyva",
  description: "Learn about Easyva's express shipping rates, domestic transit timelines, 5-layer shockproof packaging, and insured courier delivery across India.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Shipping Policy", url: "/shipping-policy" },
  ]);

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* Header */}
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
              Safe & Timely Delivery Across India
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Detailed guidelines on order processing, express courier transit estimates, and protective packaging.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">24-48 Hr Dispatch</h4>
              <p className="text-[11px] text-slate-500">
                In-stock handmade items are packed and dispatched within 1-2 business days.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Free Above ₹999</h4>
              <p className="text-[11px] text-slate-500">
                All domestic orders with total value ₹999 or more qualify for 100% free delivery.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">100% Insured Transit</h4>
              <p className="text-[11px] text-slate-500">
                Fragile pottery, ceramics, and jewelry carry full breakage protection.
              </p>
            </div>
          </div>

          {/* Detailed Policy Text */}
          <div className="space-y-6 pt-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                1. Order Dispatch & Studio Handover
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Because Easyva creations are crafted in independent artisanal studios, items that are ready-to-ship are inspected and handed over to our express logistics partners within <strong>24 to 48 hours</strong> following order confirmation. Custom made-to-order canvas artwork or personalized pottery firings require an additional 3-5 business days for studio completion.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Domestic Delivery Timelines
              </h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                We partner with India&apos;s leading air express couriers (including Bluedart, Delhivery, DTDC, and Speed Post). Estimated transit durations:
              </p>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b font-bold text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Region / Destination</th>
                      <th className="py-2.5 px-3">Estimated Transit</th>
                      <th className="py-2.5 px-3">Carrier Partner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Tier 1 Metros (Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata)</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">2 – 3 Business Days</td>
                      <td className="py-2.5 px-3">Bluedart / Delhivery Express Air</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">Tier 2 & 3 Cities (State Capitals & Major Towns)</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">3 – 5 Business Days</td>
                      <td className="py-2.5 px-3">Delhivery / DTDC Express</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">North-East, Jammu & Kashmir, Island Territories</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">5 – 7 Business Days</td>
                      <td className="py-2.5 px-3">India Post Speed Post / Delhivery Surface</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. Shipping Fees & Free Delivery Threshold
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong>Prepaid Orders Above ₹999:</strong> 100% Free Express Delivery across India.
                </li>
                <li>
                  <strong>Orders Below ₹999:</strong> A nominal handling and packaging fee of ₹70 is applied at checkout.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                4. 5-Layer Protective Fragile Packaging
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Ceramic tableware, studio stoneware, resin decorative pieces, and fine jewelry are wrapped in multi-layer biodegradable honeycomb paper, encased in high-density corrugated foam, and boxed in rigid 5-ply cartons labeled with fragile transit warnings. Every shipment is covered by our breakage replacement guarantee.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                5. Tracking Your Parcel
              </h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                As soon as your parcel is scanned by our courier partner, you will receive an SMS and email notification with your Air Waybill (AWB) tracking number. You can track your shipment anytime via our real-time tracker:
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-easyva-purple-50 text-easyva-purple-700 font-bold rounded-xl border border-easyva-purple-200 text-xs hover:bg-easyva-purple-100 transition-colors"
              >
                <span>Track Your Order Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
