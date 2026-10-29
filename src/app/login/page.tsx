"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useCustomerAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user, router]);

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-brand-soft overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-easyva-purple-700 via-easyva-purple-600 to-easyva-teal-700 p-8 text-white text-center">
          <div className="w-14 h-14 mx-auto mb-3 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <Sparkles className="w-7 h-7 text-easyva-lime-300" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Patron Account Sign In
          </h1>
          <p className="text-xs text-white/80 mt-1 max-w-xs mx-auto">
            Manage your artisanal purchases, real-time tracking, and doorstep delivery addresses.
          </p>
        </div>

        {/* Action Panel */}
        <div className="p-8 space-y-6">
          <button
            onClick={handleGoogleClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl border border-slate-300 shadow-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Account Benefits */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Patron Perks & Privileges
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Real-time courier AWB tracking on all orders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Multi-address book for rapid 1-click checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Direct artisan studio updates and receipts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Secure authentication & privacy protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

