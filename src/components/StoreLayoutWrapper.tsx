"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AuthModal from "@/components/AuthModal";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { Category, SiteSettings } from "@/lib/types";

interface StoreLayoutWrapperProps {
  children: React.ReactNode;
  categories: Category[];
  settings: SiteSettings;
}

export default function StoreLayoutWrapper({
  children,
  categories,
  settings,
}: StoreLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin routes do NOT render public Header, Footer, CartDrawer, or MobileBottomNav
    return (
      <CustomerAuthProvider>
        <main className="min-h-screen bg-slate-50 text-slate-900">{children}</main>
      </CustomerAuthProvider>
    );
  }

  return (
    <CustomerAuthProvider>
      <Header categories={categories} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <MobileMenuDrawer categories={categories} settings={settings} />
      <CartDrawer />
      <MobileBottomNav />
      <AuthModal />
      <FloatingWhatsApp settings={settings} />
    </CustomerAuthProvider>
  );
}
