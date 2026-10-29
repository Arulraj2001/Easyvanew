"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  Search, 
  Sparkles,
  Package,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2
} from "lucide-react";
import { Product, Category } from "@/lib/types";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    id: "",
    title: "",
    slug: "",
    category_id: "",
    summary: "",
    description: "",
    price: 999,
    compare_at_price: 1499,
    stock: 10,
    sku: "",
    is_featured: false,
    is_published: true,
    images: [],
    attributes: { Material: "Handcrafted Studio Item", Care: "Gentle wipe with soft cloth" },
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories?all=true"),
      ]);
      const prods = await prodRes.json();
      const cats = await catRes.json();
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (prodToEdit?: Product) => {
    if (prodToEdit) {
      setFormData({
        ...prodToEdit,
        attributes: prodToEdit.attributes || { Material: "Handcrafted", Care: "Gentle wipe" },
      });
    } else {
      setFormData({
        id: "",
        title: "",
        slug: "",
        category_id: categories[0]?.id || "",
        summary: "",
        description: "",
        price: 999,
        compare_at_price: 1499,
        stock: 15,
        sku: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
        is_featured: false,
        is_published: true,
        images: [],
        attributes: { Material: "Handcrafted Studio Item", Care: "Gentle wipe with soft dry cloth" },
      });
    }
    setImageUrlInput("");
    setShowModal(true);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.id ? prev.slug : slug,
    }));
  };

  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(null);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Launch interactive cropper & compressor modal
    setSelectedFileForCrop(file);
    e.target.value = ""; // reset file input
  };

  const handleCroppedUpload = async (blob: Blob) => {
    setSelectedFileForCrop(null);
    setUploadingImage(true);

    const body = new FormData();
    body.append("file", new File([blob], `product_${Date.now()}.webp`, { type: "image/webp" }));

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [
            ...(prev.images || []),
            {
              id: `img_${Date.now()}`,
              image_url: data.url,
              display_order: (prev.images?.length || 0) + 1,
            },
          ],
        }));
      }
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...(prev.images || []),
        {
          id: `img_${Date.now()}`,
          image_url: imageUrlInput.trim(),
          display_order: (prev.images?.length || 0) + 1,
        },
      ],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please provide title and price");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          is_featured: !product.is_featured,
        }),
      });
      fetchData();
    } catch (err) {
      alert("Failed to toggle featured status");
    }
  };

  // Build category options
  const allCategoryOptions: { id: string; label: string }[] = [];
  categories.forEach((cat) => {
    allCategoryOptions.push({ id: cat.id, label: `📁 ${cat.name}` });
    cat.subcategories?.forEach((sub) => {
      allCategoryOptions.push({ id: sub.id, label: `   ↳ ${sub.name}` });
    });
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "ALL" || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
            Artisan Catalog Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Artisan Product Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full CRUD operations: create, edit, update inventory, manage multi-image gallery, and feature items on storefront.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by product title or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:outline-none focus:border-easyva-purple-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 text-xs font-semibold text-slate-700 py-2.5 px-3 rounded-xl border border-slate-300 focus:bg-white outline-none"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {allCategoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">
            Showing: <strong className="text-slate-900">{filteredProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Display (Light Theme) */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
          Loading artisan catalog...
        </div>
      ) : (
        <>
          {/* MOBILE CARD VIEW (Phone screens < 768px) */}
          <div className="md:hidden space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
                No products match your search query.
              </div>
            ) : (
              filteredProducts.map((product) => {
                const img = product.images?.[0]?.image_url;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {img ? (
                          <Image
                            src={img}
                            alt={product.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              product.is_published !== false
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {product.is_published !== false ? "Live" : "Draft"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              product.stock > 5
                                ? "bg-emerald-50 text-emerald-700"
                                : product.stock > 0
                                ? "bg-amber-50 text-amber-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
                          {product.title}
                        </h4>

                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-black text-slate-900 text-base">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.compare_at_price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.compare_at_price.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono ml-auto">
                            SKU: {product.sku || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(product)}
                        className="flex-1 py-2 px-3 bg-easyva-purple-50 hover:bg-easyva-purple-100 text-easyva-purple-700 border border-easyva-purple-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center ${
                          product.is_featured
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 rounded-xl border border-slate-200"
                        title="View live product"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        disabled={deletingId === product.id}
                        className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-xl border border-rose-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DESKTOP TABLE VIEW (Screens ≥ 768px) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Creation Details</th>
                    <th className="py-3.5 px-4">Price / Discount</th>
                    <th className="py-3.5 px-4">Inventory</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No products match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const img = product.images?.[0]?.image_url;
                      return (
                        <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                {img ? (
                                  <Image
                                    src={img}
                                    alt={product.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="max-w-xs sm:max-w-md">
                                <div className="font-bold text-slate-900 line-clamp-1">
                                  {product.title}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                  <span>SKU: {product.sku || "—"}</span>
                                  <span>•</span>
                                  <Link
                                    href={`/product/${product.slug}`}
                                    target="_blank"
                                    className="text-easyva-purple-600 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>View</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900 text-sm">
                              ₹{product.price.toLocaleString("en-IN")}
                            </div>
                            {product.compare_at_price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ₹{product.compare_at_price.toLocaleString("en-IN")}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                product.stock > 5
                                  ? "bg-emerald-50 text-emerald-700"
                                  : product.stock > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {product.stock} in stock
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                product.is_published !== false
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {product.is_published !== false ? "Live" : "Draft"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleFeatured(product)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                                product.is_featured
                                  ? "bg-easyva-purple-50 text-easyva-purple-700 border border-easyva-purple-200"
                                  : "bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200"
                              }`}
                              title="Toggle Featured on Homepage"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{product.is_featured ? "Featured" : "Standard"}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.title)}
                              disabled={deletingId === product.id}
                              className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Product Modal (Responsive: Bottom Sheet on Mobile / Centered on Desktop) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-5 overflow-y-auto">
          <div className="relative bg-white w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            {/* Pinned Sticky Header */}
            <div className="flex items-center justify-between px-5 py-3 sm:px-6 sm:py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {formData.id ? "Edit Artisan Creation" : "Add New Artisan Creation"}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Fill in handcrafted details, specifications, and multiple studio photos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors"
                aria-label="Close"
              >
                ✕ Close
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Handcrafted Ceramic Mug"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="handcrafted-ceramic-mug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Category Mapping *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none font-semibold text-xs"
                    >
                      <option value="">Select Category</option>
                      {allCategoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Original Price (₹ MRP)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Strike-through price"
                      value={formData.compare_at_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compare_at_price: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Inventory Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={formData.sku || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4 sm:pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_featured: e.target.checked,
                          })
                        }
                        className="rounded text-easyva-purple-600 focus:ring-easyva-purple-500 w-4 h-4"
                      />
                      <span>Featured in Rails</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Short Summary (Google snippets & catalog preview)
                  </label>
                  <input
                    type="text"
                    placeholder="One sentence artisan highlight..."
                    value={formData.summary || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Full Description & Story
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detail the materials used, handcrafting techniques, and care instructions..."
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                  />
                </div>

                {/* Multi-Image Gallery Manager */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="block text-slate-700 font-bold">
                    Product Gallery Photos
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 bg-slate-50 p-2 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none text-[11px] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 text-xs"
                    >
                      Add URL
                    </button>
                    <label className="cursor-pointer px-3 py-2 bg-easyva-purple-50 hover:bg-easyva-purple-100 text-easyva-purple-700 font-bold rounded-xl border border-easyva-purple-200 flex items-center gap-1 text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Crop & Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadingImage && (
                    <p className="text-[10px] text-easyva-purple-600">Uploading photo...</p>
                  )}

                  {/* Thumbnails rail */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 flex-shrink-0"
                        >
                          <Image
                            src={img.image_url}
                            alt="preview"
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 bg-rose-600/80 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pinned Sticky Footer */}
              <div className="flex items-center justify-end gap-2 px-4 py-2.5 sm:px-6 sm:py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 sm:px-6 sm:py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  {formData.id ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Interactive Multi-Ratio Cropper & WebP Compressor Modal */}
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
