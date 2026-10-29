import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Truck, Award, Zap } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import DealsRail from "@/components/DealsRail";
import PromoGrid from "@/components/PromoGrid";
import ProductCard from "@/components/ProductCard";
import HomeFaqAndHeritage from "@/components/HomeFaqAndHeritage";
import { getCategories, getProducts, getSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [categories, allProducts, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getSiteSettings(),
  ]);

  const featuredProducts = allProducts.filter((p) => p.is_featured);
  const jewelleryProducts = allProducts.filter((p) =>
    p.category_id.includes("jewellery") ||
    p.category_id.includes("necklaces") ||
    p.category_id.includes("earrings") ||
    p.category_id.includes("bracelets")
  );
  const artProducts = allProducts.filter((p) =>
    p.category_id.includes("paintings") ||
    p.category_id.includes("pottery") ||
    p.category_id.includes("resin") ||
    p.category_id.includes("art")
  );

  return (
    <div className="bg-[#F1F2F4] min-h-screen pb-16 space-y-3 sm:space-y-4">
      {/* 1. Flipkart-style Wide Panoramic Hero Banner Slider */}
      <HeroSlider banners={settings.hero_banners || []} />

      {/* 3. Flipkart-style "Deals of the Day" Rail with Live Countdown */}
      <DealsRail
        title="Artisan Deals of the Day"
        subtitle="Handcrafted studio specials refreshed daily. Direct from master artisan studios."
        products={featuredProducts.length > 0 ? featuredProducts : allProducts}
        viewAllLink="/category/all"
      />

      {/* 4. Flipkart-style 3-Column Curated Promo Cards */}
      <PromoGrid />

      {/* 5. "Best of Jewellery" Showcase Section (White Card Container) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Best of Fine Jewellery
                </h3>
                <span className="text-[10px] font-extrabold bg-easyva-purple-50 text-easyva-purple-700 px-2 py-0.5 rounded-full border border-easyva-purple-200">
                  925 Hallmarked
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic handcrafted gemstones, moonstone pendants & silver filigree
              </p>
            </div>
            <Link
              href="/category/jewellery"
              className="px-4 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {(jewelleryProducts.length > 0 ? jewelleryProducts : allProducts).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. "Art & Studio Pottery Highlights" Section (White Card Container) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Original Art, Pottery & Decor
                </h3>
                <span className="text-[10px] font-extrabold bg-easyva-teal-50 text-easyva-teal-700 px-2 py-0.5 rounded-full border border-easyva-teal-200">
                  One-of-a-Kind
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Masterpiece oil paintings, hand-thrown clay mugs & natural soy candles
              </p>
            </div>
            <Link
              href="/category/art-and-craft"
              className="px-4 py-2 bg-easyva-teal-700 hover:bg-easyva-teal-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {(artProducts.length > 0 ? artProducts : allProducts).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Flipkart-style Trust & Value Proposition Strip */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-easyva-purple-50 text-easyva-purple-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Handcrafted</h4>
              <p className="text-[10px] text-slate-400">Authentic maker pieces</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-easyva-teal-50 text-easyva-teal-700 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Direct Studio Craft</h4>
              <p className="text-[10px] text-slate-400">Authentic artisan studios</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-easyva-lime-50 text-easyva-lime-800 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Free Express Delivery</h4>
              <p className="text-[10px] text-slate-400">On orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-easyva-amber-50 text-easyva-amber-700 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Transit Insurance</h4>
              <p className="text-[10px] text-slate-400">100% breakage protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Heritage Craft Showcase, Testimonials, FAQ & Editorial SEO */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <HomeFaqAndHeritage />
      </section>
    </div>
  );
}
