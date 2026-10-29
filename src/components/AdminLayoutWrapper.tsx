"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/admin/AdminSidebar";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
        {/* Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Admin Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden bg-slate-50">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}

