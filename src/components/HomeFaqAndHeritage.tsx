"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Palette, 
  Gem, 
  Flame, 
  Heart,
  CheckCircle2,
  Award,
  Truck
} from "lucide-react";

export default function HomeFaqAndHeritage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How is fragile studio pottery and glassware safely packed for delivery?",
      answer:
        "Every ceramic mug, vase, and glass creation is wrapped in 5 layers of eco-friendly honeycomb paper cushioning, enclosed in custom high-density corner molds, and boxed in rigid 5-ply corrugated cartons. All packages carry fragile cautionary markers and full transit insurance coverage.",
    },
    {
      question: "Is the silver jewellery on Easyva pure 925 sterling silver?",
      answer:
        "Yes, absolutely. All silver jewellery crafted by our partner silversmiths is guaranteed pure 92.5% sterling silver (BIS 925 standard). Pieces feature authentic studio stamps and undergo purity testing prior to catalog listing.",
    },
    {
      question: "How does the Direct UPI payment option work?",
      answer:
        "When placing your order, you can choose Direct UPI. On mobile, you can tap to instantly open Google Pay, PhonePe, Paytm, or BHIM with our verified VPA pre-filled. On desktop, simply scan the dynamic QR code on your screen and input your 12-digit UTR reference number.",
    },
    {
      question: "Can I commission custom paintings or bespoke dimensions?",
      answer:
        "Yes! Many of our indie painters and ceramicists accept bespoke commissions. You can contact our artisan concierge at contact@easyva.in or through our Contact page with your requested dimensions, color palettes, and themes.",
    },
    {
      question: "What is your return policy if an item arrives damaged?",
      answer:
        "We offer a 100% damage replacement guarantee. Simply share an unboxing photo or short video clip within 48 hours of receipt via WhatsApp or email, and our studio will arrange a free replacement or instant full refund.",
    },
  ];

  const testimonials = [
    {
      name: "Ananya Deshmukh",
      city: "Bengaluru",
      rating: 5,
      review:
        "The hand-thrown stoneware coffee mugs arrived in bulletproof packaging! The glaze depth is breathtaking—you can feel the artisan's thumb indentations. Truly museum quality.",
      item: "Ocean Waves Stoneware Mug",
    },
    {
      name: "Rohit Varma",
      city: "Mumbai",
      rating: 5,
      review:
        "Bought a 925 sterling silver filigree pendant for my anniversary. The intricate wirework is phenomenal, and paying via direct UPI was seamless and instant.",
      item: "Silver Filigree Mandala Pendant",
    },
    {
      name: "Dr. Meenakshi Sundaram",
      city: "Chennai",
      rating: 5,
      review:
        "The lavender & vanilla soy candle has the cleanest, purest scent throw. No synthetic chemical headache. Supporting indie Indian makers makes it even sweeter.",
      item: "Organic Soy Aromatherapy Candle",
    },
  ];

  return (
    <div className="space-y-10 pt-6">
      {/* 1. Indian Craft Traditions Showcase */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
            Devotion in Every Stroke & Fire
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Indian Craft Traditions & Studio Soul
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Slow, deliberate craftsmanship passed down across generations. Here are the core disciplines celebrated on Easyva:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-easyva-purple-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Fine Canvas Art</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Original impasto oils and acrylic textures on archival primed linen canvas, individually signed by indie studio painters.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-easyva-teal-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Studio Stoneware</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wheel-thrown clay tableware fired at 1220°C for exceptional strength, coated in lead-free food-safe mineral glazes.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-easyva-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">925 Pure Silver</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hereditary filigree wire manipulation and raw semi-precious bezel settings meeting strict BIS 925 Hallmark standards.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 hover:border-easyva-lime-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Natural Botanicals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hand-poured 100% organic soy wax infused with cold-pressed essential oils and unbleached lead-free cotton wicks.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Verified Patron Reviews */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs font-black text-slate-800 ml-1.5">
                4.9 / 5.0 Studio Rating
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Words From Our Patrons
            </h2>
            <p className="text-xs text-slate-500">
              Verified reviews from homes across India celebrating handmade artistry.
            </p>
          </div>

          <Link
            href="/category/all"
            className="text-xs font-bold text-easyva-purple-600 hover:text-easyva-purple-800 self-start sm:self-center"
          >
            Explore All Creations →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <div>
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-slate-400">{t.city}</div>
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-md">
                  {t.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FAQ Accordion */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-easyva-teal-800 bg-easyva-teal-50 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about purchasing authentic handmade creations on Easyva.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 gap-4 hover:text-easyva-purple-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-easyva-purple-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SEO Deep Content / Knowledge Base */}
      <section className="bg-slate-100/70 rounded-2xl p-6 sm:p-8 border border-slate-200 text-xs text-slate-600 space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Easyva: India&apos;s Direct Studio Handcrafted Destination
        </h3>
        <p className="leading-relaxed">
          Easyva is dedicated to revitalizing India&apos;s celebrated artisanal traditions. By connecting mindful collectors directly with hereditary potters, master silversmiths, oil painters, and botanical candle crafters, we preserve indigenous craft lineages while ensuring patrons receive certified authentic items.
        </p>
        <p className="leading-relaxed">
          From <strong>Tarkashi filigree sterling silver jewellery</strong> hallmarked to 925 standards, to <strong>high-fired stoneware pottery</strong> coated in food-safe lead-free glazes, every piece is inspected for quality and wrapped in 5-layer shockproof protective packaging. Enjoy free express shipping across all Indian pincodes on orders above ₹999 with 100% transit insurance.
        </p>
      </section>
    </div>
  );
}

