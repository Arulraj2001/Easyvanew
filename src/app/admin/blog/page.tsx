"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Copy,
  Upload,
  Sparkles,
  BookOpen,
  Calendar,
  Tag,
  ExternalLink,
  Search,
  Globe,
  HelpCircle,
  Check,
  AlertCircle,
  Download,
  UploadCloud,
  X,
  Laptop,
  Smartphone,
  ChevronDown,
  ShoppingBag,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";
import { BlogPost, Product, BlogFaqItem } from "@/lib/types";
import ImageCropperModal from "@/components/ImageCropperModal";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const BLOG_CATEGORIES = [
  "Artisan Traditions",
  "Home Decor Styling",
  "Living with Heritage",
  "Gifting Guides",
  "Art & Craftsmanship",
];

const MASTER_AI_PROMPT = `Generate an in-depth, high-ranking 1,200-word SEO article for Easyva (an authentic South Indian artisan & handicraft boutique in Coimbatore, Tamil Nadu).

IMPORTANT STYLING & FORMATTING RULES FOR "content":
1. Use a clear # Catchy H1 Heading with the primary keyword.
2. Use ## (H2) for each numbered main section (e.g. ## 1. Thanjavur Paintings: 22K Gold & Devotion).
3. Use ### (H3) for ALL sub-sections (e.g. ### Artisan Technique & Materials, ### How to Spot Real vs Machine Fakes, ### Modern Interior Styling Tips). Never leave section labels as plain text.
4. Format all key takeaways as bullet points starting with bold keywords (e.g. - **Surface Relief**: Meticulous tamarind seed gesso...).
5. Format ordered sequences as 1. 2. 3. numbered lists.
6. Include at least two blockquotes with curator insights (e.g. > **Curator's Pro Tip**: Always illuminate gold foil with warm 2700K accent spotlights...).
7. Include a dedicated care section with ### Care & Maintenance Guidelines.
8. End with ## Conclusion: Supporting Rural Artisan Heritage.
9. Return valid JSON only with escaped newlines (\\n\\n) in the content string.

Return your response strictly as valid JSON matching this exact structure:

{
  "title": "Tamil Nadu Handicrafts Online: A Collector's Guide to Authentic South Indian Art",
  "slug": "tamil-nadu-handicrafts-online-collectors-guide",
  "category": "Artisan Traditions",
  "primary_keyword": "Tamil Nadu handicrafts online",
  "secondary_keywords": [
    "Thanjavur paintings Chennai",
    "Swamimalai bronze idols",
    "Chettinad terracotta pottery",
    "authentic Indian handicraft store",
    "South Indian heritage home decor"
  ],
  "meta_title": "Tamil Nadu Handicrafts Online: Authentic Artisan Buying Guide | Easyva",
  "meta_description": "Shop authentic Tamil Nadu handicrafts online. Discover genuine Thanjavur gold leaf paintings, Swamimalai bronze, and Chettinad pottery directly from artisans.",
  "canonical_url": "https://easyva.in/blog/tamil-nadu-handicrafts-online-collectors-guide",
  "cover_image": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
  "excerpt": "Discover how ancient master sculptors, gold-leaf gilders, and terracotta artisans across Tamil Nadu bring timeless heritage and tactile soul to contemporary luxury spaces.",
  "reading_time": "6 min read",
  "tags": ["Tamil Nadu Crafts", "Heritage Decor", "Handmade India", "Artisan Luxury", "Thanjavur Art"],
  "author_name": "Murugan Boutique & Artisan Guild",
  "author_role": "Heritage Craft Curator",
  "faq_items": [
    {
      "question": "How do you verify the authenticity of a genuine Thanjavur painting?",
      "answer": "Authentic Thanjavur paintings feature high-relief gesso work sculpted with natural tamarind seed paste, layered with certified 22-karat beaten gold foil and genuine semi-precious Jaipur gemstones mounted on solid teakwood boards. Machine prints are flat, lack tactile relief, and reflect an unnatural glossy plastic sheen."
    },
    {
      "question": "What is the lost-wax casting technique used for Swamimalai bronze idols?",
      "answer": "In Swamimalai, master sthapathis hand-sculpt each deity in beeswax, coat it with Kaveri riverbed alluvial clay, melt the wax away with heat (cire perdue), and cast molten Panchaloha bronze into the hollow void. Since the clay mold must be broken to extract the idol, every single piece is a one-of-a-kind original."
    },
    {
      "question": "How should I care for Chettinad terracotta and handmade pottery?",
      "answer": "Dust regularly with a dry microfibre brush or soft cotton cloth. Never use harsh chemical detergents on unglazed porous terracotta. Keep indoor pots away from continuous standing moisture to preserve the natural earthen patina."
    },
    {
      "question": "Does Easyva provide breakage insurance for fragile handicraft shipments?",
      "answer": "Yes, all delicate ceramics, Thanjavur glass frames, and terracotta artworks are cushioned in eco-friendly honeycomb shock wrap and double-walled heavy-gauge export cartons, covered by our 100% transit damage guarantee with immediate replacement."
    }
  ],
  "content": "# Tamil Nadu Handicrafts Online: A Collector's Guide to Authentic South Indian Art\\n\\nTamil Nadu has flourished for millennia as the cradle of sacred South Indian craft culture. For homeowners and interior designers seeking authenticity over mass-produced factory decor, handcrafted heritage art offers unmatched textural character, tactile history, and sustainable soul.\\n\\n## 1. Classical Thanjavur Paintings: 22K Gold Foil & Devotional Radiance\\n\\nOriginating under the 16th-century Maratha kings of Thanjavur, Tanjore art represents the pinnacle of surface embellishment.\\n\\n### Master Artisan Technique & Materials\\n\\n- **The Base Foundation**: High-grade unbleached cotton fabric is stretched and pasted onto seasoned teakwood with natural arabic gum.\\n- **Surface Relief (Muck Work)**: Tamarind seed paste blended with chalk powder is hand-piped to create three-dimensional relief on crowns, pillars, and jewellery.\\n- **Pure 22-Karat Gold Foil**: Paper-thin beaten gold foil is meticulously pressed over the raised motifs, burnished to a luminous warm twilight glow.\\n\\n### How to Spot Genuine Authenticity vs Fakes\\n\\nRun your fingertips gently across the surface. Genuine Tanjore art has pronounced, organic relief variations with natural depth. Beware of cheap digital prints mounted under glass that mimic gold with metallic ink.\\n\\n> **Curator's Pro Tip**: Illuminate your Thanjavur canvas with 2700K warm spotlighting at a 30-degree ceiling angle to amplify the reflective brilliance of the 22K gold leaf.\\n\\n## 2. Swamimalai Bronze Idols: Chola Lost-Wax Mastery\\n\\nOn the banks of the sacred Kaveri River, Swamimalai artisans carry forth the GI-protected (Geographical Indication) bronze casting tradition dating back to the Imperial Chola Dynasty.\\n\\n### The Lost-Wax Casting Process\\n\\n1. **Beeswax Sculpting**: Master sthapathis carve the divine form according to strict Shilpa Shastra proportions.\\n2. **Clay Coating**: Fine alluvial clay from the Kaveri River is applied in progressive layers and sun-dried.\\n3. **De-Waxing & Metal Pouring**: Molten Panchaloha alloy (copper, zinc, lead, gold, silver) is poured into the hollow baked mold.\\n4. **Hand Chiselling**: The mold is shattered, and artisans spend 3 to 4 weeks chiselling intricate ornamentation by hand.\\n\\n## 3. Chettinad Terracotta & Handmade Pottery\\n\\nFrom the palatial courtyards of Karaikudi and Chettinad comes rustic pottery fired in traditional wood kilns with deep earthen magnetism.\\n\\n### Contemporary Architectural Styling Tips\\n\\n- **Entryway Statement**: Group three varying-height terracotta urns on micro-cement flooring for immediate warmth.\\n- **Botanical Corners**: Pair raw fluted planters with lush indoor foliage like fiddle leaf figs and monstera.\\n\\n## Care & Preservation Guide for Heritage Crafts\\n\\n- **Thanjavur Art**: Keep away from direct sunlight, damp walls, and high-humidity bathrooms. Dust only with a dry lint-free cloth.\\n- **Swamimalai Bronzes**: Clean periodically with a mild tamarind-water paste, rinse with fresh water, and buff dry to restore golden luster.\\n- **Terracotta Pieces**: Keep unglazed terracotta dry and avoid abrasive cleaners.\\n\\n## Conclusion: Preserving Living Heritage in Modern Homes\\n\\nWhen you invest in authentic Tamil Nadu handicrafts online from Easyva, you directly support master artisan families across Coimbatore, Thanjavur, and Swamimalai, preserving sacred craft knowledge for future generations."
}`;

