"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck, Key, ArrowRight, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/auth";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, profile, signInWithGoogle } = useCustomerAuth();

  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in as admin via Google or passkey, redirect
  useEffect(() => {
    const isGoogleAdmin = isAdminEmail(profile?.email) || isAdminEmail(user?.email);
    const hasAdminToken = typeof window !== "undefined" && localStorage.getItem("easyva_admin_token") === "authenticated";

    if (isGoogleAdmin || hasAdminToken) {
      router.replace("/admin");
    }
  }, [user, profile, router]);

  const handlePasskeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Default admin master passkey (configured in .env.local via NEXT_PUBLIC_ADMIN_PASSKEY)
    const validPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "Admin@Easyva2026";

    setTimeout(() => {
      if (passkey === validPasskey) {
        localStorage.setItem("easyva_admin_token", "authenticated");
        localStorage.setItem("easyva_admin_email", ADMIN_EMAIL);
        router.replace("/admin");
      } else {
        setError("Invalid administrator passkey. Please check and try again.");
      }
      setLoading(false);
    }, 400);
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // Auth callback will handle redirection if the signed in account matches ADMIN_EMAIL
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-easyva-purple-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-easyva-purple-950 to-slate-900 p-8 text-center text-white relative">
          <div className="relative w-12 h-12 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-easyva-purple-500 shadow-md">
            <Image
              src="/easyva-logo.png"
              alt="Easyva"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Easyva Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Administrator Access
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-easyva-purple-300">
            <span>Authorized ID: {ADMIN_EMAIL}</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Option 1: Continue with Admin Google Account */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Sign in with Google ({ADMIN_EMAIL})</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Or Master Passkey
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Option 2: Admin Master Passkey Form */}
          <form onSubmit={handlePasskeyLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Master Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter administrator passkey..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-easyva-purple-600 focus:bg-white outline-none font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Verify Passkey & Access Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <Link href="/" className="hover:text-easyva-purple-600">
              ← Back to Storefront
            </Link>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

