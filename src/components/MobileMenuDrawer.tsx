"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Search,
  Home,
  BookOpen,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Package,
  MapPin,
  LogOut,
  User,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Category, SiteSettings } from "@/lib/types";
import { isAdminEmail } from "@/lib/auth";

interface MobileMenuDrawerProps {
  categories?: Category[];
  settings?: SiteSettings;
}

export default function MobileMenuDrawer({
  categories = [],
  settings,
}: MobileMenuDrawerProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const isMobileMenuOpen = useCartStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useCartStore((state) => state.closeMobileMenu);

  const { profile, user, signOut, openAuthModal } = useCustomerAuth();
  const isUserAdmin = isAdminEmail(profile?.email) || isAdminEmail(user?.email);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile drawer is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMobileMenuOpen]);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMobileMenu();
    }
  };

  if (!mounted || !isMobileMenuOpen) return null;

  const supportPhone = settings?.support_phone || "+91 8072 415 334";
  const supportEmail = settings?.support_email || "muruganboutiqueandcosmetics@gmail.com";
  const cleanPhone = supportPhone.replace(/[^0-9]/g, "");

  return createPortal(
    <div
      className="fixed inset-0 z-[95] md:hidden overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-overlay-fade"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Slide-in Sheet from Left */}
      <div className="fixed inset-y-0 left-0 w-[310px] sm:w-[360px] max-w-[85vw] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl z-10 flex flex-col overflow-hidden animate-drawer-left">
        {/* Pinned Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-easyva-purple-400">
              <Image
                src="/easyva-logo.png"
                alt="Easyva"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-easyva-purple-700 via-easyva-purple-600 to-easyva-teal-600 bg-clip-text text-transparent">
                easyva
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-0.5">
                Artisan Store
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body with safe bottom padding */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs overscroll-contain">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search art, jewellery, decor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-xs text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-transparent focus:border-easyva-purple-500 focus:bg-white outline-none font-medium placeholder-slate-400 shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* Primary Nav Links */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-purple-50 hover:text-easyva-purple-700 rounded-xl transition-colors"
            >
              <Home className="w-4 h-4 text-easyva-purple-600" />
              <span>Home</span>
            </Link>

            <Link
              href="/blog"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-2.5 text-sm font-bold text-slate-800 hover:bg-purple-50 hover:text-easyva-purple-700 rounded-xl transition-colors"
            >
              <span className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-easyva-purple-600" />
                <span>Artisan Blog</span>
              </span>
              <span className="text-[10px] font-black uppercase text-easyva-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Stories
              </span>
            </Link>
          </div>

          {/* Curated Collections / Categories Accordion */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Curated Collections
              </span>
              <Link
                href="/category/all"
                onClick={closeMobileMenu}
                className="text-[11px] font-bold text-easyva-purple-600 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-1">
              {categories.map((category) => {
                const hasSubs = category.subcategories && category.subcategories.length > 0;
                const isExpanded = !!expandedCategories[category.id];

                return (
                  <div key={category.id} className="rounded-xl overflow-hidden border border-slate-100/80 bg-slate-50/50">
                    <div className="flex items-center justify-between pr-2">
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={closeMobileMenu}
                        className="flex-1 px-3 py-2.5 text-xs font-bold text-slate-800 hover:text-easyva-purple-700 transition-colors"
                      >
                        {category.name}
                      </Link>

                      {hasSubs && (
                        <button
                          type="button"
                          onClick={() => toggleCategoryExpand(category.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                          aria-label={`Toggle ${category.name} subcategories`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-easyva-purple-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {hasSubs && isExpanded && (
                      <div className="bg-white px-3 py-2 border-t border-slate-100 space-y-1">
                        {category.subcategories!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            onClick={closeMobileMenu}
                            className="block px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-easyva-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Control Center (Strictly for Authorized Admin Emails) */}
          {isUserAdmin && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-easyva-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl border border-easyva-purple-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-easyva-purple-600" />
                  <span>Admin Control Center</span>
                </span>
                <span className="text-[9px] bg-easyva-purple-600 text-white px-1.5 py-0.5 rounded font-black">
                  STAFF
                </span>
              </Link>
            </div>
          )}

          {/* Patron Account Area */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {profile ? (
              <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-easyva-purple-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-easyva-purple-600 to-easyva-teal-600 text-white text-xs font-bold flex items-center justify-center">
                      {profile.full_name?.charAt(0).toUpperCase() || "P"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {profile.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {profile.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <Link
                    href="/profile?tab=orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-easyva-purple-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-easyva-purple-500" />
                    <span>My Orders & Live Tracking</span>
                  </Link>

                  <Link
                    href="/profile?tab=addresses"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-easyva-purple-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-easyva-teal-500" />
                    <span>Saved Delivery Addresses</span>
                  </Link>

                  <button
                    onClick={() => {
                      closeMobileMenu();
                      signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-easyva-purple-600 via-easyva-purple-700 to-easyva-teal-700 hover:from-easyva-purple-700 hover:to-easyva-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>

          {/* Concierge Support Footer */}
          <div className="pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-2xl text-[10px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <Sparkles className="w-3 h-3 text-easyva-purple-600" />
              <span>Certified Tamil Nadu Artisan Guild</span>
            </div>
            <p className="text-slate-400">Studio HQ: Coimbatore, Tamil Nadu - 641001</p>

            <div className="pt-1 space-y-1">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 hover:underline font-bold"
              >
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>WhatsApp: {supportPhone}</span>
              </a>
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2 text-easyva-purple-700 hover:underline font-mono truncate"
              >
                <Mail className="w-3 h-3 text-easyva-purple-500" />
                <span>{supportEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
