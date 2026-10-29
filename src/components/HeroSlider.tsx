"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { HeroBanner } from "@/lib/types";

interface HeroSliderProps {
  banners: HeroBanner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!banners || banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners, isPaused]);

  if (!banners || banners.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div
      className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 my-2 sm:my-3 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Flipkart-style Wide Aspect Container (16:5 Desktop / 16:9 Mobile) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-slate-900">
        {banners.map((banner, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image */}
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 1380px"
                priority={idx === 0}
                className="object-cover object-center brightness-[0.55]"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />

              {/* Content Box */}
              <div className="relative z-20 h-full flex flex-col justify-center max-w-xl px-6 sm:px-12 md:px-16 text-white space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-easyva-purple-500/20 border border-easyva-purple-400/40 rounded-full text-easyva-purple-300 text-[10px] sm:text-xs font-bold backdrop-blur-md self-start">
                  <Sparkles className="w-3 h-3 text-easyva-amber-400" />
                  <span>Artisan Curated Drop</span>
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white line-clamp-2">
                  {banner.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 hidden xs:block max-w-md">
                  {banner.subtitle}
                </p>

                <div className="pt-1">
                  <Link
                    href={banner.cta_link || "/category/all"}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <span>{banner.cta_text || "Shop Now"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-easyva-purple-700" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Flipkart-style Left & Right Chevrons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 inset-y-0 my-auto h-16 sm:h-20 w-8 sm:w-10 bg-white/70 hover:bg-white text-slate-800 rounded-r-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 shadow-md backdrop-blur-sm"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 inset-y-0 my-auto h-16 sm:h-20 w-8 sm:w-10 bg-white/70 hover:bg-white text-slate-800 rounded-l-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 shadow-md backdrop-blur-sm"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
