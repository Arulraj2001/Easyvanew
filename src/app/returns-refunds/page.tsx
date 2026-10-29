import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Mail,
  Phone
} from "lucide-react";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Returns, Replacements & Refund Policy | Easyva",
  description: "Read Easyva's transparent 7-day buyer protection, transit breakage replacement warranty, and direct UPI refund guidelines for handcrafted products.",
  alternates: {
    canonical: "/returns-refunds",
  },
};

export default function ReturnsRefundsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Returns & Refunds", url: "/returns-refunds" },
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
            <span className="text-[10px] uppercase font-black tracking-widest text-easyva-teal-700 bg-easyva-teal-50 px-3 py-1 rounded-full">
              Artisan Quality Assurance & Protection
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Returns, Replacements & Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear, transparent buyer protection for handcrafted goods. Effective for all orders placed on Easyva.
            </p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">100% Breakage Coverage</h4>
              <p className="text-[11px] text-slate-500">
                Transit insurance covers any damage occurring during courier transit.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">48-Hour Notice Window</h4>
              <p className="text-[11px] text-slate-500">
                Notify us with unboxing photos within 48 hours of parcel delivery.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Instant UPI Refunds</h4>
              <p className="text-[11px] text-slate-500">
                Approved refunds settle directly back to your source account within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Detailed Policy Clauses */}
          <div className="space-y-6 pt-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                1. Transit Damage & Defective Product Replacement
              </h2>
              <p className="text-slate-600 leading-relaxed mb-3">
                Handcrafted studio pottery, stoneware mugs, hand-painted canvases, and fine 925 sterling silver jewelry are securely packaged in 5-layer shockproof honeycomb wraps. In the uncommon event of courier transit damage:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  Take a clear photograph or brief unboxing video clip showing the outer shipping label and damaged item.
                </li>
                <li>
                  Email our support desk at <code className="text-easyva-purple-700 font-bold font-mono">muruganboutiqueandcosmetics@gmail.com</code> or WhatsApp our studio helpdesk at <code className="text-easyva-purple-700 font-bold font-mono">+91 8072 415 334</code> within <strong>48 hours</strong> of receipt.
                </li>
                <li>
                  Our artisan studio will dispatch an immediate replacement or process a 100% full refund at your discretion.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                2. Nature of Handcrafted Variations
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Because every item on Easyva is individually shaped, hand-glazed, or hand-painted by human artists, slight organic variations in glaze coloration, wood grain, brush texture, or natural gemstone veining are natural markers of authenticity rather than defects. We honor and celebrate these unique traits.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                3. Order Cancellation Prior to Dispatch
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Customers may cancel standard orders free of charge anytime prior to studio dispatch. Once an item has been handed over to courier logistics and an AWB tracking number is generated, cancellation in transit is not supported. Custom art commissions or bespoke personalized jewelry pieces cannot be cancelled once production begins.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">
                4. Refund Timelines & Settlement
              </h2>
              <p className="text-slate-600 leading-relaxed">
                For prepaid UPI orders, refunds are credited directly back into your originating bank account or UPI VPA within <strong>24 to 48 business hours</strong> following claim approval. No hidden deduction or processing surcharge is applied.
              </p>
            </div>
          </div>

          {/* Contact Support Helpbox */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Need Help with an Order?</h4>
              <p className="text-xs text-slate-500">
                Our customer care team is available Monday to Saturday, 9:30 AM to 6:30 PM IST.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Contact Helpdesk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
