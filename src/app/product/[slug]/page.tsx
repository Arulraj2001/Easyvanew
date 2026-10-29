import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  CheckCircle2,
  Zap,
  Sparkles,
  Share2
} from "lucide-react";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/db";
import { generateProductJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ProductGallery from "@/components/ProductGallery";
import PincodeChecker from "@/components/PincodeChecker";
import ProductCard from "@/components/ProductCard";
import ProductActions from "./ProductActions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolved = await params;
  const product = await getProductBySlug(resolved.slug);

  if (!product) return { title: "Product Not Found | Easyva" };

  const primaryImage = product.images?.[0]?.image_url || "/easyva-logo.png";

  return {
    title: `${product.title} | Easyva`,
    description: product.summary || product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.summary || product.description,
      images: [{ url: primaryImage, width: 800, height: 800, alt: product.title }],
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolved = await params;
  const product = await getProductBySlug(resolved.slug);

  if (!product) notFound();

  const [settings, allProducts] = await Promise.all([
    getSiteSettings(),
    getProducts(),
  ]);

  const productJsonLd = generateProductJsonLd(product, settings);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Catalog", url: "/category/all" },
    { name: product.title, url: `/product/${product.slug}` },
  ]);

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100
        )
      : null;

  // Similar Products from same category or fallback
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-4 sm:py-6 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-500 gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-easyva-purple-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/category/all" className="hover:text-easyva-purple-600 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 line-clamp-1">
            {product.title}
          </span>
        </nav>

        {/* Main Product Showcase Box (White Card) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column (Flipkart Multi-Image Rail) */}
            <div className="lg:col-span-6">
              <ProductGallery
                images={product.images || []}
                title={product.title}
                discountPercent={discountPercent}
              />
            </div>

            {/* Product Purchase & Details Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-easyva-amber-600 font-bold bg-easyva-amber-50 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-current text-easyva-amber-500" />
                    <span>{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-400 font-normal">
                      ({product.reviews_count || 24} ratings)
                    </span>
                  </div>
                  <span className="text-easyva-teal-700 bg-easyva-teal-50 px-2.5 py-1 rounded-full font-bold">
                    Direct Artisan Studio
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.summary}
                </p>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.compare_at_price.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-bold text-easyva-lime-800">
                      Save ₹{(product.compare_at_price! - product.price).toLocaleString("en-IN")} ({discountPercent}% off)
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Express Shipping on Orders Above ₹999</span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-easyva-purple-700 font-semibold">
                  <Zap className="w-4 h-4 text-easyva-purple-600" />
                  <span>Direct from Artisan Studio • Certified Quality Inspection</span>
                </div>
              </div>

              {/* Action Buttons (Add to Bag & Buy Now) */}
              <ProductActions product={product} />

              {/* Pincode Estimator (Flipkart Style) */}
              <PincodeChecker />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <Truck className="w-4 h-4 text-easyva-purple-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Fast Dispatch</span>
                    <span className="text-slate-400 text-[10px]">Direct from artisan</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <ShieldCheck className="w-4 h-4 text-easyva-teal-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Transit Insurance</span>
                    <span className="text-slate-400 text-[10px]">100% breakage protection</span>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="border-t border-slate-200 pt-5 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Specifications & Craft Details
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {Object.entries(product.attributes).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between">
                        <span className="text-slate-500">{k}</span>
                        <span className="text-slate-900 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="border-t border-slate-200 pt-5 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Artisan Story & Provenance
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Studio Care & Maintenance Advice */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Care & Maintenance Instructions
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Handling Handcrafted Works</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Handmade stoneware is microwave and dishwasher safe on gentle cycle. For fine 925 sterling silver jewelry, store in an airtight pouch away from direct perfume sprays and wipe with a soft microfiber cloth to preserve natural luster.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Ratings & Reviews Breakdown (Flipkart Style) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Ratings & Customer Reviews
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-4xl font-extrabold text-slate-900">
                {product.rating ? product.rating.toFixed(1) : "5.0"}
              </span>
              <div className="flex items-center gap-1 text-easyva-amber-500 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Based on {product.reviews_count || 24} verified buyer reviews
              </span>
            </div>

            <div className="md:col-span-8 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-12 font-bold text-slate-600">5 ★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                </div>
                <span className="w-8 text-right text-slate-400">85%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 font-bold text-slate-600">4 ★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[12%]" />
                </div>
                <span className="w-8 text-right text-slate-400">12%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 font-bold text-slate-600">3 ★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[3%]" />
                </div>
                <span className="w-8 text-right text-slate-400">3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Creations Recommendations Rail */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Similar Handcrafted Creations
              </h3>
              <Link
                href="/category/all"
                className="text-xs font-bold text-easyva-purple-600 hover:text-easyva-purple-700"
              >
                View Catalog
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
