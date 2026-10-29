"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const primaryImage =
    product.images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 hover:border-easyva-purple-200/80 shadow-sm hover:shadow-brand-soft transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 bg-easyva-lime-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* In-Stock or Low Stock Warning */}
        {product.stock <= 4 && product.stock > 0 && (
          <span className="absolute bottom-2.5 left-2.5 bg-easyva-amber-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-easyva-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current text-easyva-amber-500" />
              <span>{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
              <span className="text-slate-400 font-normal">
                ({product.reviews_count || 14})
              </span>
            </div>
            <span className="text-[11px] text-easyva-teal-700 font-medium bg-easyva-teal-50 px-2 py-0.5 rounded-md">
              100% Handcrafted
            </span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-easyva-purple-700 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.compare_at_price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Free Shipping</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center transition-all duration-200 ${
              isAdded
                ? "bg-easyva-lime-800 text-white"
                : "bg-easyva-purple-50 hover:bg-easyva-purple-600 text-easyva-purple-700 hover:text-white"
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdded ? (
              <Check className="w-4 h-4 animate-in zoom-in" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

