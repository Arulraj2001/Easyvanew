"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  User,
  Package,
  MapPin,
  LogOut,
  Home,
  BookOpen
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Category, SiteSettings } from "@/lib/types";
import { isAdminEmail } from "@/lib/auth";

interface HeaderProps {
  categories?: Category[];
  settings?: SiteSettings;
}

export default function Header({ categories = [], settings }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { profile, user, signOut, openAuthModal } = useCustomerAuth();
  const isUserAdmin = isAdminEmail(profile?.email) || isAdminEmail(user?.email);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-mobile-menu-open", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const announcementText =
    settings?.announcement_bar ||
    "✨ Authentic Handcrafted Treasures • Free Delivery on Orders Above ₹999 • 100% Insured Transit";

  return (
    <div className="sticky top-0 z-40 w-full shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-easyva-purple-900 via-easyva-purple-800 to-easyva-teal-700 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-easyva-amber-400 animate-pulse" />
        <span>{announcementText}</span>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`transition-all duration-200 ${
          isScrolled
            ? "glass-panel shadow-brand-soft py-2"
            : "bg-white/98 backdrop-blur-md border-b border-slate-100 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-easyva-purple-600 md:hidden rounded-lg hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200 ring-2 ring-easyva-purple-400/40">
                  <Image
                    src="/easyva-logo.png"
                    alt="Easyva Logo"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-easyva-purple-700 via-easyva-purple-600 to-easyva-teal-600 bg-clip-text text-transparent">
                    easyva
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1 hidden sm:block">
                    Artisan & Decor
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-easyva-purple-600 hover:bg-easyva-purple-50 rounded-full transition-colors"
              >
                Home
              </Link>

              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(category.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-easyva-purple-600 hover:bg-easyva-purple-50 rounded-full transition-colors"
                  >
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </Link>

                  {/* Nested Subcategories Dropdown */}
                  {category.subcategories &&
                    category.subcategories.length > 0 &&
                    activeDropdown === category.id && (
                      <div className="absolute left-0 mt-1 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {category.name} Subcategories
                        </div>
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-easyva-purple-50 hover:text-easyva-purple-700 font-medium transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              <Link
                href="/blog"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-easyva-purple-600 hover:bg-easyva-purple-50 rounded-full transition-colors"
              >
                Artisan Blog
              </Link>
            </nav>

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center relative flex-1 max-w-xs"
            >
              <input
                type="text"
                placeholder="Search art, jewellery, decor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-easyva-purple-400 focus:outline-none transition-all duration-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Action Buttons: Customer Account, Admin Panel & Shopping Cart */}
            <div className="flex items-center gap-2">
              {/* Customer Account / Sign In */}
              {profile ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    aria-label="User Account Menu"
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-6 h-6 rounded-full object-cover border border-easyva-purple-300"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-easyva-purple-600 to-easyva-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {profile.full_name?.charAt(0).toUpperCase() || "P"}
                      </div>
                    )}
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                      {profile.full_name.split(" ")[0]}
                    </span>
                    <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {profile.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {profile.email}
                        </p>
                      </div>

                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-easyva-purple-50 hover:text-easyva-purple-700 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>My Orders & Live Tracking</span>
                      </Link>

                      <Link
                        href="/profile?tab=addresses"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-easyva-purple-50 hover:text-easyva-purple-700 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Saved Delivery Addresses</span>
                      </Link>

                      <Link
                        href="/profile?tab=profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-easyva-purple-50 hover:text-easyva-purple-700 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Personal Details</span>
                      </Link>

                      {isUserAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-easyva-purple-700 bg-purple-50 hover:bg-purple-100 font-bold transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-easyva-purple-700 bg-slate-100 hover:bg-easyva-purple-50 rounded-full transition-colors border border-transparent hover:border-easyva-purple-200"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Admin Link ONLY visible for authorized administrators */}
              {isUserAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-easyva-purple-700 bg-easyva-purple-50 hover:bg-easyva-purple-100 border border-easyva-purple-200 rounded-full transition-colors"
                  title="Open Store Admin Dashboard"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Shopping Bag Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-slate-700 hover:text-easyva-purple-600 hover:bg-easyva-purple-50 rounded-full transition-colors flex items-center justify-center"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Mounted directly to document.body to prevent containing block traps) */}
        {mounted && isMobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[95] md:hidden overflow-hidden">
            {/* Backdrop: dim background outside the drawer */}
            <div
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Sheet from Left */}
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-6 sm:pr-10">
              <div className="w-[85vw] max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-left duration-250">
                {/* Pinned Top Bar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2"
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
                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 bg-clip-text text-transparent">
                      easyva
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Drawer Body (pb-32 guarantees full bottom clearance) */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 pb-32 space-y-4 text-xs">
                  {/* Search Form */}
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search art, jewellery, decor..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-100 text-xs text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-transparent focus:border-easyva-purple-500 focus:bg-white outline-none font-medium placeholder-slate-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </form>

                  {/* Primary Nav Links */}
                  <div className="space-y-1">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Home className="w-4 h-4 text-easyva-purple-600" />
                      <span>Home</span>
                    </Link>

                    <Link
                      href="/blog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-easyva-purple-600" />
                        <span>Artisan Blog</span>
                      </span>
                      <span className="text-[10px] font-black uppercase text-easyva-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        Stories
                      </span>
                    </Link>
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block">
                      Curated Collections
                    </span>

                    <div className="space-y-1">
                      {categories.map((category) => (
                        <div key={category.id} className="space-y-1">
                          <Link
                            href={`/category/${category.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <span>{category.name}</span>
                          </Link>

                          {category.subcategories && category.subcategories.length > 0 && (
                            <div className="pl-4 ml-3 border-l-2 border-easyva-purple-100 space-y-0.5">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/category/${sub.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-easyva-purple-600 transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Access (strictly for authorized admin emails) */}
                  {isUserAdmin && (
                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
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

                  {/* Patron Account & Auth */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {profile ? (
                      <div className="space-y-1.5">
                        <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Signed In Patron
                          </span>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            {profile.full_name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {profile.email}
                          </div>
                        </div>

                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-easyva-purple-600 hover:bg-slate-50 rounded-xl"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>My Orders & Live Tracking</span>
                        </Link>

                        <Link
                          href="/profile?tab=addresses"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-easyva-purple-600 hover:bg-slate-50 rounded-xl"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Delivery Addresses</span>
                        </Link>

                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openAuthModal();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign In with Google</span>
                      </button>
                    )}
                  </div>

                  {/* Direct Concierge Support Footer */}
                  <div className="pt-2 text-[10px] text-slate-400 text-center space-y-0.5">
                    <p>Certified Tamil Nadu Artisan Guild</p>
                    <p className="font-mono text-slate-500">{settings?.support_email || "contact@easyva.in"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </header>
    </div>
  );
}

