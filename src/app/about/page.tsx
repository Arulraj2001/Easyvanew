import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Award, 
  Palette, 
  Gem, 
  Compass, 
  CheckCircle2, 
  Check 
} from "lucide-react";
import { generateBreadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export const metadata = {
  title: "About Easyva | Indian Artisan Heritage & Mindful Studio Craft",
  description: "Discover how Easyva bridges discerning patrons with master Indian potters, silversmiths, canvas artists, and heritage craft studios with authentic quality and insured delivery.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "About Easyva", url: "/about" },
  ]);

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
              Artisan Provenance & Studio Philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              The Soul of Handmade: About Easyva
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Connecting indie pottery masters, hereditary silversmiths, canvas painters, and conscious craft studios with patrons across India.
            </p>
          </div>

          {/* Core Story */}
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p className="text-base font-semibold text-slate-900 leading-snug">
              In an era dominated by fleeting machine-made plastics and automated assembly lines, <strong className="text-easyva-purple-700">Easyva</strong> was founded on a simple truth: genuine human art cannot be synthesized.
            </p>
            <p>
              Each stroke of oil paint on Belgian linen canvas, each ceramic mug thrown on a kick-wheel, each fine 925 sterling silver chain woven with delicate filigree wire carries the devotion, muscle memory, and ancestral wisdom of an independent maker.
            </p>
            <p>
              Easyva is not an anonymous commodity aggregator. We curate independent artisan studios from Rajasthan, Kashmir, Bengal, Tamil Nadu, and Karnataka—ensuring that their craft is celebrated with museum-grade presentation, fair compensation, and dependable express delivery across India.
            </p>
          </div>

          {/* Pillars of Integrity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-100/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Authentic Provenance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero mass imports. Every collection is individually inspected for material purity, archival quality, and handcraft authenticity.
              </p>
            </div>

            <div className="p-5 bg-teal-50/60 rounded-2xl border border-teal-100/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Direct Studio Sourcing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By purchasing directly from studio creators, patrons receive certified artisan pieces without inflated retail markups.
              </p>
            </div>

            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-100/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">100% Insured Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fragile pottery and jewellery travel in 5-layer shockproof honeycomb cushioning backed by guaranteed damage transit insurance.
              </p>
            </div>
          </div>

          {/* Heritage Craft Spotlight */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Preserving Indian Craft Heritage
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              India boasts over 3,000 distinct regional craft disciplines, many passed down across dozens of generations. Easyva actively nurtures:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>High-Fired Stoneware Pottery:</strong> Non-toxic, lead-free food-safe glazes fired at 1220°C for exceptional durability.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Tarkashi & Filigree Silver:</strong> Genuine BIS 925 Hallmarked sterling silver with handcrafted bezel gemstone settings.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Botanical Aromatherapy:</strong> Organic soy wax infused with cold-pressed pure Indian essential oils and lead-free cotton wicks.</span>
              </li>
              <li className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Original Fine Art:</strong> Multi-layered oil and acrylic on stretched canvas signed directly by indie visual artists.</span>
              </li>
            </ul>
          </div>

          {/* Studio Guarantee Banner */}
          <div className="p-5 bg-gradient-to-r from-easyva-purple-50 via-purple-50 to-teal-50 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-easyva-purple-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  The Easyva Artisan Promise
                </h4>
                <p className="text-[11px] text-slate-600">
                  Every order directly sustains independent livelihoods and keeps traditional craft lineages alive.
                </p>
              </div>
            </div>
            <Link
              href="/category/all"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-xs"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
