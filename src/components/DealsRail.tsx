"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronLeft, ChevronRight, ArrowRight, Zap, Star } from "lucide-react";
import { Product } from "@/lib/types";

interface DealsRailProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export default function DealsRail({
  title = "Deals of the Day",
  subtitle = "Handcrafted artisan originals at limited celebration prices",
  products,
  viewAllLink = "/category/all",
}: DealsRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 24, seconds: 48 });

  // Live countdown timer for authentic urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 my-4 sm:my-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 sm:p-5 flex flex-col md:flex-row gap-4 items-stretch">
        {/* Flipkart-style Left Promo Card */}
        <div className="w-full md:w-64 flex-shrink-0 bg-gradient-to-br from-easyva-purple-900 via-easyva-purple-800 to-easyva-teal-900 rounded-xl p-5 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-easyva-teal-500/20 rounded-full blur-2xl" />

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-extrabold tracking-wide uppercase text-easyva-teal-300 backdrop-blur-md">
              <Zap className="w-3 h-3 text-easyva-amber-400 fill-current" />
              <span>Limited Time</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              {title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {subtitle}
            </p>

            {/* Countdown Badge */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Offer Ends In:
              </span>
              <div className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-easyva-amber-400" />
                <span>
                  {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 relative z-10">
            <Link
              href={viewAllLink}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-950 text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span>VIEW ALL DEALS</span>
              <ArrowRight className="w-3.5 h-3.5 text-easyva-purple-700" />
            </Link>
          </div>
        </div>

        {/* Product Horizontal Rail */}
        <div className="flex-1 min-w-0 relative overflow-hidden rounded-xl">
          {/* Scroll Chevrons */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 inset-y-0 my-auto h-12 w-8 bg-white/95 border border-slate-200 shadow-md rounded-r-lg items-center justify-center z-10 text-slate-700 hover:text-easyva-purple-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 inset-y-0 my-auto h-12 w-8 bg-white/95 border border-slate-200 shadow-md rounded-l-lg items-center justify-center z-10 text-slate-700 hover:text-easyva-purple-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-none h-full py-1 px-1"
          >
            {products.map((product) => {
              const discountPercent =
                product.compare_at_price && product.compare_at_price > product.price
                  ? Math.round(
                      ((product.compare_at_price - product.price) /
                        product.compare_at_price) *
                        100
                    )
                  : null;

              const img =
                product.images?.[0]?.image_url ||
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80";

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="w-44 sm:w-48 flex-shrink-0 flex flex-col justify-between p-3 rounded-xl border border-slate-100 hover:border-easyva-purple-300 hover:shadow-brand-soft bg-white transition-all duration-200 group text-center"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-2">
                    <Image
                      src={img}
                      alt={product.title}
                      fill
                      sizes="192px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discountPercent && (
                      <span className="absolute top-1.5 left-1.5 bg-easyva-lime-800 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-easyva-purple-700 transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{product.compare_at_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-easyva-teal-700 font-semibold block mt-0.5">
                      Direct Artisan Maker
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

