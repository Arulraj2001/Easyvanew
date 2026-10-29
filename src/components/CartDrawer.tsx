"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and touch action when cart is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen || !mounted) return null;

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-overlay-fade"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-in Sheet from Right (Side drawer with backdrop visible on the left) */}
      <div className="fixed inset-y-0 right-0 w-[88vw] sm:w-[420px] max-w-md h-[100dvh] max-h-[100dvh] bg-white shadow-2xl z-10 flex flex-col overflow-hidden animate-drawer-right">
        {/* Pinned Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-easyva-purple-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Your Bag ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 shrink-0">
          <div className="text-xs font-medium text-slate-700 flex items-center justify-between mb-1">
            <span>
              {remainingForFreeShipping === 0 ? (
                <span className="text-easyva-lime-800 font-bold">
                  🎉 Free Express Delivery Unlocked!
                </span>
              ) : (
                <>Add ₹{remainingForFreeShipping.toLocaleString("en-IN")} more for <span className="font-bold text-easyva-purple-700">Free Shipping</span></>
              )}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
          {items.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-easyva-purple-50 text-easyva-purple-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-purple-50/50">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Your bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our handcrafted artisan collections and find something extraordinary.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="px-6 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 p-3 bg-slate-50/70 rounded-2xl border border-slate-100"
              >
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-100">
                  <Image
                    src={
                      item.product.images?.[0]?.image_url ||
                      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={item.product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      ₹{item.product.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-slate-100 text-slate-600 rounded-l-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-slate-100 text-slate-600 rounded-r-lg transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary (Safe-area bottom padding guarantees checkout button is never clipped) */}
        {items.length > 0 && (
          <div
            className="shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 font-mono">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className="font-semibold text-easyva-lime-800">
                  {remainingForFreeShipping === 0 ? "FREE" : "₹70"}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-extrabold pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="font-mono">
                  ₹{(totalPrice + (remainingForFreeShipping === 0 ? 0 : 70)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-easyva-purple-50/70 p-2.5 rounded-xl border border-easyva-purple-100">
              <ShieldCheck className="w-4 h-4 text-easyva-purple-600 flex-shrink-0" />
              <span>Authentic Artisan Guaranteed • 100% Insured Delivery</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-easyva-purple-600 via-easyva-purple-700 to-easyva-teal-700 hover:from-easyva-purple-700 hover:to-easyva-teal-800 text-white font-extrabold text-sm rounded-xl shadow-brand-soft hover:shadow-brand-glow transition-all active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
