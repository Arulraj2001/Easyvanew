import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import CatalogView from "@/components/CatalogView";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/db";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const currentSlug = resolvedParams.slug[resolvedParams.slug.length - 1];

  if (currentSlug === "all") {
    const title = resolvedQuery.q
      ? `Search results for "${resolvedQuery.q}" | Easyva`
      : "All Artisan Collections | Easyva";
    return { title, alternates: { canonical: `/category/all` } };
  }

  const category = await getCategoryBySlug(currentSlug);
  if (!category) return { title: "Category Not Found | Easyva" };

  return {
    title: `${category.name} | Easyva Handcrafted Collections`,
    description: category.description || `Explore authentic handcrafted ${category.name} on Easyva.`,
    alternates: { canonical: `/category/${resolvedParams.slug.join("/")}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  const currentSlug = resolvedParams.slug[resolvedParams.slug.length - 1];
  const searchQuery = resolvedQuery.q;

  const isAll = currentSlug === "all";
  const category = isAll ? null : await getCategoryBySlug(currentSlug);

  if (!isAll && !category) {
    notFound();
  }

  const [allCategories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: isAll ? undefined : currentSlug,
      searchQuery,
    }),
  ]);

  const breadcrumbs = [{ name: "Home", url: "/" }];
  if (isAll) {
    breadcrumbs.push({ name: searchQuery ? `Search: "${searchQuery}"` : "All Collections", url: "/category/all" });
  } else if (category) {
    breadcrumbs.push({ name: category.name, url: `/category/${category.slug}` });
  }
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="bg-[#F1F2F4] min-h-screen pb-28 md:pb-12 space-y-3 sm:space-y-4">
      {/* Schema.org Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-3 sm:space-y-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-500 gap-1.5 flex-wrap px-1">
          <Link href="/" className="hover:text-easyva-purple-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/category/all" className="hover:text-easyva-purple-600 transition-colors">
            Collections
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">{category.name}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900">&quot;{searchQuery}&quot;</span>
            </>
          )}
        </nav>

        {/* Category Header Banner (White Elevated Box) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-2.5 py-0.5 rounded-full">
              {isAll ? "Full Catalog" : "Artisan Category"}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isAll
                ? searchQuery
                  ? `Search: "${searchQuery}"`
                  : "All Artisan Collections"
                : category?.name}
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              {isAll
                ? "Browse authentic pottery, pure silver jewellery, canvas artworks and living decor."
                : category?.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-easyva-teal-700 bg-easyva-teal-50 px-3 py-1.5 rounded-xl border border-easyva-teal-200/70">
            <span>Authentic Studio Sourced • 100% Insured Delivery</span>
          </div>
        </div>

        {/* Interactive Catalog View with Filters & Sorting */}
        <CatalogView
          products={products}
          category={category}
          allCategories={allCategories}
          searchQuery={searchQuery}
          isAll={isAll}
        />

        {/* Editorial Category Buying Guide & Provenance Standards */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 text-xs text-slate-600 leading-relaxed mt-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2.5 py-0.5 rounded-full">
              Artisan Standards & Purity
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1.5">
              Curator&apos;s Guide: Buying Authentic Indian Handcrafted Creations
            </h2>
          </div>

          <p>
            Every piece featured under <strong>{category?.name || "Easyva Artisan Collections"}</strong> represents dedicated human artistry. Unlike commercial factory molding, handmade works carry organic nuances—from subtle glaze crystallization variations on high-fired stoneware to hand-cut bezel facets on sterling silver jewelry.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">Studio Quality Inspection</span>
              <p className="text-[11px] text-slate-500">
                Hand-inspected for weight balance, surface smoothness, and structural purity before dispatch.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">5-Layer Insured Packing</span>
              <p className="text-[11px] text-slate-500">
                Fragile pieces are cushioned in biodegradable shockproof wrap with guaranteed transit protection.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">Direct Creator Support</span>
              <p className="text-[11px] text-slate-500">
                Your purchase directly fosters indie Indian artists and traditional craft lineages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
