"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Layers, 
  Upload, 
  FolderPlus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    parent_id: "",
    description: "",
    image_url: "",
    display_order: 1,
    is_active: true,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?all=true");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (catToEdit?: Category, parentId?: string) => {
    if (catToEdit) {
      setFormData({
        id: catToEdit.id,
        name: catToEdit.name,
        slug: catToEdit.slug,
        parent_id: catToEdit.parent_id || "",
        description: catToEdit.description || "",
        image_url: catToEdit.image_url || "",
        display_order: catToEdit.display_order || 1,
        is_active: catToEdit.is_active ?? true,
      });
    } else {
      setFormData({
        id: "",
        name: "",
        slug: "",
        parent_id: parentId || "",
        description: "",
        image_url: "",
        display_order: 1,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.id ? prev.slug : slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please provide a category name");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const updatedStatus = !cat.is_active;
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cat,
          is_active: updatedStatus,
        }),
      });
      fetchCategories();
    } catch (err) {
      alert("Failed to toggle category status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
            Taxonomy & Catalog Architecture
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Category & Subcategory Hierarchy
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize catalog collections with full CRUD control. Subcategories auto-populate across navigation rails and facets.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Root Category</span>
        </button>
      </div>

      {/* Category Tree Display */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
          Loading category tree...
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Root Category Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {category.name}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200/70">
                        /category/{category.slug}
                      </span>
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                          category.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle active status"
                      >
                        {category.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {category.description || "No description set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenModal(undefined, category.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-easyva-purple-50 hover:bg-easyva-purple-100 text-easyva-purple-700 border border-easyva-purple-200/80 rounded-xl text-xs font-bold transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Add Subcategory</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    disabled={deletingId === category.id}
                    className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors disabled:opacity-50"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subcategories Nested List */}
              {category.subcategories && category.subcategories.length > 0 ? (
                <div className="pl-4 sm:pl-6 border-l-2 border-easyva-purple-200 space-y-2 mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Nested Subcategories ({category.subcategories.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">
                              {sub.name}
                            </span>
                            {!sub.is_active && (
                              <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            /category/{sub.slug}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenModal(sub)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
                            title="Edit Subcategory"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(sub.id, sub.name)}
                            disabled={deletingId === sub.id}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic pl-4">
                  No subcategories added yet. Click &quot;+ Add Subcategory&quot; to expand this section.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Create/Edit Modal (Responsive: Bottom Sheet on Mobile / Centered on Desktop) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-md w-full h-[88vh] sm:h-auto sm:max-h-[86vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            {/* Pinned Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
              <h3 className="text-base font-extrabold text-slate-900">
                {formData.id ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handmade Ceramics & Pottery"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
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
                    placeholder="ceramics-and-pottery"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-easyva-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Parent Category (Leave blank for Root Category)
                  </label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none text-xs"
                  >
                    <option value="">— None (Top-Level Root Category) —</option>
                    {categories
                      .filter((c) => c.id !== formData.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Description / SEO Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description for category banner and meta tags"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Banner / Thumbnail Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none font-mono text-[11px]"
                    />
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-300 flex items-center gap-1 font-bold text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadingImage && (
                    <p className="text-[10px] text-easyva-purple-600 mt-1">Uploading image...</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Visibility
                    </label>
                    <select
                      value={formData.is_active ? "true" : "false"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.value === "true",
                        })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:bg-white focus:border-easyva-purple-500 outline-none text-xs"
                    >
                      <option value="true">Active (Public)</option>
                      <option value="false">Hidden (Draft)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pinned Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {formData.id ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
