"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useCustomerAuth();

  const handleAdminLogout = async () => {
    localStorage.removeItem("easyva_admin_token");
    localStorage.removeItem("easyva_admin_email");
    await signOut();
    router.replace("/admin/login");
  };

  const navLinks = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/categories",
      label: "Categories & Tree",
      icon: Layers,
      exact: false,
    },
    {
      href: "/admin/products",
      label: "Products & Catalog",
      icon: Package,
      exact: false,
    },
    {
      href: "/admin/orders",
      label: "Orders & Verification",
      icon: ShoppingBag,
      exact: false,
    },
    {
      href: "/admin/blog",
      label: "Artisan Blog & SEO",
      icon: BookOpen,
      exact: false,
    },
    {
      href: "/admin/storage",
      label: "Media & Storage (1GB)",
      icon: HardDrive,
      exact: false,
    },
    {
      href: "/admin/settings",
      label: "Store & Public Pages",
      icon: Settings,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex-shrink-0 flex flex-col justify-between p-4 sm:p-6 shadow-xs">
      <div className="space-y-6">
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
        <div className="px-3.5 py-2.5 bg-purple-50/80 border border-purple-200/70 rounded-xl text-[11px] text-purple-900 font-medium flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>Direct UPI Settlement Active</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href, link.exact);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-easyva-purple-50 text-easyva-purple-700 font-bold border border-easyva-purple-200/60 shadow-xs"
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
        </nav>
      </div>

      {/* Footer Quick Action to Live Store */}
      <div className="pt-6 border-t border-slate-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Store className="w-4 h-4" />
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
        <p className="text-[10px] text-center text-slate-400">
          Easyva Studio v2.4 • Light Theme
        </p>
      </div>
    </aside>
  );
}

