"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone,
  ExternalLink,
  Tag,
  Upload,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCartStore } from "@/lib/store";
import { buildUpiUri, generateUpiQrDataUrl, getUpiAppLinks } from "@/lib/upi";
import { SiteSettings, Coupon, CustomerAddress } from "@/lib/types";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });

  const { user, profile, addresses, openAuthModal, refreshCustomerData } = useCustomerAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"DIRECT_UPI" | "COD">("DIRECT_UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Auto-fill contact details from logged-in patron profile
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile.full_name || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  // Auto-fill default address if available
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setFormData((prev) => ({
          ...prev,
          name: defaultAddr.full_name || prev.name,
          phone: defaultAddr.phone || prev.phone,
          address: defaultAddr.address_line,
          city: defaultAddr.city,
          state: defaultAddr.state,
          pincode: defaultAddr.pincode,
        }));
      }
    }
  }, [addresses, selectedAddressId]);

  const handleSelectSavedAddress = (addr: CustomerAddress) => {
    setSelectedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      name: addr.full_name,
      phone: addr.phone,
      address: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }));
  };

  // Coupon States
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Direct UPI Dynamic State
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiQrUrl, setUpiQrUrl] = useState<string>("");
  const [upiUri, setUpiUri] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState("");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [verifyingUtr, setVerifyingUtr] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        if (data?.enable_cod === false) {
          setPaymentMethod("DIRECT_UPI");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const rawSubtotal = getTotalPrice();
  const discountAmount = appliedCoupon
    ? Math.round((rawSubtotal * appliedCoupon.discount_percent) / 100)
    : 0;
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const shippingFee = discountedSubtotal >= 999 ? 0 : 70;
  const finalPayable = discountedSubtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);

    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponInput.trim())}`);
      const coupon: Coupon = await res.json();

      if (!res.ok) {
        setCouponError("Invalid or expired coupon code");
        return;
      }

      if (coupon.min_order_value && rawSubtotal < coupon.min_order_value) {
        setCouponError(`Minimum order value for ${coupon.code} is ₹${coupon.min_order_value}`);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponInput("");
    } catch {
      setCouponError("Failed to apply coupon");
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingScreenshot(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) setScreenshotUrl(data.url);
    } catch {
      alert("Screenshot upload failed");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      router.push("/");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user?.id || undefined,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_pincode: formData.pincode,
          total_amount: finalPayable,
          payment_method: paymentMethod,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_title: i.product.title,
            product_image: i.product.images?.[0]?.image_url,
            unit_price: i.product.price,
            quantity: i.quantity,
            total_price: i.product.price * i.quantity,
          })),
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Order creation failed");

      setOrderId(order.id);
      setOrderNumber(order.order_number);
      if (refreshCustomerData) {
        refreshCustomerData();
      }

      if (paymentMethod === "DIRECT_UPI") {
        const payeeVpa = settings?.merchant_upi_id || "easyva@upi";
        const payeeName = settings?.merchant_name || "Easyva Artisan Crafts";

        const uri = buildUpiUri({
          payeeVpa,
          payeeName,
          amount: finalPayable,
          orderNumber: order.order_number,
        });

        const qr = await generateUpiQrDataUrl({
          payeeVpa,
          payeeName,
          amount: finalPayable,
          orderNumber: order.order_number,
        });

        setUpiUri(uri);
        setUpiQrUrl(qr);
        setShowUpiModal(true);
      } else {
        confetti({ particleCount: 80, spread: 60 });
        clearCart();
        router.push(`/order-success?order=${order.order_number}`);
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() && !screenshotUrl) {
      alert("Please enter your 12-digit UPI UTR Number or upload a payment receipt screenshot.");
      return;
    }

    setVerifyingUtr(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          utr_number: utrNumber.trim() || `UTR-PROOF-${Date.now()}`,
          utr_proof_image: screenshotUrl || undefined,
          payment_status: "PENDING",
        }),
      });

      if (!res.ok) throw new Error("Failed to register payment proof");

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      clearCart();
      setShowUpiModal(false);
      router.push(`/order-success?order=${orderNumber}&utr=${encodeURIComponent(utrNumber.trim())}`);
    } catch (err: any) {
      alert(err.message || "Failed to submit payment reference.");
    } finally {
      setVerifyingUtr(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="bg-[#F1F2F4] min-h-screen py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-easyva-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !showUpiModal) {
    return (
      <div className="bg-[#F1F2F4] min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Your bag is empty</h2>
          <p className="text-xs text-slate-500">
            Add some handcrafted items to your bag before checking out.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-easyva-purple-600 text-white font-bold rounded-full text-xs shadow-md"
          >
            Explore Creations
          </Link>
        </div>
      </div>
    );
  }

  const upiAppLinks = getUpiAppLinks(upiUri);

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-6 sm:py-10 pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Checkout Form Column */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Express Direct Checkout
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Every purchase directly supports authentic master artisans and heritage Indian craft studios.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Guest / Patron Login Encouragement Banner */}
              {!user && (
                <div className="bg-gradient-to-r from-purple-50 via-teal-50 to-purple-50 border border-purple-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-easyva-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Have an account or returning patron?
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sign in with Google to 1-click auto-fill saved addresses & live track delivery.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="shrink-0 py-2 px-4 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}

              {/* Customer Contact */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    1. Contact Information
                  </h2>
                  {profile && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-easyva-purple-700 border border-easyva-purple-200">
                      Auto-filled from Patron Account
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Samuel Kumar"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number (for Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 8072415334"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (for Order Receipt)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. samuel@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2. Shipping Destination
                  </h2>
                  {addresses.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {addresses.length} saved address{addresses.length > 1 ? "es" : ""} found
                    </span>
                  )}
                </div>

                {/* Saved Address Selector */}
                {addresses.length > 0 && (
                  <div className="space-y-2 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Select Delivery Address:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all text-xs relative ${
                              isSelected
                                ? "border-easyva-purple-600 bg-easyva-purple-50/60 ring-1 ring-easyva-purple-600"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-extrabold">
                                  {addr.label}
                                </span>
                                {addr.full_name}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-easyva-purple-600" />
                              )}
                            </div>
                            <p className="text-slate-600 text-[11px] line-clamp-1">
                              {addr.address_line}
                            </p>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street Address, Flat / House No. *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. 42 Artisans Lane, 2nd Floor"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Bengaluru"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none bg-white"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Kerala">Kerala</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="560001"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Payment Method
                </h2>

                <div className="space-y-2.5">
                  <label
                    onClick={() => setPaymentMethod("DIRECT_UPI")}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "DIRECT_UPI"
                        ? "border-easyva-purple-600 bg-easyva-purple-50/50 ring-1 ring-easyva-purple-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "DIRECT_UPI"}
                      onChange={() => setPaymentMethod("DIRECT_UPI")}
                      className="mt-1 text-easyva-purple-600 focus:ring-easyva-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Instant Direct UPI (GPay, PhonePe, Paytm, BHIM)
                        </span>
                        <span className="text-[10px] font-extrabold bg-easyva-lime-800 text-white px-2 py-0.5 rounded-full">
                          FASTEST & FREE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Direct-to-bank settlement with instant zero-cost verification.
                      </p>
                    </div>
                  </label>

                  {settings?.enable_cod !== false && (
                    <label
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "COD"
                          ? "border-easyva-purple-600 bg-easyva-purple-50/50 ring-1 ring-easyva-purple-600"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="mt-1 text-easyva-purple-600 focus:ring-easyva-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-900">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Pay in cash upon doorstep delivery.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-easyva-purple-600 to-easyva-teal-700 hover:from-easyva-purple-700 hover:to-easyva-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-brand-soft flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Order & Dynamic QR...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-easyva-amber-300" />
                    <span>
                      {paymentMethod === "DIRECT_UPI"
                        ? `Pay ₹${finalPayable.toLocaleString("en-IN")} via Direct UPI`
                        : `Place Order for ₹${finalPayable.toLocaleString("en-IN")}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary & Coupon Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Coupon Code Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Tag className="w-4 h-4 text-easyva-purple-600" />
                <span>Apply Discount Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-800 font-mono">
                      {appliedCoupon.code} Applied!
                    </span>
                    <span className="text-[11px] text-emerald-600 block">
                      {appliedCoupon.discount_percent}% off discount saved
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-xs text-slate-400 hover:text-red-500 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code: e.g. EASYVA10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:border-easyva-purple-500 focus:outline-none font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <span className="text-[11px] text-red-600 font-semibold block">
                  {couponError}
                </span>
              )}
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Price Details ({items.length} items)
              </h2>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="pr-2">
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.product.title}</div>
                      <span className="text-slate-400 text-[10px]">Qty: {item.quantity}</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{rawSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-easyva-lime-800">
                    {shippingFee === 0 ? "FREE" : "₹70"}
                  </span>
                </div>

                <div className="flex justify-between text-slate-900 text-base font-extrabold pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>₹{finalPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-3 bg-easyva-purple-50/60 rounded-xl border border-easyva-purple-100/80 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-easyva-purple-600 flex-shrink-0 mt-0.5" />
                <span>
                  Certified Studio Craft: 100% authentic artisan creation with comprehensive transit breakage insurance.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct UPI Modal (Responsive & Compact) */}
      {showUpiModal && (
        <div className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-sm flex justify-center items-start sm:items-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="relative bg-white max-w-2xl w-full max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Pinned Sticky Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-easyva-purple-700 flex items-center justify-center flex-shrink-0 font-bold">
                  ₹
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Pay ₹{finalPayable.toLocaleString("en-IN")}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded-full">
                      Direct UPI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Order Ref: #{orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg text-xs font-bold transition-colors"
                title="Close"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Scrollable Modal Content (2 Columns on Desktop, 1 on Mobile) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-start text-xs">
                {/* Left Column: QR Code & UPI ID */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 sm:p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {settings?.custom_upi_qr_url ? "Scan Official Merchant Standee QR" : "Scan with any UPI App"}
                  </span>

                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-white p-2 rounded-xl shadow-xs border border-slate-200 overflow-hidden flex items-center justify-center">
                    {settings?.custom_upi_qr_url ? (
                      <img
                        src={settings.custom_upi_qr_url}
                        alt="Merchant UPI QR Standee"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : upiQrUrl ? (
                      <img
                        src={upiQrUrl}
                        alt="Dynamic UPI QR"
                        className="w-full h-full object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="w-full space-y-1">
                    <div className="flex items-center justify-between text-[11px] bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono">
                      <span className="truncate text-slate-700 font-bold">
                        {settings?.merchant_upi_id || "easyva@upi"}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(settings?.merchant_upi_id || "easyva@upi")}
                        className="text-easyva-purple-600 hover:text-easyva-purple-800 font-bold ml-1 flex-shrink-0"
                        title="Copy UPI ID"
                      >
                        {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Payee: {settings?.merchant_name || "Easyva Artisan Crafts"}
                    </span>
                  </div>
                </div>

                {/* Right Column: Mobile App Intent Links & UTR Submission */}
                <div className="sm:col-span-7 space-y-3">
                  {/* Mobile Deep Links */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Or Tap to Open Your Installed App:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {upiAppLinks.map((app) => (
                        <a
                          key={app.name}
                          href={app.intentUri}
                          style={{
                            backgroundColor: app.bgColor,
                            color: app.textColor,
                            borderColor: app.borderColor,
                          }}
                          className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border shadow-xs transition-transform active:scale-95 hover:opacity-95"
                        >
                          <span className="truncate">{app.name}</span>
                          <span
                            style={{ backgroundColor: app.accent, color: "#FFFFFF" }}
                            className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0"
                          >
                            {app.badge}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Submission Inputs */}
                  <form onSubmit={handleUtrSubmit} id="upi-confirm-form" className="space-y-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        12-Digit UPI Reference Number (UTR) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 428938491028"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full text-xs font-mono p-2 rounded-xl border border-slate-300 focus:border-easyva-purple-600 outline-none"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Found in your UPI app payment receipt details.
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Payment Receipt Screenshot (Optional)
                      </span>
                      <label className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-600 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-easyva-purple-600" />
                        <span className="font-medium text-[11px]">
                          {uploadingScreenshot
                            ? "Uploading..."
                            : screenshotUrl
                            ? "Screenshot Attached ✓"
                            : "Attach Screenshot"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Pinned Sticky Footer */}
            <div className="px-4 py-2.5 sm:px-6 sm:py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Instant verification after UTR submission.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowUpiModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="upi-confirm-form"
                  disabled={verifyingUtr}
                  className="flex-1 sm:flex-none px-5 py-2 sm:px-6 sm:py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {verifyingUtr ? (
                    <span>Submitting Payment...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Complete Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
