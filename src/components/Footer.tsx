import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, MapPin, Truck, Phone, Mail } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.support_phone || "+91 8072 415 334";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const email = settings?.support_email || "muruganboutiqueandcosmetics@gmail.com";
  const address = settings?.store_address || "Coimbatore, Tamil Nadu - 641001, India";
  const instagramUrl = settings?.instagram_url || "https://instagram.com/easyva.artisan";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi Easyva! I would like to inquire about your handcrafted collections.")}`;

  return (
    <footer className="bg-slate-900 text-white pt-10 sm:pt-12 pb-28 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Footer Links Grid (2-Column on Mobile / 5-Column on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-4 sm:gap-8 mb-10">
          {/* Brand Info & Headquarters (Spans full 2 columns on mobile, 2 columns on desktop) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-easyva-purple-400 shadow-xs">
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
              Curated boutique for authentic handcrafted paintings, studio ceramics, pure 925 sterling silver jewellery, and bespoke living decor direct from master artisans.
            </p>

            {/* Headquarters & Contact Details */}
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-easyva-purple-400 shrink-0 mt-0.5" />
                <span>Headquarters: <strong className="text-white">{address}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-easyva-teal-400 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-easyva-teal-300 font-mono font-bold transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-easyva-purple-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-easyva-purple-300 font-mono text-slate-300 break-all transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Social Media Links: WhatsApp & Instagram */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Connect Directly With Us:
              </span>
              <div className="flex items-center gap-2.5 max-w-sm">
                {/* WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>

                {/* Instagram Profile Button */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 1 on Mobile: Collections */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-easyva-purple-400" />
              <span>Collections</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/category/art-and-craft" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Art & Craft
                </Link>
              </li>
              <li>
                <Link href="/category/jewellery" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Fine Jewellery
                </Link>
              </li>
              <li>
                <Link href="/category/home-accessories" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Home Accessories
                </Link>
              </li>
              <li>
                <Link href="/category/all" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 on Mobile: Orders & Help */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-easyva-teal-400" />
              <span>Orders & Help</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-easyva-teal-300 font-bold text-easyva-teal-400 flex items-center gap-1 transition-colors py-0.5">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Track Order</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/returns-refunds" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  About Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 1 on Mobile: Editorial & Legal */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-easyva-purple-400" />
              <span>Editorial & Legal</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-easyva-purple-400 hover:text-easyva-purple-300 font-bold transition-colors py-0.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Artisan Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-easyva-purple-300 transition-colors block py-0.5">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 on Mobile: Direct Bank Transfers & Payments */}
          <div className="col-span-1 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Direct Payment</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight">
              0% Gateway fees • 100% direct to artisan
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-200 pt-1">
              <span className="px-2 py-1 bg-slate-800 border border-slate-700/60 rounded-md">GPay</span>
              <span className="px-2 py-1 bg-slate-800 border border-slate-700/60 rounded-md">PhonePe</span>
              <span className="px-2 py-1 bg-slate-800 border border-slate-700/60 rounded-md">Paytm</span>
              <span className="px-2 py-1 bg-slate-800 border border-slate-700/60 rounded-md">BHIM</span>
              <span className="px-2 py-1 bg-purple-950/80 text-purple-300 border border-purple-800/60 rounded-md">UPI</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policy Links Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Easyva Artisan Crafts. Headquarters: Coimbatore, Tamil Nadu, India.</p>
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
