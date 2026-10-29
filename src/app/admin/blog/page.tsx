"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Copy,
  Upload,
  Sparkles,
  BookOpen,
  Calendar,
  Tag,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { BlogPost, Product } from "@/lib/types";
import ImageCropperModal from "@/components/ImageCropperModal";

const BLOG_CATEGORIES = [
  "Artisan Traditions",
  "Home Decor Styling",
  "Living with Heritage",
  "Gifting Guides",
];

const SAMPLE_AI_PROMPT = `Write an in-depth 1,200-word SEO article for an authentic Indian handicraft boutique in Tamil Nadu.
Focus Keywords: Tamil Nadu handicrafts online, Thanjavur paintings Chennai, Swamimalai bronze, Chettinad terracotta pottery, authentic artisan home decor.
Tone: Sophisticated, culturally rich, architectural interior design perspective.
Structure:
- Catchy H1 Title
- Inspiring introduction capturing Tamil Nadu's craft heritage
- H2 Sections detailing historical artisan techniques, materials, and how to style each piece in modern contemporary apartments
- Practical care & maintenance tips
- Conclusion inviting readers to support local master artisans
Format the entire response in clean Markdown with H2, H3, bold highlights, blockquotes, and bullet lists.`;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAiPromptModal, setShowAiPromptModal] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    category: "Artisan Traditions",
    excerpt: "",
    content: "",
    cover_image: "/images/banners/banner1.webp",
    tags: ["Tamil Nadu Crafts", "Handicrafts"],
    reading_time: "5 min read",
    is_published: true,
    published_at: new Date().toISOString().split("T")[0],
    featured_products: [],
    author: {
      name: "Murugan Boutique & Artisan Collective",
      role: "Heritage Craft Curator",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    },
    seo: {
      meta_title: "",
      meta_description: "",
      keywords: ["Tamil Nadu handicrafts", "artisans", "authentic home decor"],
    },
  });

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog?all=true");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products for blog links:", err);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchProducts();
  }, []);

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : slug,
      seo: {
        meta_title: prev.seo?.meta_title || val,
        meta_description: prev.seo?.meta_description || prev.excerpt || "",
        keywords: prev.seo?.keywords || ["Tamil Nadu handicrafts"],
      },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileForCrop(file);
    }
  };

  const handleCroppedUpload = async (blob: Blob) => {
    setSelectedFileForCrop(null);
    const body = new FormData();
    body.append("file", new File([blob], `blog_${Date.now()}.webp`, { type: "image/webp" }));

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, cover_image: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload image");
    }
  };

  const handleMdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Extract title if starts with #
        const lines = text.split("\n");
        let detectedTitle = "";
        let bodyLines = [];

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (!detectedTitle && line.startsWith("# ")) {
            detectedTitle = line.replace("# ", "").trim();
          } else {
            bodyLines.push(line);
          }
        }

        const cleanBody = bodyLines.join("\n").trim();
        const wordCount = text.split(/\s+/).length;
        const readTime = `${Math.max(2, Math.ceil(wordCount / 200))} min read`;

        setFormData((prev) => ({
          ...prev,
          title: detectedTitle || prev.title,
          content: cleanBody || text,
          reading_time: readTime,
          excerpt: cleanBody.slice(0, 160).replace(/[#*`_]/g, "") + "...",
        }));
      }
    };
    reader.readAsText(file);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        await fetchBlogPosts();
      } else {
        alert(data.error || "Failed to save blog post");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchBlogPosts();
      }
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const openNewPostModal = () => {
    setFormData({
      title: "",
      slug: "",
      category: "Artisan Traditions",
      excerpt: "",
      content: "",
      cover_image: "/images/banners/banner1.webp",
      tags: ["Tamil Nadu Crafts", "Handicrafts"],
      reading_time: "5 min read",
      is_published: true,
      published_at: new Date().toISOString().split("T")[0],
      featured_products: [],
      author: {
        name: "Murugan Boutique & Artisan Collective",
        role: "Heritage Craft Curator",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      },
      seo: {
        meta_title: "",
        meta_description: "",
        keywords: ["Tamil Nadu handicrafts", "artisans", "authentic home decor"],
      },
    });
    setActiveTab("write");
    setShowModal(true);
  };

  const openEditModal = (p: BlogPost) => {
    setFormData(p);
    setActiveTab("write");
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-easyva-purple-600" />
            Artisan Stories & Blog CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Write or paste high-ranking AI articles from ChatGPT/Claude, embed store products, and rank in Tamil Nadu & Indian organic search.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiPromptModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-easyva-purple-700 text-xs font-bold rounded-xl border border-easyva-purple-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Prompt Helper
          </button>
          <button
            onClick={openNewPostModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Story / Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            All Articles ({posts.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Published posts generate dynamic XML sitemap links & Schema.org rich snippets
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading articles...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No articles found. Click "New Story / Post" or import a markdown draft.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold text-easyva-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-easyva-purple-100">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {post.reading_time || "5 min read"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {post.published_at}
                      </span>
                      {post.is_published ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-easyva-purple-600 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs font-semibold flex items-center gap-1"
                    title="Read live article"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </a>
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Edit article"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Prompt Helper Modal */}
      {showAiPromptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-easyva-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  Ready AI Prompt for ChatGPT / Claude
                </h3>
              </div>
              <button
                onClick={() => setShowAiPromptModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Copy this optimized prompt, paste it into ChatGPT, Claude, or Gemini, then copy the generated Markdown directly into this CMS editor!
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
              {SAMPLE_AI_PROMPT}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SAMPLE_AI_PROMPT);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2500);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Article Modal (Responsive & Compact) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full max-h-[88vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Pinned Sticky Header */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {formData.id ? "Edit Article" : "Compose New Artisan Story"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Fill in article details, upload cover image, or paste Markdown directly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSavePost} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4 text-xs">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Top 7 Traditional Handicrafts of Tamil Nadu..."
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="top-handicrafts-tamil-nadu"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>

                {/* Category, Read Time & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Blog Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:bg-white focus:border-easyva-purple-500 outline-none"
                    >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Estimated Reading Time
                    </label>
                    <input
                      type="text"
                      value={formData.reading_time || "5 min read"}
                      onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      value={formData.published_at || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Short Excerpt / Meta Description (150-160 chars) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief compelling summary for search engine results and article cards..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Cover Image URL or Studio Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none text-xs"
                      placeholder="Paste image URL..."
                    />
                    <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-easyva-purple-600" />
                      <span>Upload & Crop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.cover_image && (
                    <div className="mt-2 w-32 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                      <img
                        src={formData.cover_image}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Featured Products Embed */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Featured Products Mentioned in this Story
                  </label>
                  <p className="text-[11px] text-slate-400 mb-1.5">
                    Select catalog items to embed clickable shopping cards inside the article.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                    {products.map((p) => {
                      const isSelected = formData.featured_products?.includes(p.slug);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-[11px] cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-purple-50 border-easyva-purple-300 text-easyva-purple-900 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const cur = formData.featured_products || [];
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  featured_products: [...cur, p.slug],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  featured_products: cur.filter((s: string) => s !== p.slug),
                                });
                              }
                            }}
                            className="rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                          />
                          <span className="truncate">{p.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Markdown Editor / Preview Tabs */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("write")}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          activeTab === "write"
                            ? "bg-easyva-purple-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Markdown Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          activeTab === "preview"
                            ? "bg-easyva-purple-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>

                    <label className="text-[11px] font-bold text-easyva-purple-600 hover:underline cursor-pointer flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Upload .md file</span>
                      <input
                        type="file"
                        accept=".md,.txt,.markdown"
                        onChange={handleMdFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {activeTab === "write" ? (
                    <div>
                      <textarea
                        rows={14}
                        required
                        placeholder="Type or paste your Markdown content here (# Heading, ## Section, **bold**, lists, > blockquotes)..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Direct paste from ChatGPT, Claude, or any Markdown document supported seamlessly.
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[300px] max-h-[420px] overflow-y-auto prose prose-slate text-xs leading-relaxed">
                      {formData.content ? (
                        <div className="whitespace-pre-wrap font-sans">
                          {formData.content}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No content to preview yet.</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="blog_publish_check"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                  />
                  <label
                    htmlFor="blog_publish_check"
                    className="text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    Publish immediately (Visible on /blog and sitemap)
                  </label>
                </div>
              </div>

              {/* Pinned Sticky Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  {formData.id ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {selectedFileForCrop && (
        <ImageCropperModal
          imageFile={selectedFileForCrop}
          onCropComplete={handleCroppedUpload}
          onCancel={() => setSelectedFileForCrop(null)}
        />
      )}
    </div>
  );
}
