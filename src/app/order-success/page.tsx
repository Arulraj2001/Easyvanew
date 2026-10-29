"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "EV-PENDING";
  const utr = searchParams.get("utr");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 animate-in zoom-in">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-easyva-purple-50 text-easyva-purple-700 text-xs font-bold rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Artisan Community Thank You</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Order Successfully Placed!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We have received your order. Thank you for supporting authentic indie craftsmanship and heritage Indian studio artists.
        </p>
      </div>

      {/* Order Summary Pill */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left max-w-md mx-auto space-y-3 text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-500">Order Number</span>
          <span className="font-mono font-bold text-slate-900 text-sm">{orderNumber}</span>
        </div>
        {utr && (
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-500">Submitted UPI UTR</span>
            <span className="font-mono font-bold text-easyva-purple-700">{utr}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Dispatch Status</span>
          <span className="font-semibold text-easyva-amber-700 bg-easyva-amber-50 px-2.5 py-0.5 rounded-full">
            Readying for Dispatch
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-easyva-teal-600" />
        <span>Tracking SMS will be sent as soon as the courier scans your package.</span>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-full shadow-md transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

