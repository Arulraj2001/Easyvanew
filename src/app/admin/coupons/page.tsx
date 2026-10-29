"use client";

import React, { useState, useEffect } from "react";
import { 
  Tag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  X, 
  Loader2, 
  Percent, 
  ShoppingBag,
  Power
} from "lucide-react";
import { Coupon } from "@/lib/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_percent: 10,
    min_order_value: 499,
    is_active: true,
  });

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      alert("Please enter a valid coupon code");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create coupon");
      }

      setShowModal(false);
      setNewCoupon({
        code: "",
        discount_percent: 10,
        min_order_value: 499,
        is_active: true,
      });
      await loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...coupon,
          is_active: !coupon.is_active,
        }),
      });
      if (!res.ok) throw new Error("Failed to update coupon");
      await loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to toggle coupon");
    }
  };

  const handleDeleteCoupon = async (couponId: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) return;

    try {
      const res = await fetch(`/api/coupons?id=${couponId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
      await loadCoupons();
    } catch (err: any) {
      alert(err.message || "Failed to delete coupon");
    }
  };

  const activeCount = coupons.filter((c) => c.is_active).length;

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
        Loading discount coupons...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
              Marketing & Promotions
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-bold">{activeCount} of {coupons.length} Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-easyva-purple-600" />
            <span>Discount Coupons Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Create promotional coupon codes for patrons. Configure minimum cart values, percentage savings, and instant activation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid / List */}
      {coupons.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/90 space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-easyva-purple-600 flex items-center justify-center mx-auto">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active coupons yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first celebration coupon code (e.g. <code>FESTIVE15</code> or <code>FIRST10</code>) to reward your patrons.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl"
          >
            Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs space-y-3 flex flex-col justify-between transition-all ${
                coupon.is_active
                  ? "border-slate-200/90 hover:border-easyva-purple-300"
                  : "border-slate-200/50 opacity-60 bg-slate-50/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black tracking-wider text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {coupon.code}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      coupon.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        coupon.is_active ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <span>{coupon.is_active ? "Active" : "Disabled"}</span>
                  </span>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-baseline gap-1 text-2xl font-black text-easyva-purple-700">
                    <span>{coupon.discount_percent}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">OFF</span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {coupon.min_order_value && coupon.min_order_value > 0 ? (
                      <>Valid on orders of <strong>₹{coupon.min_order_value.toLocaleString("en-IN")}</strong> or above</>
                    ) : (
                      "No minimum order required"
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleCoupon(coupon)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    coupon.is_active
                      ? "text-slate-600 hover:bg-slate-100"
                      : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{coupon.is_active ? "Disable" : "Enable"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create New Coupon (Responsive: Bottom Sheet on Mobile / Centered on Desktop) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-easyva-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Create New Coupon
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI15 or ARTISAN20"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                    })
                  }
                  className="w-full bg-slate-50 uppercase tracking-wider font-mono p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:border-easyva-purple-500 focus:bg-white outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Letters & numbers only, no spaces. Automatically converted to uppercase.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={newCoupon.discount_percent}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discount_percent: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold focus:border-easyva-purple-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.min_order_value}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        min_order_value: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold focus:border-easyva-purple-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="coupon_active"
                  checked={newCoupon.is_active}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, is_active: e.target.checked })
                  }
                  className="rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                />
                <label htmlFor="coupon_active" className="text-slate-700 font-semibold cursor-pointer">
                  Activate coupon immediately upon saving
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white rounded-xl font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Coupon</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

