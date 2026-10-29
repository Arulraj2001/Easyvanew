"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Order } from "@/lib/types";

export default function TrackOrderPage() {
  const [lookupQuery, setLookupQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/orders");
      const allOrders: Order[] = await res.json();

      const clean = lookupQuery.trim().toLowerCase();
      const match = allOrders.find(
        (o) =>
          o.order_number.toLowerCase() === clean ||
          o.order_number.toLowerCase() === `ev-${clean}` ||
          o.customer_phone.includes(clean) ||
          o.id.toLowerCase() === clean
      );

      if (match) {
        setOrder(match);
      } else {
        setOrder(null);
        setErrorMsg("No order found matching that reference or phone number.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to tracking server.");
    } finally {
      setLoading(false);
    }
  };

  // Stepper Calculation
  const getStepStatus = (order: Order) => {
    const isPaid = order.payment_status === "VERIFIED" || order.payment_method === "COD";
    const isShipped = order.fulfillment_status === "SHIPPED" || order.fulfillment_status === "DELIVERED";
    const isDelivered = order.fulfillment_status === "DELIVERED";

    return [
      {
        title: "Order Placed",
        subtitle: `Ref #${order.order_number}`,
        completed: true,
      },
      {
        title: "Payment Verified",
        subtitle: order.payment_status === "VERIFIED" ? "Direct UPI Confirmed" : "Pending Verification",
        completed: isPaid,
      },
      {
        title: "Artisan Packing",
        subtitle: "Insured transit box",
        completed: isPaid || isShipped,
      },
      {
        title: "Dispatched",
        subtitle: order.tracking_number ? `AWB: ${order.tracking_number}` : "Courier assignment",
        completed: isShipped,
      },
      {
        title: "Delivered",
        subtitle: "Safe arrival",
        completed: isDelivered,
      },
    ];
  };

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-8 sm:py-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        {/* Search Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="text-center max-w-md mx-auto space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
              Live Order Tracker
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
              Track Your Artisan Creation
            </h1>
            <p className="text-xs text-slate-500">
              Enter your Order Number (e.g. <span className="font-mono font-bold text-slate-800">EV-123456</span>) or the Phone Number entered at checkout.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Order Number or Phone Number"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full text-xs p-3.5 pl-10 rounded-2xl border border-slate-200 focus:border-easyva-purple-600 focus:outline-none bg-slate-50 focus:bg-white font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Locating..." : "Track"}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center justify-center gap-1.5 max-w-lg mx-auto">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Order Reference</span>
                <h3 className="font-mono text-xl font-extrabold text-slate-900">
                  {order.order_number}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.payment_status === "VERIFIED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  Payment: {order.payment_status}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  Status: {order.fulfillment_status}
                </span>
              </div>
            </div>

            {/* Stepper Visualization */}
            <div className="py-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Fulfillment Progress
              </h4>
              <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
                {getStepStatus(order).map((step, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm z-10 transition-colors ${
                        step.completed
                          ? "bg-easyva-purple-600 text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900">{step.title}</div>
                      <div className="text-[10px] text-slate-400">{step.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking / Courier Info Banner */}
            {order.tracking_number && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Courier Tracking Number: <strong className="font-mono">{order.tracking_number}</strong></span>
                </div>
                <span className="text-[11px] font-bold text-blue-700">In Transit</span>
              </div>
            )}

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Recipient
                </span>
                <div className="font-bold text-slate-800">{order.customer_name}</div>
                <div className="text-slate-500">{order.customer_phone}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Delivery Destination
                </span>
                <div className="text-slate-700">
                  {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Ordered Creations ({order.items.length})
              </span>
              <div className="divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{item.product_title}</div>
                      <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{item.total_price.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Amount Paid</span>
                <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

