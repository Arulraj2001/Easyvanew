"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CustomerProfile, CustomerAddress, Order } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface CustomerAuthContextType {
  user: any | null;
  profile: CustomerProfile | null;
  addresses: CustomerAddress[];
  orders: Order[];
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loginAsDemo: (customEmail?: string, customName?: string, customPhone?: string) => Promise<void>;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
  saveAddress: (address: Partial<CustomerAddress>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  refreshCustomerData: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "easyva_customer_session";
const LOCAL_STORAGE_PROFILE_KEY = "easyva_customer_profile";

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load customer data (addresses & orders) from API
  const fetchCustomerData = async (lookupId: string, email: string) => {
    try {
      // First try by email or id
      const res = await fetch(`/api/customer?lookup=${encodeURIComponent(email || lookupId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.addresses) setAddresses(data.addresses);
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch customer orders and addresses:", err);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const u = session.user;
            setUser(u);
            const prof: CustomerProfile = {
              id: u.id,
              email: u.email || "",
              full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Patron",
              avatar_url: u.user_metadata?.avatar_url || "",
              created_at: u.created_at,
            };
            setProfile(prof);
            await fetchCustomerData(u.id, u.email || "");
          } else {
            // Check local demo session fallback
            checkLocalSession();
          }

          // Listen to live Supabase Auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (session?.user) {
                const u = session.user;
                setUser(u);
                const prof: CustomerProfile = {
                  id: u.id,
                  email: u.email || "",
                  full_name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Patron",
                  avatar_url: u.user_metadata?.avatar_url || "",
                  created_at: u.created_at,
                };
                setProfile(prof);
                await fetchCustomerData(u.id, u.email || "");
              } else {
                checkLocalSession();
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } else {
          checkLocalSession();
        }
      } catch (err) {
        console.error("Auth init error:", err);
        checkLocalSession();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    function checkLocalSession() {
      try {
        const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
        if (savedSession) {
          const parsedUser = JSON.parse(savedSession);
          setUser(parsedUser);
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          } else {
            setProfile({
              id: parsedUser.id,
              email: parsedUser.email,
              full_name: parsedUser.user_metadata?.full_name || "Valued Patron",
              phone: parsedUser.phone || "",
              avatar_url: parsedUser.user_metadata?.avatar_url || "",
            });
          }
          fetchCustomerData(parsedUser.id, parsedUser.email);
        } else {
          setUser(null);
          setProfile(null);
          setAddresses([]);
          setOrders([]);
        }
      } catch (e) {
        console.error("Error reading local session", e);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectOrigin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Google sign in error:", error);
        alert(`Google Sign-In: ${error.message}`);
      }
    } else {
      alert("Google OAuth: Please configure your Supabase Project URL and Anon Key in .env.local to enable live authentication.");
    }
  };

  const loginAsDemo = async (
    customEmail = "supermax111@stretz.store",
    customName = "Arulraj S",
    customPhone = "08637474067"
  ) => {
    const demoUser = {
      id: "demo_usr_arulraj",
      email: customEmail,
      phone: customPhone,
      user_metadata: {
        full_name: customName,
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
      created_at: new Date().toISOString(),
    };

    const demoProfile: CustomerProfile = {
      id: demoUser.id,
      email: customEmail,
      full_name: customName,
      phone: customPhone,
      avatar_url: demoUser.user_metadata.avatar_url,
      created_at: demoUser.created_at,
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));

    setUser(demoUser);
    setProfile(demoProfile);
    closeAuthModal();

    // Ensure sample saved address exists for seamless 1-click checkout test
    try {
      await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_address",
          customerId: demoUser.id,
          address: {
            id: "addr_default_home",
            customer_id: demoUser.id,
            label: "Home",
            full_name: customName,
            phone: customPhone,
            address_line: "AnnaNagar, P.L.Thanda, Arattavadi Post",
            city: "Tiruvannamalai",
            state: "Tamil Nadu",
            pincode: "606709",
            is_default: true,
          },
        }),
      });
    } catch (e) {
      console.warn("Could not seed demo address", e);
    }

    await fetchCustomerData(demoUser.id, customEmail);
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    setUser(null);
    setProfile(null);
    setAddresses([]);
    setOrders([]);
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
  };

  const saveAddress = async (addressData: Partial<CustomerAddress>) => {
    const activeId = user?.id || "guest";
    const res = await fetch("/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_address",
        customerId: activeId,
        address: {
          ...addressData,
          customer_id: activeId,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.addresses) setAddresses(data.addresses);
    }
  };

  const deleteAddress = async (addressId: string) => {
    const activeId = user?.id || "guest";
    const res = await fetch("/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_address",
        addressId,
        customerId: activeId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.addresses) setAddresses(data.addresses);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    const activeId = user?.id || "guest";
    const res = await fetch("/api/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "set_default_address",
        addressId,
        customerId: activeId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.addresses) setAddresses(data.addresses);
    }
  };

  const refreshCustomerData = async () => {
    if (user?.id) {
      await fetchCustomerData(user.id, user.email || "");
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        profile,
        addresses,
        orders,
        isLoading,
        isSupabaseConfigured,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signOut,
        loginAsDemo,
        updateProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        refreshCustomerData,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}

