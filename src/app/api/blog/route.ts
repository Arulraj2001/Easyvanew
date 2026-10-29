import { NextResponse } from "next/server";
import { getBlogPosts, getBlogPostBySlug, saveBlogPost, deleteBlogPost } from "@/lib/db";
import { BlogPost } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includeUnpublished = searchParams.get("all") === "true";

    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const posts = await getBlogPosts(includeUnpublished);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and Slug are required" },
        { status: 400 }
      );
    }

    const postToSave: BlogPost = {
      id: body.id || `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: body.title.trim(),
      slug: body.slug.trim().toLowerCase(),
      excerpt: body.excerpt?.trim() || "",
      content: body.content || "",
      cover_image: body.cover_image || "/images/banners/banner1.webp",
      category: body.category || "Artisan Traditions",
      author_name: body.author?.name || body.author_name || "Murugan Boutique & Artisan Collective",
      author_role: body.author?.role || body.author_role || "Heritage Craft Curator",
      author_avatar: body.author?.avatar || body.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      author_bio: body.author_bio || body.author?.bio || "",
      read_time_minutes: Number(body.read_time_minutes) || Math.max(2, Math.ceil((body.content || "").split(/\s+/).length / 200)),
      reading_time: body.reading_time || `${Math.max(2, Math.ceil((body.content || "").split(/\s+/).length / 200))} min read`,
      author: {
        name: body.author?.name || body.author_name || "Murugan Boutique & Artisan Collective",
        role: body.author?.role || body.author_role || "Heritage Craft Curator",
        avatar: body.author?.avatar || body.author_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      },
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((t: string) => t.trim()) : ["Tamil Nadu Crafts"]),
      featured_products: Array.isArray(body.featured_products) ? body.featured_products : [],
      featured_product_ids: Array.isArray(body.featured_products) ? body.featured_products : [],
      published_at: body.published_at || new Date().toISOString().split("T")[0],
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
      primary_keyword: body.primary_keyword || body.seo?.primary_keyword || "",
      secondary_keywords: Array.isArray(body.secondary_keywords)
        ? body.secondary_keywords
        : Array.isArray(body.seo?.secondary_keywords)
        ? body.seo.secondary_keywords
        : typeof body.secondary_keywords === "string"
        ? body.secondary_keywords.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      meta_title: body.meta_title || body.seo?.meta_title || body.title,
      meta_description: body.meta_description || body.seo?.meta_description || body.excerpt || "",
      canonical_url: body.canonical_url || body.seo?.canonical_url || "",
      faq_items: Array.isArray(body.faq_items) ? body.faq_items : [],
      meta_keywords: Array.isArray(body.seo?.keywords)
        ? body.seo.keywords
        : Array.isArray(body.meta_keywords)
        ? body.meta_keywords
        : ["Tamil Nadu handicrafts", "artisans", "authentic home decor"],
      seo: {
        primary_keyword: body.primary_keyword || body.seo?.primary_keyword || "",
        secondary_keywords: Array.isArray(body.secondary_keywords)
          ? body.secondary_keywords
          : Array.isArray(body.seo?.secondary_keywords)
          ? body.seo.secondary_keywords
          : [],
        meta_title: body.meta_title || body.seo?.meta_title || body.title,
        meta_description: body.meta_description || body.seo?.meta_description || body.excerpt || "",
        canonical_url: body.canonical_url || body.seo?.canonical_url || "",
        keywords: Array.isArray(body.seo?.keywords)
          ? body.seo.keywords
          : Array.isArray(body.tags)
          ? body.tags
          : ["Tamil Nadu handicrafts", "artisans", "authentic home decor"],
      },
    };

    const saved = await saveBlogPost(postToSave);
    return NextResponse.json({ post: saved });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json({ error: "Failed to save blog post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const success = await deleteBlogPost(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
