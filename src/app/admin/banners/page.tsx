"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  Eye,
  ExternalLink
} from "lucide-react";
import { HeroBanner, SiteSettings } from "@/lib/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Hidden file inputs for each banner
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const loadBanners = async () => {
    try {
      const res = await fetch("/api/settings");
      const data: SiteSettings = await res.json();
      setBanners(data.hero_banners || []);
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleBannerChange = (index: number, field: keyof HeroBanner, value: string) => {
    const updated = [...banners];
    updated[index] = { ...updated[index], [field]: value };
    setBanners(updated);
  };

  const handleAddBanner = () => {
    const newBanner: HeroBanner = {
      title: "Handcrafted Heritage Drop",
      subtitle: "Devotedly crafted by master artisans across India",
      image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
      cta_text: "Explore Collection",
      cta_link: "/category/art-and-craft",
    };
    setBanners([...banners, newBanner]);
  };

  const handleRemoveBanner = (index: number) => {
    if (banners.length <= 1) {
      alert("At least one hero banner is required for the store homepage.");
      return;
    }
    if (!confirm(`Are you sure you want to delete Banner Slide #${index + 1}?`)) return;
    setBanners(banners.filter((_, i) => i !== index));
  };

  const handleMoveBanner = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === banners.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...banners];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setBanners(updated);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Set uploaded image URL
      handleBannerChange(index, "image_url", data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload banner image");
    } finally {
      setUploadingIndex(null);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_banners: banners }),
      });

      if (!res.ok) throw new Error("Failed to save hero banners");

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save banners");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
        Loading hero banner slides...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
              Storefront Showcase
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-bold">{banners.length} Active Slides</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-easyva-purple-600" />
            <span>Homepage Hero Banners</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Upload custom banner graphics or paste high-res CDN photos. Configure headlines, action buttons, and slide orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddBanner}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Add Slide</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Banners</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-6">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:border-easyva-purple-200"
          >
            {/* Slide Header Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-easyva-purple-600 text-white text-xs font-black flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="font-extrabold text-sm text-slate-800 truncate max-w-xs sm:max-w-md">
                  {banner.title || "Untitled Banner Slide"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  onClick={() => handleMoveBanner(idx, "up")}
                  disabled={idx === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Slide Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBanner(idx, "down")}
                  disabled={idx === banners.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Slide Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-slate-300 mx-1" />

                {/* Delete Slide */}
                <button
                  type="button"
                  onClick={() => handleRemoveBanner(idx)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            {/* Slide Content Form & Live Preview */}
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Fields (7 Columns) */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                {/* 1. Banner Image with Upload & URL Option */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-800 font-extrabold">
                      Banner Image Graphic
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Recommended: 1600 × 500 (16:5 or 16:9)
                    </span>
                  </div>

                  {/* Upload Image Button */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRefs.current[idx] = el;
                      }}
                      onChange={(e) => handleImageUpload(idx, e)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      disabled={uploadingIndex === idx}
                      className="flex items-center gap-2 px-4 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-60"
                    >
                      {uploadingIndex === idx ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading Image...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload Banner Image</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-slate-400 font-medium">or paste URL below</span>
                  </div>

                  {/* Direct Image URL input */}
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or /uploads/..."
                      value={banner.image_url}
                      onChange={(e) => handleBannerChange(idx, "image_url", e.target.value)}
                      className="w-full bg-white px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-easyva-purple-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* 2. Text Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Headline Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elegance in Every Detail"
                      value={banner.title}
                      onChange={(e) => handleBannerChange(idx, "title", e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Supporting Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Handcrafted studio specials refreshed daily"
                      value={banner.subtitle}
                      onChange={(e) => handleBannerChange(idx, "subtitle", e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Button CTA Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Jewellery"
                      value={banner.cta_text}
                      onChange={(e) => handleBannerChange(idx, "cta_text", e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      Button Destination Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /category/jewellery"
                      value={banner.cta_link}
                      onChange={(e) => handleBannerChange(idx, "cta_link", e.target.value)}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-[11px] focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Customer Preview (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-easyva-purple-600" />
                    <span>Live Customer View</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">16:9 Mobile / 16:5 Desktop</span>
                </div>

                {/* Mock Hero Banner Card */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200">
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url}
                      alt={banner.title || "Banner Preview"}
                      fill
                      sizes="400px"
                      className="object-cover object-center brightness-[0.55]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Image Set
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />

                  {/* Live Rendered Typography */}
                  <div className="relative z-10 h-full flex flex-col justify-center p-4 text-white space-y-1.5">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-easyva-purple-500/30 border border-easyva-purple-400/40 rounded-full text-easyva-purple-300 text-[9px] font-extrabold self-start backdrop-blur-xs">
                      <Sparkles className="w-2.5 h-2.5 text-easyva-amber-400" />
                      <span>Artisan Curated Drop</span>
                    </div>

                    <h3 className="text-sm font-black text-white leading-tight line-clamp-2">
                      {banner.title || "Headline Title"}
                    </h3>

                    <p className="text-[10px] text-slate-300 line-clamp-1">
                      {banner.subtitle || "Supporting subtitle text here..."}
                    </p>

                    <div className="pt-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-950 font-black text-[10px] rounded-lg shadow-sm">
                        <span>{banner.cta_text || "Shop Now"}</span>
                        <ArrowRight className="w-3 h-3 text-easyva-purple-700" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Destination: <code className="text-easyva-purple-700 font-bold">{banner.cta_link || "/"}</code></span>
                  <Link
                    href="/"
                    target="_blank"
                    className="text-easyva-purple-600 hover:underline flex items-center gap-1"
                  >
                    <span>Test on Homepage</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-lg flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Make sure to click <strong className="text-slate-800">Save All Banners</strong> to publish updates to your live storefront.
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-brand-soft transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Live...</span>
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Live!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Banners</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

