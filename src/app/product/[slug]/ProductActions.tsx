"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Zap, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-700">Quantity</span>
        <div className="flex items-center border border-slate-200 bg-white rounded-xl shadow-sm">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 rounded-l-xl transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
            disabled={isOutOfStock || quantity >= product.stock}
            className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 rounded-r-xl transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs text-slate-400">
          ({product.stock} available in studio)
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all duration-200 ${
            isAdded
              ? "bg-easyva-lime-800 text-white border-easyva-lime-800"
              : "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 animate-in zoom-in" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-easyva-purple-600" />
              <span>Add to Bag</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 hover:from-easyva-purple-700 hover:to-easyva-teal-700 text-white shadow-brand-soft transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 text-easyva-amber-300" />
          <span>Direct UPI Buy Now</span>
        </button>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-14 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 flex items-center gap-2 shadow-2xl">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-easyva-purple-600" />
          <span>Add to Bag</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Zap className="w-4 h-4 text-easyva-amber-300" />
          <span>Direct UPI Buy Now</span>
        </button>
      </div>
    </div>
  );
}

