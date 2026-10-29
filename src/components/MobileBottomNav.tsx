"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, SlidersHorizontal, User } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { isAdminEmail } from "@/lib/auth";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.getTotalItems());
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const isMobileMenuOpen = useCartStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useCartStore((state) => state.toggleMobileMenu);

  const { profile, user, openAuthModal } = useCustomerAuth();
  const isUserAdmin = isAdminEmail(profile?.email) || isAdminEmail(user?.email);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on admin, checkout, order-success, or when either the cart drawer or mobile menu drawer is open
  if (
    isCartOpen ||
    isMobileMenuOpen ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-success")
  ) {
    return null;
  }

  const isHome = pathname === "/";
  const isProfile = pathname.startsWith("/profile");

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1 shadow-2xl"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
      aria-label="Mobile Navigation Bar"
    >
      <div className="flex items-center justify-around">
        {/* Home Tab */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isHome
              ? "text-easyva-purple-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </Link>

        {/* Categories Tab (Opens the Curated Collections Menu Drawer) */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isMobileMenuOpen
              ? "text-easyva-purple-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label="Open Categories Menu"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
        </button>

        {/* Central Cart Bubble */}
        <button
          type="button"
          onClick={toggleCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 text-slate-300 hover:text-easyva-purple-400 transition-colors"
          aria-label="View Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* Account Tab */}
        {profile ? (
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isProfile
                ? "text-easyva-purple-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Account</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all text-slate-400 hover:text-slate-200`}
            aria-label="Sign In"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Sign In</span>
          </button>
        )}

        {/* Admin Dashboard Quick Link for Authorized Staff */}
        {isUserAdmin && (
          <Link
            href="/admin"
            className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-easyva-purple-400 transition-colors"
            title="Admin Control Center"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-semibold">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
