"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  ShoppingBag,
  Settings,
  Store,
  Zap,
  ExternalLink,
  BookOpen,
  HardDrive,
  LogOut,
  Sparkles,
  Tag,
  Menu,
  X,
  MoreHorizontal
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useCustomerAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const handleAdminLogout = async () => {
    localStorage.removeItem("easyva_admin_token");
    localStorage.removeItem("easyva_admin_email");
    await signOut();
    router.replace("/admin/login");
  };

  const navSections = [
    {
      title: "Store Management",
      links: [
        {
          href: "/admin",
          label: "Dashboard Overview",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: "/admin/orders",
          label: "Orders & Verification",
          icon: ShoppingBag,
          exact: false,
        },
        {
          href: "/admin/products",
          label: "Products & Inventory",
          icon: Package,
          exact: false,
        },
        {
          href: "/admin/categories",
          label: "Categories & Tree",
          icon: Layers,
          exact: false,
        },
      ],
    },
    {
      title: "Storefront & Marketing",
      links: [
        {
          href: "/admin/banners",
          label: "Hero Banners",
          icon: Sparkles,
          exact: false,
        },
        {
          href: "/admin/coupons",
          label: "Discount Coupons",
          icon: Tag,
          exact: false,
        },
        {
          href: "/admin/blog",
          label: "Artisan Blog & Stories",
          icon: BookOpen,
          exact: false,
        },
        {
          href: "/admin/storage",
          label: "Media Storage (1GB)",
          icon: HardDrive,
          exact: false,
        },
      ],
    },
    {
      title: "Configuration",
      links: [
        {
          href: "/admin/settings",
          label: "Store Settings & UPI",
          icon: Settings,
          exact: false,
        },
      ],
    },
  ];

  const bottomNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
    { href: "/admin/products", label: "Products", icon: Package, exact: false },
    { href: "/admin/blog", label: "Blog", icon: BookOpen, exact: false },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE TOP STICKY APP BAR (Phone screens < 768px)                      */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-easyva-purple-500 shadow-2xs">
            <Image
              src="/easyva-logo.png"
              alt="Easyva Logo"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 leading-tight">easyva</span>
              <span className="text-[9px] font-extrabold text-easyva-purple-700 bg-easyva-purple-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Admin
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Direct UPI • Live
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
            title="View Live Storefront"
          >
            <Store className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline">Store</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileDrawerOpen ? (
              <X className="w-5 h-5 text-slate-800" />
            ) : (
              <Menu className="w-5 h-5 text-slate-800" />
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER MENU (Phone screens < 768px)                  */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200 z-10">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-easyva-purple-500">
                    <Image
                      src="/easyva-logo.png"
                      alt="Easyva Logo"
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-900 block leading-tight">
                      Control Menu
                    </span>
                    <span className="text-[10px] text-easyva-purple-600 font-bold">
                      Full Navigation
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Operational Status Pill */}
              <div className="px-3 py-2 bg-purple-50/80 border border-purple-200/70 rounded-xl text-[11px] text-purple-900 font-medium flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Direct UPI Active • Zero Fees</span>
              </div>

              {/* Navigation Sections */}
              <nav className="space-y-4">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block">
                      {section.title}
                    </span>

                    <div className="space-y-0.5">
                      {section.links.map((link) => {
                        const Icon = link.icon;
                        const active = isLinkActive(link.href, link.exact);

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              active
                                ? "bg-easyva-purple-50 text-easyva-purple-700 font-bold border border-easyva-purple-200 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                active ? "text-easyva-purple-600" : "text-slate-400"
                              }`}
                            />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>View Public Store</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
              </Link>

              <button
                onClick={handleAdminLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly high-priority destinations) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                active
                  ? "text-easyva-purple-700 font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  active ? "bg-easyva-purple-50 text-easyva-purple-600" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* More Drawer Button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            mobileDrawerOpen
              ? "text-easyva-purple-700 font-extrabold"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              mobileDrawerOpen ? "bg-easyva-purple-50 text-easyva-purple-600" : ""
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 4. DESKTOP PERMANENT SIDEBAR (Screens ≥ 768px, existing design preserved)   */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex-col justify-between p-4 sm:p-5 shadow-xs min-h-screen">
        <div className="space-y-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-easyva-purple-500 shadow-xs">
                <Image
                  src="/easyva-logo.png"
                  alt="Easyva Logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                  easyva
                </span>
                <span className="text-[10px] text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Operational Status Pill */}
          <div className="px-3 py-2 bg-purple-50/80 border border-purple-200/70 rounded-xl text-[11px] text-purple-900 font-medium flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>Direct UPI Active • Zero Fees</span>
          </div>

          {/* Organized Navigation Sections */}
          <nav className="space-y-4">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block">
                  {section.title}
                </span>

                <div className="space-y-0.5">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const active = isLinkActive(link.href, link.exact);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? "bg-easyva-purple-50 text-easyva-purple-700 font-bold border border-easyva-purple-200/70 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            active ? "text-easyva-purple-600" : "text-slate-400"
                          }`}
                        />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Quick Action to Live Store & Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Public Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 font-mono">
            Easyva Studio v2.4 • Coimbatore
          </p>
        </div>
      </aside>
    </>
  );
}
