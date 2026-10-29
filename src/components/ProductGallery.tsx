"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  discountPercent?: number | null;
}

export default function ProductGallery({
  images,
  title,
  discountPercent,
}: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // If no images or only 1 image, generate fallback viewpoints
  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: "default",
            image_url:
              "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
            display_order: 1,
          },
        ];

  const activeImage = displayImages[activeIdx]?.image_url || displayImages[0]?.image_url;

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {/* Thumbnails Rail (Vertical on tablet/desktop, horizontal on mobile) */}
      {displayImages.length > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[460px] scrollbar-none flex-shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-slate-50 flex-shrink-0 transition-all ${
                activeIdx === idx
                  ? "border-easyva-purple-600 ring-2 ring-easyva-purple-500/20"
                  : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Hero Active Image */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex-1">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          priority
          className="object-cover object-center transition-all duration-300"
        />

        {discountPercent && (
          <span className="absolute top-3 left-3 bg-easyva-lime-800 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
            SAVE {discountPercent}%
          </span>
        )}
      </div>
    </div>
  );
}