function parseImportedContent(raw: string): Partial<BlogPost> {
  // Normalize smart / curly quotes, smart apostrophes, and unusual dashes before parsing
  const clean = raw
    .trim()
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

  const text = clean;

  // 1. Try parsing JSON
  if (text.startsWith("{") || (text.includes("```json") && text.includes("}"))) {
    try {
      let jsonStr = text;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      const data = JSON.parse(jsonStr);
      return {
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "Artisan Traditions",
        excerpt: data.excerpt || data.meta_description || "",
        content: data.content || data.body || "",
        cover_image: data.cover_image || "/images/banners/banner1.webp",
        tags: Array.isArray(data.tags) ? data.tags : ["Tamil Nadu Crafts"],
        primary_keyword: data.primary_keyword || data.seo?.primary_keyword || "",
        secondary_keywords: Array.isArray(data.secondary_keywords)
          ? data.secondary_keywords
          : Array.isArray(data.seo?.secondary_keywords)
          ? data.seo.secondary_keywords
          : [],
        meta_title: data.meta_title || data.seo?.meta_title || data.title || "",
        meta_description: data.meta_description || data.seo?.meta_description || data.excerpt || "",
        canonical_url: data.canonical_url || data.seo?.canonical_url || "",
        faq_items: Array.isArray(data.faq_items) ? data.faq_items : [],
        reading_time: data.reading_time || "5 min read",
        author_name: data.author_name || data.author?.name || "Murugan Boutique",
        author_role: data.author_role || data.author?.role || "Heritage Craft Curator",
      };
    } catch {
      // continue to next format
    }
  }

  // 2. Try parsing Markdown with Frontmatter (--- ... ---)
  if (text.startsWith("---")) {
    const parts = text.split("---");
    if (parts.length >= 3) {
      const frontmatter = parts[1];
      const body = parts.slice(2).join("---").trim();
      const meta: Record<string, any> = {};

      frontmatter.split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > -1) {
          const key = line.slice(0, colonIdx).trim().toLowerCase();
          let val = line.slice(colonIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (val.startsWith("[") && val.endsWith("]")) {
            meta[key] = val
              .slice(1, -1)
              .split(",")
              .map((s) => s.trim().replace(/^["']|["']$/g, ""))
              .filter(Boolean);
          } else {
            meta[key] = val;
          }
        }
      });

      return {
        title: meta.title || "",
        slug: meta.slug || "",
        category: meta.category || "Artisan Traditions",
        excerpt: meta.excerpt || meta.meta_description || "",
        content: body,
        cover_image: meta.cover_image || "/images/banners/banner1.webp",
        tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : ["Handicrafts"],
        primary_keyword: meta.primary_keyword || "",
        secondary_keywords: Array.isArray(meta.secondary_keywords) ? meta.secondary_keywords : [],
        meta_title: meta.meta_title || meta.title || "",
        meta_description: meta.meta_description || meta.excerpt || "",
        canonical_url: meta.canonical_url || "",
        faq_items: [],
        reading_time: meta.reading_time || "5 min read",
        author_name: meta.author_name || "Murugan Boutique",
        author_role: meta.author_role || "Heritage Craft Curator",
      };
    }
  }

  // 3. Fallback: Raw Markdown
  const lines = text.split("\n");
  let detectedTitle = "";
  const bodyLines: string[] = [];
  for (const line of lines) {
    if (!detectedTitle && line.startsWith("# ")) {
      detectedTitle = line.replace("# ", "").trim();
    } else {
      bodyLines.push(line);
    }
  }
  const cleanBody = bodyLines.join("\n").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(2, Math.ceil(wordCount / 200));

  return {
    title: detectedTitle || "Untitled Story",
    slug: (detectedTitle || "untitled")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-"),
    category: "Artisan Traditions",
    excerpt: cleanBody.slice(0, 160).replace(/[#*`_]/g, "").trim() + "...",
    content: cleanBody || text,
    cover_image: "/images/banners/banner1.webp",
    tags: ["Tamil Nadu Crafts", "Handicrafts"],
    primary_keyword: detectedTitle ? detectedTitle.split(" ").slice(0, 3).join(" ") : "",
    secondary_keywords: [],
    meta_title: detectedTitle || "",
    meta_description: cleanBody.slice(0, 155).replace(/[#*`_]/g, "").trim(),
    canonical_url: "",
    faq_items: [],
    reading_time: `${readMins} min read`,
    author_name: "Murugan Boutique",
    author_role: "Heritage Craft Curator",
  };
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal State
  const [showModal, setShowModal] = useState(false);
  const [editorTab, setEditorTab] = useState<"content" | "seo" | "faqs" | "products">("content");
  const [markdownView, setMarkdownView] = useState<"write" | "preview">("write");

  // Importer Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<"paste" | "upload" | "prompt">("paste");
  const [importInputText, setImportInputText] = useState("");
  const [importPreviewData, setImportPreviewData] = useState<Partial<BlogPost> | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Secondary Keyword Input Temp State
  const [tempSecondaryKey, setTempSecondaryKey] = useState("");
  const [tempTag, setTempTag] = useState("");

  // SERP Preview Device Toggle
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");

  // Image Upload & Crop
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);

  // Main Form Data State
  const [formData, setFormData] = useState<BlogPost>({
    id: "",
    title: "",
    slug: "",
    category: "Artisan Traditions",
    excerpt: "",
    content: "",
    cover_image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
    tags: ["Tamil Nadu Crafts", "Handicrafts"],
    primary_keyword: "",
    secondary_keywords: [],
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    faq_items: [],
    reading_time: "5 min read",
    read_time_minutes: 5,
    is_published: true,
    published_at: new Date().toISOString().split("T")[0],
    featured_products: [],
    author_name: "Murugan Boutique",
    author_role: "Heritage Craft Curator",
    author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
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

  // Title change syncs slug and SEO defaults if clean
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => {
      const isNew = !prev.id;
      return {
        ...prev,
        title: val,
        slug: isNew ? slug : prev.slug,
        meta_title: prev.meta_title && !isNew ? prev.meta_title : val,
        canonical_url: isNew ? `https://easyva.in/blog/${slug}` : prev.canonical_url,
      };
    });
  };

  // Image Upload Handlers
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

  // Markdown file upload directly into content
  const handleMdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseImportedContent(text);
        setFormData((prev) => ({
          ...prev,
          title: parsed.title || prev.title,
          slug: parsed.slug || prev.slug,
          content: parsed.content || text,
          excerpt: parsed.excerpt || prev.excerpt,
          primary_keyword: parsed.primary_keyword || prev.primary_keyword,
          secondary_keywords: parsed.secondary_keywords?.length ? parsed.secondary_keywords : prev.secondary_keywords,
          meta_title: parsed.meta_title || prev.meta_title,
          meta_description: parsed.meta_description || prev.meta_description,
          reading_time: parsed.reading_time || prev.reading_time,
        }));
      }
    };
    reader.readAsText(file);
  };

  // Save Post to API
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert("Title and URL Slug are required.");
      return;
    }

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
      alert(err.message || "Network error while saving post");
    }
  };

  // Delete Post
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

  // Export Post as JSON file
  const handleExportPost = (post: BlogPost) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(post, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${post.slug || "article"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Open New Post Form
  const openNewPostModal = () => {
    setFormData({
      id: "",
      title: "",
      slug: "",
      category: "Artisan Traditions",
      excerpt: "",
      content: "",
      cover_image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
      tags: ["Tamil Nadu Crafts", "Handicrafts"],
      primary_keyword: "",
      secondary_keywords: [],
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      faq_items: [],
      reading_time: "5 min read",
      read_time_minutes: 5,
      is_published: true,
      published_at: new Date().toISOString().split("T")[0],
      featured_products: [],
      author_name: "Murugan Boutique",
      author_role: "Heritage Craft Curator",
      author_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    });
    setEditorTab("content");
    setMarkdownView("write");
    setShowModal(true);
  };

  // Open Edit Form
  const openEditModal = (p: BlogPost) => {
    setFormData({
      ...p,
      primary_keyword: p.primary_keyword || p.seo?.primary_keyword || "",
      secondary_keywords: p.secondary_keywords || p.seo?.secondary_keywords || [],
      meta_title: p.meta_title || p.seo?.meta_title || p.title,
      meta_description: p.meta_description || p.seo?.meta_description || p.excerpt,
      canonical_url: p.canonical_url || `https://easyva.in/blog/${p.slug}`,
      faq_items: p.faq_items || [],
      reading_time: p.reading_time || `${p.read_time_minutes || 5} min read`,
      author_name: p.author?.name || p.author_name || "Murugan Boutique",
      author_role: p.author?.role || p.author_role || "Heritage Craft Curator",
      author_avatar: p.author?.avatar || p.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    });
    setEditorTab("content");
    setMarkdownView("write");
    setShowModal(true);
  };

  // Importer analyze action
  const handleAnalyzePastedText = () => {
    if (!importInputText.trim()) return;
    const parsed = parseImportedContent(importInputText);
    setImportPreviewData(parsed);
  };

  // Importer apply action
  const handleApplyImportedData = () => {
    if (!importPreviewData) return;
    setFormData((prev) => ({
      ...prev,
      ...importPreviewData,
      id: prev.id || "",
    }));
    setShowImportModal(false);
    setShowModal(true);
    setEditorTab("content");
  };

  // Import from local file (.json or .md)
  const handleImportFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportInputText(text);
        const parsed = parseImportedContent(text);
        setImportPreviewData(parsed);
      }
    };
    reader.readAsText(file);
  };

  // FAQ Repeater operations
  const handleAddFaqItem = () => {
    const items = formData.faq_items || [];
    setFormData({
      ...formData,
      faq_items: [...items, { question: "", answer: "" }],
    });
  };

  const handleUpdateFaqItem = (index: number, field: "question" | "answer", val: string) => {
    const items = [...(formData.faq_items || [])];
    items[index] = { ...items[index], [field]: val };
    setFormData({ ...formData, faq_items: items });
  };

  const handleRemoveFaqItem = (index: number) => {
    const items = [...(formData.faq_items || [])];
    items.splice(index, 1);
    setFormData({ ...formData, faq_items: items });
  };

  // Secondary Keyword Tags Operations
  const handleAddSecondaryKey = () => {
    const clean = tempSecondaryKey.trim();
    if (!clean) return;
    const current = formData.secondary_keywords || [];
    if (!current.includes(clean)) {
      setFormData({ ...formData, secondary_keywords: [...current, clean] });
    }
    setTempSecondaryKey("");
  };

  const handleRemoveSecondaryKey = (idx: number) => {
    const current = [...(formData.secondary_keywords || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, secondary_keywords: current });
  };

  // General Tag Operations
  const handleAddTag = () => {
    const clean = tempTag.trim();
    if (!clean) return;
    const current = formData.tags || [];
    if (!current.includes(clean)) {
      setFormData({ ...formData, tags: [...current, clean] });
    }
    setTempTag("");
  };

  const handleRemoveTag = (idx: number) => {
    const current = [...(formData.tags || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, tags: current });
  };

  // Live SEO Metrics Computation
  const seoAudit = useMemo(() => {
    const pk = (formData.primary_keyword || "").trim().toLowerCase();
    const title = (formData.title || "").toLowerCase();
    const slug = (formData.slug || "").toLowerCase();
    const metaDesc = (formData.meta_description || "").toLowerCase();
    const content = (formData.content || "").toLowerCase();

    const inTitle = pk ? title.includes(pk) : false;
    const inSlug = pk ? slug.includes(pk.replace(/\s+/g, "-")) : false;
    const inMetaDesc = pk ? metaDesc.includes(pk) : false;

    // First paragraph check
    const firstPara = content.split("\n\n")[0] || "";
    const inFirstPara = pk ? firstPara.includes(pk) : false;

    // Word count & keyword density
    const words = content.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let occurrences = 0;
    if (pk && wordCount > 0) {
      const regex = new RegExp(`\\b${pk}\\b`, "gi");
      const matches = content.match(regex);
      occurrences = matches ? matches.length : 0;
    }
    const density = wordCount > 0 ? ((occurrences / wordCount) * 100).toFixed(1) : "0";

    return {
      pk,
      inTitle,
      inSlug,
      inMetaDesc,
      inFirstPara,
      wordCount,
      occurrences,
      density,
    };
  }, [formData.primary_keyword, formData.title, formData.slug, formData.meta_description, formData.content]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-easyva-purple-600" />
            Artisan Stories & SEO Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Rank authentic handicrafts on Google with targeted primary & secondary keywords, live Google SERP preview, FAQ Schema.org rich snippets, and 1-click AI import from ChatGPT/Claude.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Universal Importer Button */}
          <button
            onClick={() => {
              setImportInputText("");
              setImportPreviewData(null);
              setShowImportModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Import & Paste</span>
          </button>

          {/* New Story Button */}
          <button
            onClick={openNewPostModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Articles</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{posts.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Published Live</span>
          <span className="text-xl font-black text-emerald-700 mt-0.5 block">
            {posts.filter((p) => p.is_published).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Categories Active</span>
          <span className="text-xl font-black text-easyva-purple-700 mt-0.5 block">
            {new Set(posts.map((p) => p.category)).size}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Schema Rich Snippets</span>
          <span className="text-xl font-black text-indigo-700 mt-0.5 block">
            {posts.filter((p) => p.faq_items && p.faq_items.length > 0).length} FAQs
          </span>
        </div>
      </div>

      {/* Posts List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            All Artisan Articles ({posts.length})
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Synced with XML Sitemaps, OpenGraph cards & Google Structured Data
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading articles...</div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No articles published yet.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "AI Import & Paste" to load a complete artisan article in seconds, or compose your first story.
              </p>
              <button
                onClick={openNewPostModal}
                className="mt-2 px-4 py-2 bg-easyva-purple-600 text-white rounded-xl text-xs font-bold"
              >
                Compose First Article
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
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
                      {post.is_published ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {post.reading_time || "5 min read"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {post.published_at}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                      {post.excerpt}
                    </p>

                    {/* SEO Quick Tags */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                      {post.primary_keyword && (
                        <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50/80 px-2 py-0.5 rounded-md border border-purple-200">
                          <span>🎯</span>
                          <span>Focus: {post.primary_keyword}</span>
                        </span>
                      )}
                      {post.faq_items && post.faq_items.length > 0 && (
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          <span>❓</span>
                          <span>{post.faq_items.length} Google FAQs</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
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
                    onClick={() => handleExportPost(post)}
                    className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Export article as JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(post)}
                    className="p-2 text-slate-600 hover:text-easyva-purple-600 rounded-xl hover:bg-slate-100 transition-colors"
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

      {/* ========================================================================= */}
      {/* UNIVERSAL AI IMPORTER & GENERATOR MODAL                                    */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-easyva-purple-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    AI Article Importer & Prompt Studio
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Paste JSON or Markdown from ChatGPT/Claude, upload files, or copy our master SEO prompt.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
              <button
                type="button"
                onClick={() => setImportTab("paste")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  importTab === "paste"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                1-Click Paste & Auto-Fill
              </button>
              <button
                type="button"
                onClick={() => setImportTab("upload")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  importTab === "upload"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Import .json / .md File
              </button>
              <button
                type="button"
                onClick={() => setImportTab("prompt")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  importTab === "prompt"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Master AI Prompt Template
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {importTab === "paste" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Paste Raw JSON or Markdown with Frontmatter:
                    </label>
                    <textarea
                      rows={10}
                      value={importInputText}
                      onChange={(e) => {
                        setImportInputText(e.target.value);
                        setImportPreviewData(null);
                      }}
                      placeholder={`Paste raw JSON output from ChatGPT or Gemini here...
Example:
{
  "title": "Top Traditional Handicrafts of Tamil Nadu",
  "primary_keyword": "Tamil Nadu handicrafts",
  "secondary_keywords": ["Thanjavur paintings", "Swamimalai bronze"],
  "meta_title": "Top Traditional Handicrafts of Tamil Nadu | Easyva",
  "meta_description": "Explore authentic Thanjavur paintings and Swamimalai bronze...",
  "faq_items": [
    { "question": "Are bronze statues authentic?", "answer": "Yes, GI certified." }
  ],
  "content": "# Full article body in Markdown..."
}`}
                      className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setImportInputText(MASTER_AI_PROMPT.split("strictly as valid JSON matching this exact structure:")[1].trim());
                      }}
                      className="text-xs text-easyva-purple-600 hover:underline font-bold"
                    >
                      Fill with Sample Post
                    </button>

                    <button
                      type="button"
                      onClick={handleAnalyzePastedText}
                      disabled={!importInputText.trim()}
                      className="px-5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze & Parse Fields</span>
                    </button>
                  </div>

                  {/* Parsed Inspection Card */}
                  {importPreviewData && (
                    <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-easyva-purple-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Parsed Successfully! Ready to Load:
                        </span>
                        <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                          {importPreviewData.category || "Artisan Traditions"}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-700">
                        <div>
                          <strong className="text-slate-900">Title:</strong> {importPreviewData.title}
                        </div>
                        {importPreviewData.primary_keyword && (
                          <div>
                            <strong className="text-slate-900">Primary Keyword:</strong>{" "}
                            <span className="text-purple-700 font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">
                              {importPreviewData.primary_keyword}
                            </span>
                          </div>
                        )}
                        {importPreviewData.secondary_keywords && importPreviewData.secondary_keywords.length > 0 && (
                          <div>
                            <strong className="text-slate-900">Secondary Keywords:</strong>{" "}
                            {importPreviewData.secondary_keywords.join(", ")}
                          </div>
                        )}
                        {importPreviewData.faq_items && importPreviewData.faq_items.length > 0 && (
                          <div>
                            <strong className="text-slate-900">FAQs Detected:</strong>{" "}
                            {importPreviewData.faq_items.length} question & answer pairs
                          </div>
                        )}
                        <div>
                          <strong className="text-slate-900">Body Word Count:</strong>{" "}
                          {(importPreviewData.content || "").split(/\s+/).filter(Boolean).length} words
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyImportedData}
                        className="w-full mt-2 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <span>Apply & Load into Editor</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {importTab === "upload" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 hover:border-easyva-purple-400 rounded-2xl p-8 text-center bg-slate-50 transition-colors">
                    <UploadCloud className="w-10 h-10 text-easyva-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Upload an Article File (.json or .md)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                      Supports direct JSON schema exports or Markdown documents with YAML metadata frontmatter.
                    </p>
                    <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 cursor-pointer shadow-xs transition-all">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept=".json,.md,.markdown,.txt"
                        onChange={handleImportFileSelected}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {importPreviewData && (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>File parsed successfully: "{importPreviewData.title}"</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyImportedData}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                      >
                        Load into Editor
                      </button>
                    </div>
                  )}
                </div>
              )}

              {importTab === "prompt" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Copy this tested system prompt and paste it into ChatGPT, Claude, or Gemini. Ask it to write about any craft topic, then paste its response into the "1-Click Paste" tab!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(MASTER_AI_PROMPT);
                        setCopiedPrompt(true);
                        setTimeout(() => setCopiedPrompt(false), 2500);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0 ml-3"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto border border-slate-800">
                    {MASTER_AI_PROMPT}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-FEATURED ARTICLE & SEO CMS MODAL                                     */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white max-w-5xl w-full max-h-[92vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {formData.id ? "Edit Artisan Article" : "Compose New Artisan Story"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Configure primary & secondary SEO keywords, Google FAQ schema, and markdown body.
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

            {/* Modal Navigation Sub-Tabs */}
            <div className="px-5 sm:px-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80 overflow-x-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditorTab("content")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  editorTab === "content"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                📝 Content & Media
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("seo")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  editorTab === "seo"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🎯 SEO & Keywords</span>
                {formData.primary_keyword && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("faqs")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  editorTab === "faqs"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>❓ FAQ Schema ({formData.faq_items?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("products")}
                className={`py-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  editorTab === "products"
                    ? "border-easyva-purple-600 text-easyva-purple-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                🛍️ Featured Products ({formData.featured_products?.length || 0})
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSavePost} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4 text-xs">
                {/* ========================================================= */}
                {/* TAB 1: CONTENT & MEDIA                                    */}
                {/* ========================================================= */}
                {editorTab === "content" && (
                  <div className="space-y-4">
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
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Preview: https://easyva.in/blog/{formData.slug || "slug"}
                        </span>
                      </div>
                    </div>

                    {/* Category, Reading Time & Date */}
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
                        Short Excerpt (Displayed on article cards & archive) *
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
                        <div className="mt-2 w-36 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                          <img
                            src={formData.cover_image}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Markdown Editor / Preview Tabs */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setMarkdownView("write")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              markdownView === "write"
                                ? "bg-easyva-purple-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            Markdown Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => setMarkdownView("preview")}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                              markdownView === "preview"
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

                      {markdownView === "write" ? (
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
                        <div className="p-5 sm:p-7 bg-white rounded-2xl border border-slate-200 min-h-[350px] max-h-[500px] overflow-y-auto shadow-inner">
                          {formData.content ? (
                            <MarkdownRenderer content={formData.content} />
                          ) : (
                            <span className="text-slate-400 italic">No content to preview yet. Write or import Markdown to view live styling.</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: SEO & KEYWORDS METRICS                             */}
                {/* ========================================================= */}
                {editorTab === "seo" && (
                  <div className="space-y-5">
                    {/* Focus Primary Keyword & Secondary Keywords */}
                    <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200/80 space-y-4">
                      <div>
                        <label className="block text-slate-900 font-black mb-1">
                          🎯 Primary Focus Keyword *
                        </label>
                        <p className="text-[11px] text-slate-500 mb-1.5">
                          The main search query you want this article to rank for (e.g. "Tamil Nadu handicrafts online", "Thanjavur paintings Chennai").
                        </p>
                        <input
                          type="text"
                          placeholder="e.g. Tamil Nadu handicrafts online"
                          value={formData.primary_keyword || ""}
                          onChange={(e) => setFormData({ ...formData, primary_keyword: e.target.value })}
                          className="w-full bg-white p-2.5 rounded-xl border border-purple-300 font-bold text-slate-900 focus:border-easyva-purple-600 outline-none"
                        />
                      </div>

                      {/* Secondary Keywords */}
                      <div>
                        <label className="block text-slate-900 font-black mb-1">
                          🏷️ Secondary / LSI Keywords
                        </label>
                        <p className="text-[11px] text-slate-500 mb-1.5">
                          Related synonyms and long-tail phrases that support your primary ranking.
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type keyword and click Add..."
                            value={tempSecondaryKey}
                            onChange={(e) => setTempSecondaryKey(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSecondaryKey();
                              }
                            }}
                            className="flex-1 bg-white p-2 rounded-xl border border-purple-200 text-slate-900 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddSecondaryKey}
                            className="px-3.5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold rounded-xl transition-all"
                          >
                            Add
                          </button>
                        </div>

                        {formData.secondary_keywords && formData.secondary_keywords.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-2">
                            {formData.secondary_keywords.map((k, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[11px] bg-white font-semibold text-purple-900 px-2.5 py-1 rounded-lg border border-purple-200"
                              >
                                <span>{k}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSecondaryKey(idx)}
                                  className="text-purple-400 hover:text-red-600 font-bold ml-1"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live SEO Audit Scorecard */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                        Live On-Page SEO Checklist
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            seoAudit.inTitle
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          {seoAudit.inTitle ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-bold text-[11px]">Keyword in Title</span>
                        </div>

                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            seoAudit.inSlug
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          {seoAudit.inSlug ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-bold text-[11px]">Keyword in URL</span>
                        </div>

                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            seoAudit.inMetaDesc
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          {seoAudit.inMetaDesc ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-bold text-[11px]">In Meta Desc</span>
                        </div>

                        <div
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            seoAudit.inFirstPara
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                        >
                          {seoAudit.inFirstPara ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="font-bold text-[11px]">In Intro / First Para</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>
                          Word Count: <strong className="text-slate-800">{seoAudit.wordCount}</strong> words
                        </span>
                        <span>
                          Keyword Density:{" "}
                          <strong className="text-slate-800">
                            {seoAudit.density}% ({seoAudit.occurrences} matches)
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Meta Title & Description with Progress Indicators */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold">
                            Meta Title (Target: 50–60 characters)
                          </label>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              (formData.meta_title || "").length > 60
                                ? "text-red-600"
                                : (formData.meta_title || "").length >= 45
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {(formData.meta_title || "").length} / 60
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Top 7 Traditional Handicrafts of Tamil Nadu | Easyva"
                          value={formData.meta_title || ""}
                          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                          className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold">
                            Meta Description (Target: 140–160 characters)
                          </label>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              (formData.meta_description || "").length > 160
                                ? "text-red-600"
                                : (formData.meta_description || "").length >= 120
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {(formData.meta_description || "").length} / 160
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Compelling 150-character summary that convinces searchers to click..."
                          value={formData.meta_description || ""}
                          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                          className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-700 font-bold">
                            Canonical URL
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                canonical_url: `https://easyva.in/blog/${formData.slug}`,
                              })
                            }
                            className="text-easyva-purple-600 hover:underline text-[11px] font-bold"
                          >
                            Use Default
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder={`https://easyva.in/blog/${formData.slug || "your-slug"}`}
                          value={formData.canonical_url || ""}
                          onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                          className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Google SERP Live Snippet Preview */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          Google Search SERP Preview
                        </span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setSerpDevice("desktop")}
                            className={`p-1 rounded text-xs ${
                              serpDevice === "desktop" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"
                            }`}
                            title="Desktop View"
                          >
                            <Laptop className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSerpDevice("mobile")}
                            className={`p-1 rounded text-xs ${
                              serpDevice === "mobile" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700"
                            }`}
                            title="Mobile View"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Google Result Card Mockup */}
                      <div
                        className={`bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1 ${
                          serpDevice === "mobile" ? "max-w-sm mx-auto" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-easyva-purple-600 text-white flex items-center justify-center text-[9px] font-black">
                            E
                          </div>
                          <div className="text-[11px] text-slate-700 truncate leading-none">
                            <span className="font-semibold text-slate-900">Easyva</span>
                            <span className="text-slate-400 mx-1">›</span>
                            <span className="text-slate-500">blog</span>
                            <span className="text-slate-400 mx-1">›</span>
                            <span className="text-slate-500">{formData.slug || "slug"}</span>
                          </div>
                        </div>

                        <h4 className="text-base sm:text-lg text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug line-clamp-2">
                          {formData.meta_title || formData.title || "Article Title | Easyva Artisan"}
                        </h4>

                        <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                          {formData.meta_description || formData.excerpt || "Article snippet will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: FAQ BUILDER (GOOGLE FAQPAGE SCHEMA)               */}
                {/* ========================================================= */}
                {editorTab === "faqs" && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200/70 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-black text-indigo-900">
                          Google FAQPage Structured Data Generator
                        </h4>
                        <p className="text-[11px] text-indigo-700/90 leading-relaxed mt-0.5">
                          Questions and answers entered here automatically inject Schema.org JSON-LD onto the public article, unlocking expandable accordion dropdowns directly on Google Search result pages.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(formData.faq_items || []).map((faq, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-700">
                              Question #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFaqItem(idx)}
                              className="text-slate-400 hover:text-red-600 text-xs font-bold transition-colors"
                            >
                              ✕ Remove
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="e.g. How are Swamimalai bronze statues made?"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaqItem(idx, "question", e.target.value)}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:border-easyva-purple-500 outline-none"
                          />

                          <textarea
                            rows={2}
                            placeholder="Detailed factual answer with care tips and artisan techniques..."
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaqItem(idx, "answer", e.target.value)}
                            className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFaqItem}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another FAQ Question</span>
                    </button>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 4: FEATURED STORE PRODUCTS                             */}
                {/* ========================================================= */}
                {editorTab === "products" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1">
                        Select Store Products to Embed in this Story
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        These products will automatically render as interactive shopping cards at the bottom of the article.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-2 border border-slate-200 rounded-2xl bg-slate-50/50">
                      {products.map((p) => {
                        const isSelected = formData.featured_products?.includes(p.slug);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-[11px] cursor-pointer transition-colors ${
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
                              className="mt-0.5 rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate font-bold text-slate-900">{p.title}</span>
                              <span className="text-[10px] text-slate-500">₹{p.price.toLocaleString("en-IN")}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Immediate Publish Checkbox */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
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
                    Publish immediately (Visible on /blog, XML sitemap, and search engine crawlers)
                  </label>
                </div>
              </div>

              {/* Pinned Sticky Footer */}
              <div className="flex items-center justify-between px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {formData.id && (
                    <button
                      type="button"
                      onClick={() => handleExportPost(formData)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
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
