"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { isAdminEmail } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading } = useCustomerAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If on the login page itself, always allow
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    if (isLoading) return;

    const isGoogleAdmin = isAdminEmail(profile?.email) || isAdminEmail(user?.email);
    const hasAdminToken = typeof window !== "undefined" && localStorage.getItem("easyva_admin_token") === "authenticated";

    if (isGoogleAdmin || hasAdminToken) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
      router.replace("/admin/login");
    }
  }, [user, profile, isLoading, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authorized === null || isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-easyva-purple-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

