import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PromoGrid() {
  const promos = [
    {
      title: "Art & Studio Pottery",
      highlight: "Min 30% Off",
      subtitle: "Hand-thrown ceramics & original canvas art",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
      link: "/category/art-and-craft",
      badgeColor: "bg-easyva-purple-600",
    },
    {
      title: "Fine Sterling Silver",
      highlight: "Under ₹1,999",
      subtitle: "BIS 925 hallmarked moonstone & filigree jewellery",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      link: "/category/jewellery",
      badgeColor: "bg-easyva-teal-700",
    },
    {
      title: "Living & Aromatherapy",
      highlight: "Special Drops",
      subtitle: "Organic soy wax candles & bohemian macramé",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      link: "/category/home-accessories",
      badgeColor: "bg-easyva-lime-800",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 my-4 sm:my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {promos.map((promo, idx) => (
          <Link
            key={idx}
            href={promo.link}
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200/80 flex flex-col justify-end p-5"
          >
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center brightness-[0.90] group-hover:scale-105 group-hover:brightness-[0.95] transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent" />

            <div className="relative z-10 space-y-1.5">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider ${promo.badgeColor}`}
              >
                {promo.highlight}
              </span>
              <h4 className="text-lg font-extrabold text-white tracking-tight">
                {promo.title}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {promo.subtitle}
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-easyva-teal-300 group-hover:text-white transition-colors">
                <span>Explore Selection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

