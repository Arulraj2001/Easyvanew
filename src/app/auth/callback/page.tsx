"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      if (!isSupabaseConfigured || !supabase) {
        router.replace("/profile");
        return;
      }

      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (data.session) {
          router.replace("/profile");
        } else {
          // Listen once for auth change if exchange is in progress
          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (session) {
                router.replace("/profile");
              }
            }
          );

          // Fallback timeout
          setTimeout(() => {
            router.replace("/profile");
          }, 2500);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Failed to finalize authentication");
        setTimeout(() => router.replace("/login"), 3000);
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-easyva-purple-50 text-easyva-purple-600 flex items-center justify-center mb-4 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">
        Authenticating with Google...
      </h1>
      <p className="text-xs text-slate-500 max-w-sm">
        {error ? (
          <span className="text-rose-600">{error}</span>
        ) : (
          "Synchronizing your artisan profile and loading your order history."
        )}
      </p>
    </div>
  );
}

