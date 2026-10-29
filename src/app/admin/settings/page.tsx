"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Zap, 
  Globe, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2,
  LineChart,
  Tag,
  ShieldCheck,
  Truck,
  Building,
  Loader2,
  QrCode,
  Upload
} from "lucide-react";
import { SiteSettings, HeroBanner, Coupon } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_percent: 10,
    min_order_value: 499,
    is_active: true,
  });

  const loadData = async () => {
    try {
      const [settingsRes, couponsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/coupons"),
      ]);
      const sData = await settingsRes.json();
      const cData = await couponsRes.json();
      setSettings(sData);
      setCoupons(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [uploadingQr, setUploadingQr] = useState(false);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploadingQr(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSettings({
        ...settings,
        custom_upi_qr_url: data.url,
      });
    } catch (err: any) {
      alert(err.message || "Failed to upload QR image");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggleCod = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      enable_cod: settings.enable_cod === false ? true : false,
    });
  };

  const handleBannerChange = (index: number, field: keyof HeroBanner, value: string) => {
    if (!settings) return;
    const updated = [...(settings.hero_banners || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, hero_banners: updated });
  };

  const handleAddBanner = () => {
    if (!settings) return;
    const newBanner: HeroBanner = {
      title: "Handcrafted Heritage Drop",
      subtitle: "Devotedly crafted by master artisans across India",
      image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
      cta_text: "Explore Collection",
      cta_link: "/category/art-and-craft",
    };
    setSettings({
      ...settings,
      hero_banners: [...(settings.hero_banners || []), newBanner],
    });
  };

  const handleRemoveBanner = (index: number) => {
    if (!settings) return;
    const updated = settings.hero_banners.filter((_, i) => i !== index);
    setSettings({ ...settings, hero_banners: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Coupon actions
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      if (!res.ok) throw new Error("Failed to create coupon");

      setShowCouponModal(false);
      setNewCoupon({
        code: "",
        discount_percent: 10,
        min_order_value: 499,
        is_active: true,
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`/api/coupons?id=${couponId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete coupon");
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...coupon,
          is_active: !coupon.is_active,
        }),
      });
      loadData();
    } catch (err) {
      alert("Failed to toggle coupon");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
        Loading store configuration...
      </div>
    );
  }

  if (!settings) return null;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
            Storefront Configuration & SEO
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Store & Public Pages Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zero-code control over Direct UPI payment receivers, Hero banners, Google Search Console, GA4, and active coupons.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving Settings...</span>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Payment Methods: Direct UPI & Cash on Delivery (COD) Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Payment Configuration & Checkout Methods
            </h2>
            <p className="text-xs text-slate-500">
              Manage Direct UPI receiver bank settings and Cash on Delivery (COD) storefront visibility.
            </p>
          </div>
        </div>

        {/* Cash on Delivery (COD) ON/OFF Toggle Switch */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Cash on Delivery (COD) Checkout Option
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  settings.enable_cod !== false
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-200 text-slate-700 border border-slate-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    settings.enable_cod !== false ? "bg-emerald-600 animate-pulse" : "bg-slate-500"
                  }`}
                />
                {settings.enable_cod !== false ? "COD Active (Visible at Checkout)" : "COD Disabled (Hidden from Checkout)"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {settings.enable_cod !== false
                ? "Customers can choose either Instant Direct UPI or Cash on Delivery during checkout."
                : "COD option is completely hidden from storefront checkout. Only Direct UPI is available."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleCod}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-easyva-purple-500 focus:ring-offset-2 ${
              settings.enable_cod !== false ? "bg-easyva-purple-600" : "bg-slate-300"
            }`}
            role="switch"
            aria-checked={settings.enable_cod !== false}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                settings.enable_cod !== false ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Merchant UPI ID (VPA) *
            </label>
            <input
              type="text"
              name="merchant_upi_id"
              required
              placeholder="e.g. easyva@okhdfcbank or easyva@upi"
              value={settings.merchant_upi_id}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              GPay, PhonePe, Paytm, and BHIM app links directly pay into this ID.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Registered Payee Name *
            </label>
            <input
              type="text"
              name="merchant_name"
              required
              placeholder="e.g. Easyva Artisan Crafts"
              value={settings.merchant_name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Name verified by NPCI UPI gateway upon barcode scanning.
            </span>
          </div>
        </div>

        {/* Custom Merchant QR Code Standee Upload */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <label className="block text-slate-700 font-bold text-xs">
            Official Merchant UPI QR Code Standee Image (Optional)
          </label>
          <p className="text-[11px] text-slate-500">
            Upload your studio or shop's official physical Google Pay, PhonePe, or Paytm QR standee photo. If uploaded, customers will see your verified merchant standee directly during checkout.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {settings.custom_upi_qr_url ? (
              <div className="relative w-32 h-32 rounded-xl border border-slate-300 p-1.5 bg-white shadow-xs group">
                <img
                  src={settings.custom_upi_qr_url}
                  alt="Custom Merchant QR"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, custom_upi_qr_url: "" })}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove Custom QR"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <QrCode className="w-8 h-8 opacity-60" />
                <span className="text-[10px] mt-1 text-center font-medium">No Custom QR<br/>(Auto Dynamic)</span>
              </div>
            )}

            <div className="space-y-2 flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-easyva-purple-800 text-xs font-bold rounded-xl border border-easyva-purple-200 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-easyva-purple-600" />
                <span>{uploadingQr ? "Uploading..." : settings.custom_upi_qr_url ? "Replace QR Standee" : "Upload QR Standee Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  disabled={uploadingQr}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400 block">
                Supports PNG, JPG, or WebP. Leave blank to generate an automatic NPCI QR code locked to the customer's exact order total.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Store Identity & Announcement Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Storefront Identity & Announcements
            </h2>
            <p className="text-xs text-slate-500">
              Customize store brand name, announcement bar text, and customer support contacts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              name="store_name"
              value={settings.store_name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              name="store_tagline"
              value={settings.store_tagline}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Customer Support Phone & WhatsApp
            </label>
            <input
              type="text"
              name="support_phone"
              placeholder="+91 8072 415 334"
              value={settings.support_phone}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              name="support_email"
              placeholder="muruganboutiqueandcosmetics@gmail.com"
              value={settings.support_email}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Headquarters Studio Address (Coimbatore)
            </label>
            <input
              type="text"
              name="store_address"
              placeholder="Coimbatore, Tamil Nadu - 641001, India"
              value={settings.store_address || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Official Instagram Profile URL
            </label>
            <input
              type="url"
              name="instagram_url"
              placeholder="https://instagram.com/easyva.artisan"
              value={settings.instagram_url || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none font-mono"
            />
          </div>
        </div>

        <div className="text-xs pt-1">
          <label className="block text-slate-700 font-bold mb-1">
            Top Announcement Bar Text (Displayed across public store header)
          </label>
          <input
            type="text"
            name="announcement_bar"
            value={settings.announcement_bar}
            onChange={handleInputChange}
            className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
          />
        </div>
      </div>

      {/* 3. SEO & Webmaster Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. SEO, Google Search Console & Analytics (GA4)
            </h2>
            <p className="text-xs text-slate-500">
              Verify domain ownership with Google and connect Google Analytics 4 tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Google Search Console Verification Token / Tag
            </label>
            <input
              type="text"
              name="google_search_console_tag"
              placeholder="e.g. dB_aBc123XyZ... or <meta name='google-site-verification'...>"
              value={settings.google_search_console_tag || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none text-xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Paste the verification code or full meta tag. Injected into &lt;head&gt; automatically on all pages.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              name="google_analytics_id"
              placeholder="e.g. G-ABC1234XYZ"
              value={settings.google_analytics_id || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none text-xs"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              From GA4 Admin &gt; Data Streams (starts with G-). Loads gtag.js asynchronously without slowing down your store.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Promotional Hero Sliders (Full CRUD) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Homepage Panoramic Hero Banners ({settings.hero_banners?.length || 0})
              </h2>
              <p className="text-xs text-slate-500">
                Manage Flipkart-proportioned banners sliding on the store homepage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddBanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-easyva-purple-50 hover:bg-easyva-purple-100 text-easyva-purple-700 rounded-xl text-xs font-bold border border-easyva-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Banner</span>
          </button>
        </div>

        <div className="space-y-4 pt-2">
          {settings.hero_banners?.map((banner, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="font-extrabold text-slate-700">Banner Slide #{idx + 1}</span>
                {settings.hero_banners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBanner(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1 flex items-center gap-1 text-[11px] font-bold"
                    title="Remove Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Slide</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => handleBannerChange(idx, "title", e.target.value)}
                    className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subtitle / Supporting Text</label>
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => handleBannerChange(idx, "subtitle", e.target.value)}
                    className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={banner.image_url}
                    onChange={(e) => handleBannerChange(idx, "image_url", e.target.value)}
                    className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-easyva-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Button CTA Text</label>
                    <input
                      type="text"
                      value={banner.cta_text}
                      onChange={(e) => handleBannerChange(idx, "cta_text", e.target.value)}
                      className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Button CTA Link</label>
                    <input
                      type="text"
                      value={banner.cta_link}
                      onChange={(e) => handleBannerChange(idx, "cta_link", e.target.value)}
                      className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Discount Coupons Engine (Full CRUD) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Discount Coupons & Promo Engine ({coupons.length})
              </h2>
              <p className="text-xs text-slate-500">
                Customers apply these codes during checkout for instant savings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCouponModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-easyva-purple-50 hover:bg-easyva-purple-100 text-easyva-purple-700 rounded-xl text-xs font-bold border border-easyva-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Coupon</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm text-easyva-purple-700">
                  {coupon.code}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(coupon)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      coupon.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {coupon.is_active ? "Active" : "Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>{coupon.discount_percent}% OFF</strong> on orders above ₹{coupon.min_order_value || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Coupon Modal (Responsive & Compact) */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-sm w-full max-h-[86vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
              <h3 className="text-sm font-extrabold text-slate-900">
                Create Discount Coupon
              </h3>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI25"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Discount Percentage (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={newCoupon.discount_percent}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      discount_percent: Number(e.target.value) || 10,
                    })
                  }
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:bg-white focus:border-easyva-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newCoupon.min_order_value}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      min_order_value: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-200/70 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCoupon}
                className="px-4 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
