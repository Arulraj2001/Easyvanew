import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, SlidersHorizontal, MapPin, Truck, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-easyva-purple-400">
                <Image
                  src="/easyva-logo.png"
                  alt="Easyva Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-easyva-purple-400 to-easyva-teal-400 bg-clip-text text-transparent">
                easyva
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Curated boutique for authentic handcrafted paintings, studio ceramics, pure 925 sterling silver jewellery, and bespoke living decor directly from master artisans.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full text-xs text-easyva-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Authentic Studio Sourced • 100% Insured Delivery</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/category/art-and-craft" className="hover:text-easyva-purple-300 transition-colors">
                  Art & Craft
                </Link>
              </li>
              <li>
                <Link href="/category/jewellery" className="hover:text-easyva-purple-300 transition-colors">
                  Fine Jewellery
                </Link>
              </li>
              <li>
                <Link href="/category/home-accessories" className="hover:text-easyva-purple-300 transition-colors">
                  Home Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/all" className="hover:text-easyva-purple-300 transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Tracking */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Orders & Help
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-easyva-teal-300 font-semibold text-easyva-teal-400 flex items-center gap-1 transition-colors">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-easyva-purple-300 transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-easyva-purple-300 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-easyva-purple-300 transition-colors">
                  Contact & Grievance
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-easyva-purple-300 transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Direct UPI Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Editorial & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-easyva-purple-400 hover:text-easyva-purple-300 font-semibold transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artisan Stories & Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-easyva-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-easyva-purple-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-slate-500 block mb-1">Direct Bank Transfers:</span>
                <div className="flex flex-wrap gap-1 text-[10px] font-bold text-slate-300">
                  <span className="px-2 py-0.5 bg-slate-800 rounded">GPay</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded">PhonePe</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded">Paytm</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded">BHIM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Easyva. Handcrafted with devotion.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:underline">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
