import { MetadataRoute } from "next";
import { getCategories, getProducts, getBlogPosts } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, blogPosts] = await Promise.all([
    getCategories(),
    getProducts(),
    getBlogPosts(false),
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/category/all`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/track-order`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/returns-refunds`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Add categories & subcategories
  categories.forEach((cat) => {
    sitemapEntries.push({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    });

    cat.subcategories?.forEach((sub) => {
      sitemapEntries.push({
        url: `${SITE_URL}/category/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    });
  });

  // Add blog posts
  blogPosts.forEach((post) => {
    sitemapEntries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Add products
  products.forEach((prod) => {
    sitemapEntries.push({
      url: `${SITE_URL}/product/${prod.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    });
  });

  return sitemapEntries;
}

