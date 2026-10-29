import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/db";
import { BlogPost } from "@/lib/types";
import { BookOpen, Sparkles, Clock, Calendar, ArrowRight, User, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Artisan Stories & Heritage Decor Guides | Easyva Crafts Tamil Nadu",
  description:
    "Explore authentic Tamil Nadu handicraft guides, Thanjavur painting heritage, Swamimalai bronze casting, Chettinad terracotta styling, and artisan gifting ideas.",
  keywords: [
    "Tamil Nadu handicrafts",
    "Thanjavur paintings Chennai",
    "Swamimalai bronze",
    "Chettinad pottery",
    "handcrafted home decor Tamil Nadu",
    "artisan stories",
  ],
  alternates: {
    canonical: "https://easyva.in/blog",
  },
  openGraph: {
    title: "Artisan Stories & Heritage Decor Guides | Easyva",
    description:
      "Explore authentic Tamil Nadu handicraft guides, Thanjavur painting heritage, Swamimalai bronze casting, and artisan gifting ideas.",
    url: "https://easyva.in/blog",
    type: "website",
    locale: "en_IN",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getBlogPosts(false);
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-8 sm:py-12 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Hero */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-easyva-purple-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Artisan Stories & Blog</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 text-easyva-purple-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-easyva-purple-600" />
            <span>Living Heritage & Design Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Artisan Stories, Craft Heritage & Home Styling
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Step into the workshops of Tamil Nadu’s master artisans. Discover ancient traditions, architectural curation tips, and guides for living with timeless Indian craft.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredPost && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[420px] overflow-hidden group">
                <img
                  src={featuredPost.cover_image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-easyva-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.reading_time || `${featuredPost.read_time_minutes || 5} min read`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(featuredPost.published_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-easyva-purple-700 transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author?.avatar || featuredPost.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                      alt={featuredPost.author?.name || featuredPost.author_name || "Murugan Boutique"}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {featuredPost.author?.name || featuredPost.author_name || "Murugan Boutique"}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {featuredPost.author?.role || featuredPost.author_role || "Heritage Craft Curator"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-easyva-purple-600 hover:text-easyva-purple-800 transition-colors"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Recent Artisan Journals
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {posts.length} Curated Stories
            </span>
          </div>

          {gridPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
              More artisan journals are currently being curated by our regional master craftspeople.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-xs text-easyva-purple-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.reading_time || `${post.read_time_minutes || 4} min read`}</span>
                        <span>•</span>
                        <span>
                          {new Date(post.published_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-easyva-purple-700 transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">
                        By {post.author?.name || post.author_name || "Murugan Boutique"}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-easyva-purple-600 hover:text-easyva-purple-800 flex items-center gap-1"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Regional Heritage Assurance Callout */}
        <div className="bg-purple-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-easyva-lime-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight">
                Direct Artisan Guild of Tamil Nadu & Southern India
              </h3>
              <p className="text-xs text-purple-200 max-w-xl">
                Every purchase on Easyva directly sustains regional artisan clusters in Thanjavur, Swamimalai, Chettinad, and Madurai with fair livelihood pricing.
              </p>
            </div>
          </div>

          <Link
            href="/category/all"
            className="px-6 py-3 bg-easyva-lime-400 hover:bg-easyva-lime-300 text-slate-900 text-xs font-extrabold rounded-xl shadow-xs transition-all whitespace-nowrap"
          >
            Explore Masterpiece Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
