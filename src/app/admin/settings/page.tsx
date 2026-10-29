"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  Save, 
  Zap, 
  Globe, 
  Sparkles, 
  CheckCircle2,
  LineChart,
  Tag,
  Building,
  Loader2,
  QrCode,
  Upload,
  ArrowRight
} from "lucide-react";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/settings");
      const sData = await res.json();
      setSettings(sData);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
              Store Configuration
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-bold">Coimbatore HQ</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-easyva-purple-600" />
            <span>Store Settings & UPI Configuration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure store contact information, direct UPI settlement receiver, COD toggle, and Google analytics.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
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

      {/* Quick Navigation Cards to Dedicated Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/banners"
          className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200/90 hover:border-easyva-purple-300 transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-easyva-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-easyva-purple-700 transition-colors">
                Hero Banners & Image Upload
              </h4>
              <p className="text-[11px] text-slate-400">
                {settings.hero_banners?.length || 0} active slides with image upload & live view
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-easyva-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/coupons"
          className="p-4 bg-white hover:bg-purple-50/50 rounded-2xl border border-slate-200/90 hover:border-easyva-purple-300 transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-easyva-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-easyva-purple-700 transition-colors">
                Discount Coupons Engine
              </h4>
              <p className="text-[11px] text-slate-400">
                Manage promotional coupon codes & minimum orders
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-easyva-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* 1. Store Identity & Coimbatore Headquarters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Store Identity, Contact & Headquarters
            </h2>
            <p className="text-xs text-slate-500">
              Official store details rendered across the public footer, header, and legal notices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Store Name</label>
            <input
              type="text"
              name="store_name"
              value={settings.store_name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-easyva-purple-500 focus:bg-white outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Store Tagline</label>
            <input
              type="text"
              name="store_tagline"
              value={settings.store_tagline}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Customer Support & WhatsApp Phone
            </label>
            <input
              type="text"
              name="support_phone"
              value={settings.support_phone || "+91 8072 415 334"}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Used for floating WhatsApp button, telephone links, and checkout assistance.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              name="support_email"
              value={settings.support_email || "muruganboutiqueandcosmetics@gmail.com"}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Storewide official email address. Displayed on invoices, contact, and policy pages.
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-bold mb-1">
              Headquarters Studio Address
            </label>
            <input
              type="text"
              name="store_address"
              value={settings.store_address || "Coimbatore, Tamil Nadu - 641001, India"}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Rendered in footer, contact page, and schema.org local business structured data.
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-bold mb-1">
              Official Instagram Profile URL
            </label>
            <input
              type="url"
              name="instagram_url"
              value={settings.instagram_url || "https://instagram.com/easyva.artisan"}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-bold mb-1">
              Top Notification / Announcement Bar Text
            </label>
            <textarea
              name="announcement_bar"
              rows={2}
              value={settings.announcement_bar}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Visible on every public page at the very top banner.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Payment Methods: Direct UPI & Cash on Delivery (COD) Toggle */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Payment Configuration & Checkout Methods
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex-shrink-0 ${
              settings.enable_cod !== false
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {settings.enable_cod !== false ? "Disable COD" : "Enable COD"}
          </button>
        </div>

        {/* UPI Receiver Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Store Receiving UPI ID (VPA)
            </label>
            <input
              type="text"
              name="merchant_upi_id"
              value={settings.merchant_upi_id}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              100% of customer order funds land directly into this UPI bank account with zero fees.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Payee Display Name
            </label>
            <input
              type="text"
              name="merchant_name"
              value={settings.merchant_name}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Official merchant / business name visible inside GPay, PhonePe, and Paytm apps.
            </span>
          </div>

          <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-slate-800 font-bold">
                  Official Merchant Counter Standee QR Code
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload your printed Google Pay / PhonePe / BharatPe store standee QR image.
                </p>
              </div>

              {settings.custom_upi_qr_url && (
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, custom_upi_qr_url: undefined })}
                  className="text-rose-600 hover:text-rose-700 text-xs font-bold"
                >
                  Remove Custom QR
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {settings.custom_upi_qr_url ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                  <img
                    src={settings.custom_upi_qr_url}
                    alt="Store QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center p-2 flex-shrink-0 bg-white">
                  <QrCode className="w-8 h-8 text-slate-300 mb-1" />
                  <span className="text-[10px]">No Standee Uploaded</span>
                </div>
              )}

              <div className="space-y-2 flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs cursor-pointer">
                  {uploadingQr ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-easyva-purple-600" />
                      <span>Uploading QR Image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-easyva-purple-600" />
                      <span>Upload Counter Standee QR Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    disabled={uploadingQr}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  If uploaded, patrons will see your exact physical counter standee with your bank logo. If left blank, Easyva generates a dynamic vector QR on the fly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEO & Webmaster Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Search Engine & Webmaster Verification
            </h2>
            <p className="text-xs text-slate-500">
              Live Google Search Console and Google Analytics 4 tracking tags injected automatically into <code>&lt;head&gt;</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-easyva-teal-600" />
              <span>Google Search Console Verification Tag</span>
            </label>
            <input
              type="text"
              name="google_search_console_tag"
              placeholder="e.g. google-site-verification=abc123xyz"
              value={settings.google_search_console_tag || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[11px] focus:border-easyva-purple-500 focus:bg-white outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Paste the HTML verification meta tag content string from Google Search Console.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5 text-easyva-purple-600" />
              <span>Google Analytics 4 Measurement ID</span>
            </label>
            <input
              type="text"
              name="google_analytics_id"
              placeholder="e.g. G-XXXXXXXXXX"
              value={settings.google_analytics_id || ""}
              onChange={handleInputChange}
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-[11px] focus:border-easyva-purple-500 focus:bg-white outline-none font-bold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              From GA4 Admin &gt; Data Streams (starts with G-). Loads gtag.js asynchronously without slowing down your store.
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
