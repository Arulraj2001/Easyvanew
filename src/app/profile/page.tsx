"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  MapPin, 
  Package, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Sparkles, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Save,
  X,
  Phone,
  Mail,
  Home as HomeIcon,
  Briefcase
} from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { CustomerAddress } from "@/lib/types";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const { 
    user, 
    profile, 
    addresses, 
    orders, 
    isLoading, 
    signOut, 
    updateProfile, 
    saveAddress, 
    deleteAddress, 
    setDefaultAddress,
    openAuthModal
  } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">(
    initialTab === "addresses" || initialTab === "profile" ? initialTab : "orders"
  );

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<CustomerAddress, "id">>({
    label: "Home",
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-easyva-purple-200 border-t-easyva-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, prompt sign in
  if (!user && !profile) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-easyva-purple-50 text-easyva-purple-600 flex items-center justify-center mb-4 shadow-brand-soft">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Sign In to Access Your Patron Account
        </h1>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          Access your real-time order tracking, manage delivery addresses, and enjoy expedited 1-click checkout.
        </p>
        <button
          onClick={openAuthModal}
          className="py-3 px-8 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-700 hover:from-easyva-purple-700 hover:to-easyva-teal-800 text-white font-bold text-sm rounded-2xl shadow-brand-soft transition-transform active:scale-98"
        >
          Sign In / Continue with Google
        </button>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
    });
    setEditingProfile(false);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: "Home",
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      address_line: "",
      city: "",
      state: "Tamil Nadu",
      pincode: "",
      is_default: addresses.length === 0,
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await saveAddress({
        ...addressForm,
        id: editingAddressId,
      });
    } else {
      await saveAddress(addressForm);
    }
    setShowAddressModal(false);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28 md:pb-12 space-y-6">
      {/* 1. Patron Banner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-brand-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-20 h-20 rounded-full object-cover border-4 border-easyva-purple-100 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-easyva-purple-600 to-easyva-teal-600 text-white text-2xl font-black flex items-center justify-center border-4 border-easyva-purple-100 shadow-md">
              {profile?.full_name?.charAt(0).toUpperCase() || "P"}
            </div>
          )}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile?.full_name}
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Verified Patron
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile?.email}
              </span>
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === "orders"
              ? "bg-easyva-purple-600 text-white shadow-brand-soft"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders & Live Tracking ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === "addresses"
              ? "bg-easyva-purple-600 text-white shadow-brand-soft"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
            activeTab === "profile"
              ? "bg-easyva-purple-600 text-white shadow-brand-soft"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>
      </div>

      {/* 3. TAB 1: ORDERS & TRACKING */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-brand-soft space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-50 text-easyva-purple-600 flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No orders placed yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore hand-painted canvases, sterling silver jewelry, and aromatherapy home crafts created by regional indie artisans.
              </p>
              <Link
                href="/category/art-and-craft"
                className="inline-flex items-center gap-2 py-3 px-6 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-2xl shadow-brand-soft transition-colors"
              >
                <span>Browse Artisan Collections</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isPaid = order.payment_status === "VERIFIED";
                const isDelivered = order.fulfillment_status === "DELIVERED";
                const isShipped = order.fulfillment_status === "SHIPPED";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5 transition-all hover:shadow-brand-soft"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            Order #{order.order_number}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              order.payment_method === "DIRECT_UPI"
                                ? isPaid
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-purple-100 text-purple-800 border border-purple-300"
                            }`}
                          >
                            {order.payment_method === "DIRECT_UPI"
                              ? isPaid
                                ? "Prepaid UPI Verified"
                                : "UPI Verification Pending"
                              : "Cash on Delivery (COD)"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-500 block">Total Amount</span>
                        <span className="text-lg font-black text-slate-900">
                          ₹{order.total_amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Order Stepper Progress */}
                    <div className="py-2">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-600 z-0 transition-all duration-500"
                          style={{
                            width: isDelivered
                              ? "100%"
                              : isShipped
                              ? "70%"
                              : isPaid || order.fulfillment_status === "PROCESSING"
                              ? "40%"
                              : "10%",
                          }}
                        />

                        {/* Step 1: Placed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-easyva-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1">Placed</span>
                        </div>

                        {/* Step 2: Confirmed */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                            isPaid || order.fulfillment_status === "PROCESSING" || isShipped || isDelivered
                              ? "bg-easyva-purple-600 text-white"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1">Confirmed</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                            isShipped || isDelivered
                              ? "bg-easyva-teal-600 text-white"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}>
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1">Shipped</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                            isDelivered
                              ? "bg-emerald-600 text-white"
                              : "bg-white border-2 border-slate-300 text-slate-400"
                          }`}>
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center gap-3">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {item.product_title}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Qty: {item.quantity} × ₹{item.unit_price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <span className="text-xs font-black text-slate-800">
                            ₹{item.total_price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-500">
                        <span className="font-bold text-slate-700">Delivery Address: </span>
                        {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {order.tracking_number && (
                          <Link
                            href={`/track-order?lookup=${encodeURIComponent(order.tracking_number)}`}
                            className="py-1.5 px-3 rounded-xl bg-teal-50 text-teal-800 font-bold border border-teal-200 hover:bg-teal-100 flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track #{order.tracking_number}</span>
                          </Link>
                        )}
                        <Link
                          href={`/track-order?lookup=${encodeURIComponent(order.order_number)}`}
                          className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                        >
                          <span>Order Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: SAVED ADDRESSES */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Delivery Address Book
              </h3>
              <p className="text-xs text-slate-500">
                Manage doorstep shipping destinations for swift 1-click checkout.
              </p>
            </div>
            <button
              onClick={handleOpenAddAddress}
              className="py-2.5 px-4 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-2xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 space-y-3">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No saved addresses yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your home or office address to have your next handcrafted order delivered effortlessly.
              </p>
              <button
                onClick={handleOpenAddAddress}
                className="py-2 px-4 bg-purple-50 text-easyva-purple-700 text-xs font-bold rounded-xl border border-easyva-purple-200"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-2xl p-5 border transition-all relative ${
                    addr.is_default
                      ? "border-easyva-purple-500 ring-2 ring-easyva-purple-100 shadow-sm"
                      : "border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 flex items-center gap-1">
                        {addr.label === "Work" ? (
                          <Briefcase className="w-3 h-3 text-slate-600" />
                        ) : (
                          <HomeIcon className="w-3 h-3 text-slate-600" />
                        )}
                        {addr.label}
                      </span>
                      {addr.is_default && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Default Address
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Edit address"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {addr.full_name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addr.address_line}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {addr.phone}
                  </p>

                  {!addr.is_default && (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="mt-3 text-[11px] font-bold text-easyva-purple-600 hover:underline"
                    >
                      Set as Default Shipping Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: PERSONAL DETAILS */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-brand-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Personal Information
              </h3>
              <p className="text-xs text-slate-500">
                Update your contact details and communications preferences.
              </p>
            </div>
            {profileSaveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || ""}
                className="w-full bg-slate-100 p-3 rounded-xl border border-slate-200 text-slate-500 cursor-not-allowed outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Your authenticated account email cannot be changed directly.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Primary Contact Phone Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number for delivery updates"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* 6. PINNED RESPONSIVE ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[86vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form id="address-form" onSubmit={handleAddressSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              {/* Address Label Pills */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Address Type
                </label>
                <div className="flex items-center gap-2">
                  {(["Home", "Work", "Other"] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddressForm({ ...addressForm, label: lbl })}
                      className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        addressForm.label === lbl
                          ? "bg-easyva-purple-50 text-easyva-purple-700 border-easyva-purple-300 ring-1 ring-easyva-purple-500"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.full_name}
                    onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  House / Flat / Street / Area Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street name, landmark, building number..."
                  value={addressForm.address_line}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit pin"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                    className="rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Make this my default shipping address
                  </span>
                </label>
              </div>
            </form>

            {/* Modal Pinned Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="address-form"
                className="py-2 px-5 rounded-xl text-xs font-extrabold text-white bg-easyva-purple-600 hover:bg-easyva-purple-700 shadow-xs"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-easyva-purple-200 border-t-easyva-purple-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
