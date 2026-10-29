import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts, getProducts } from "@/lib/db";
import { BlogPost, Product } from "@/lib/types";
import {
  Clock,
  Calendar,
  Share2,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Check,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(true);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Story Not Found | Easyva Artisan Crafts",
    };
  }

  const title = post.seo?.meta_title || post.title;
  const description = post.seo?.meta_description || post.excerpt;

  return {
    title: `${title} | Easyva Artisan Stories`,
    description,
    keywords: post.seo?.keywords || post.tags,
    alternates: {
      canonical: `https://easyva.in/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://easyva.in/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author?.name || post.author_name || "Murugan Boutique"],
      tags: post.tags,
      images: [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.cover_image],
    },
  };
}

/**
 * Custom zero-dependency Markdown Parser for high performance & clean semantic HTML.
 */
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 space-y-2 pl-5 list-disc text-slate-700 leading-relaxed text-sm sm:text-base">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-easyva-purple-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-easyva-purple-600 underline hover:text-easyva-purple-800 font-semibold">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      flushList();
      const text = line.replace("# ", "");
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-8 mb-4 leading-tight">
          {text}
        </h1>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      flushList();
      const text = line.replace("## ", "");
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      elements.push(
        <h2 id={id} key={`h2-${i}`} className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-10 mb-3 pt-4 border-t border-slate-100 scroll-mt-24">
          {text}
        </h2>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      flushList();
      const text = line.replace("### ", "");
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2">
          {text}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushList();
      const text = line.replace("> ", "");
      elements.push(
        <blockquote key={`quote-${i}`} className="my-6 p-4 border-l-4 border-easyva-purple-600 bg-purple-50/50 rounded-r-2xl text-slate-700 italic text-sm sm:text-base leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </blockquote>
      );
      continue;
    }

    // Bullet List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listItems.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Regular Paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="my-4 text-slate-700 text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
    );
  }

  flushList();
  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch mentioned products if any
  const allProducts = await getProducts();
  const featuredProducts: Product[] = [];
  if (post.featured_products && post.featured_products.length > 0) {
    post.featured_products.forEach((pSlug: string) => {
      const match = allProducts.find((p) => p.slug === pSlug);
      if (match) featuredProducts.push(match);
    });
  }

  // Schema.org BlogPosting JSON-LD
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [post.cover_image],
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      "@type": "Person",
      name: post.author?.name || post.author_name || "Murugan Boutique",
      jobTitle: post.author?.role || post.author_role || "Heritage Craft Curator",
    },
    publisher: {
      "@type": "Organization",
      name: "Murugan Boutique & Easyva Artisan Crafts",
      url: "https://easyva.in",
      logo: {
        "@type": "ImageObject",
        url: "https://easyva.in/icons/icon-512x512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://easyva.in/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };

  return (
    <article className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 pb-28 md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-easyva-purple-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-easyva-purple-600 transition-colors">
            Artisan Stories
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-none">
            {post.category}
          </span>
        </div>

        {/* Article Header Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-easyva-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time || `${post.read_time_minutes || 5} min read`}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.author?.avatar || post.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                alt={post.author?.name || post.author_name || "Murugan Boutique"}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {post.author?.name || post.author_name || "Murugan Boutique"}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {post.author?.role || post.author_role || "Heritage Craft Curator"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span className="hidden sm:inline">Craft Guild:</span>
              <span className="text-easyva-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-easyva-purple-100 font-bold">
                Tamil Nadu Artisan Heritage
              </span>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Body */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="prose prose-slate max-w-none text-slate-800">
            {renderMarkdown(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Related Tags:</span>
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-xl transition-colors font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Products Mentioned in Story */}
        {featuredProducts.length > 0 && (
          <div className="bg-purple-50/70 border border-purple-200/70 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-easyva-purple-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Handcrafted Creations Mentioned in this Story
                </h3>
                <p className="text-xs text-slate-500">
                  Certified authentic studio craft made by the master artisans profiled above.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={prod.images?.[0]?.image_url || "/images/banners/banner1.webp"}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {prod.title}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                    <div className="font-black text-slate-900 text-xs">
                      ₹{prod.price.toLocaleString("en-IN")}
                    </div>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="px-2.5 py-1.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
          <img
            src={post.author?.avatar || post.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
            alt={post.author?.name || post.author_name || "Murugan Boutique"}
            className="w-20 h-20 rounded-full object-cover border-2 border-easyva-purple-200 flex-shrink-0"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base font-extrabold text-slate-900">
                {post.author?.name || post.author_name || "Murugan Boutique"}
              </h4>
              <span className="text-[10px] font-bold text-easyva-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-easyva-purple-200">
                Author
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {post.author?.role || post.author_role || "Heritage Craft Curator"} • Murugan Boutique & Artisan Guild
            </p>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl pt-1">
              Curating authentic Southern Indian heritage arts, direct-from-artisan Thanjavur gilding, and living decor to elevate contemporary homes across India and worldwide.
            </p>
          </div>
        </div>

        {/* Back to Blog Button */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-easyva-purple-600 transition-colors px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Artisan Stories</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
