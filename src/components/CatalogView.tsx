"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Filter, 
  ArrowUpDown, 
  Star, 
  Check, 
  Sparkles, 
  RotateCcw,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";

interface CatalogViewProps {
  products: Product[];
  category: Category | null;
  allCategories: Category[];
  searchQuery?: string;
  isAll?: boolean;
}

export default function CatalogView({
  products,
  category,
  allCategories,
  searchQuery,
  isAll,
}: CatalogViewProps) {
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price Filter
    if (priceFilter === "under-999") {
      result = result.filter((p) => p.price < 999);
    } else if (priceFilter === "1000-2499") {
      result = result.filter((p) => p.price >= 999 && p.price <= 2499);
    } else if (priceFilter === "above-2500") {
      result = result.filter((p) => p.price > 2499);
    }

    // Rating Filter
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 5) >= minRating);
    }

    // Sort By
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return result;
  }, [products, priceFilter, minRating, sortBy]);

  const resetFilters = () => {
    setPriceFilter("all");
    setMinRating(0);
    setSortBy("featured");
  };

  const hasActiveFilters = priceFilter !== "all" || minRating > 0 || sortBy !== "featured";

  return (
    <div className="space-y-4">
      {/* Top Filter & Sort Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-800">
            {filteredProducts.length} Creations Found
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-easyva-purple-600 hover:text-easyva-purple-700 font-semibold flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-easyva-purple-500"
          >
            <option value="featured">Featured & Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-easyva-purple-50 text-easyva-purple-700 text-xs font-bold rounded-xl border border-easyva-purple-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Flipkart-style Left Filter Sidebar (Desktop) */}
        <aside className="hidden md:block md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-easyva-purple-600 font-bold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">Price Range</span>
            <div className="space-y-1.5 text-xs">
              {[
                { id: "all", label: "All Prices" },
                { id: "under-999", label: "Under ₹999" },
                { id: "1000-2499", label: "₹1,000 - ₹2,499" },
                { id: "above-2500", label: "₹2,500 and Above" },
              ].map((tier) => (
                <label
                  key={tier.id}
                  className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="priceTier"
                    checked={priceFilter === tier.id}
                    onChange={() => setPriceFilter(tier.id)}
                    className="text-easyva-purple-600 focus:ring-easyva-purple-500"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 block">Customer Rating</span>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={minRating === 4}
                  onChange={(e) => setMinRating(e.target.checked ? 4 : 0)}
                  className="rounded text-easyva-purple-600 focus:ring-easyva-purple-500"
                />
                <div className="flex items-center gap-1 font-semibold text-easyva-amber-600">
                  <span>4★ & above</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
              </label>
            </div>
          </div>

          {/* Category Tree Navigation */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-800 block">Browse Categories</span>
            <div className="space-y-1 text-xs">
              {allCategories.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`block font-semibold py-1 transition-colors ${
                      category?.id === cat.id
                        ? "text-easyva-purple-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories && category?.id === cat.id && (
                    <div className="pl-3 border-l border-easyva-purple-200 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.slug}`}
                          className="block text-[11px] text-slate-500 hover:text-easyva-purple-600 py-0.5"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid (Flipkart-style Cards) */}
        <div className="md:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching creations found
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range or clearing active filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-easyva-purple-600 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm flex items-end justify-center md:hidden">
          <div className="bg-white w-full rounded-t-3xl p-5 pb-8 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Filter Products</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Price Range</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-999", label: "Under ₹999" },
                  { id: "1000-2499", label: "₹1,000 - ₹2,499" },
                  { id: "above-2500", label: "₹2,500+" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setPriceFilter(tier.id)}
                    className={`p-2.5 rounded-xl border text-left font-medium ${
                      priceFilter === tier.id
                        ? "bg-easyva-purple-50 border-easyva-purple-600 text-easyva-purple-700 font-bold"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">Rating</span>
              <button
                onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                className={`p-2.5 rounded-xl border w-full text-left font-semibold text-xs flex items-center justify-between ${
                  minRating === 4
                    ? "bg-easyva-purple-50 border-easyva-purple-600 text-easyva-purple-700"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <span>4★ & above</span>
                <Star className="w-4 h-4 fill-current text-easyva-amber-500" />
              </button>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-easyva-purple-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

