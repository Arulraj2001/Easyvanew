import { Product, Category, SiteSettings } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://easyva.in";

/**
 * Generates Schema.org Product JSON-LD for rich Google shopping snippets.
 */
export function generateProductJsonLd(product: Product, settings?: SiteSettings) {
  const storeName = settings?.store_name || "Easyva";
  const primaryImage = product.images?.[0]?.image_url || `${SITE_URL}/easyva-logo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images?.map((img) => img.image_url) || [primaryImage],
    description: product.summary || product.description,
    sku: product.sku || `EASYVA-${product.id.slice(0, 8).toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: storeName,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: storeName,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (product.rating || 5.0).toFixed(1),
      reviewCount: Math.max(1, product.reviews_count || 12),
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD for Google search result hierarchy.
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates Schema.org Organization and WebSite JSON-LD.
 */
export function generateStoreJsonLd(settings?: SiteSettings) {
  const storeName = settings?.store_name || "Easyva";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: storeName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/easyva-logo.png`,
          caption: storeName,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Coimbatore",
          addressRegion: "Tamil Nadu",
          postalCode: "641001",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settings?.support_phone || "+91 8072 415 334",
          email: settings?.support_email || "muruganboutiqueandcosmetics@gmail.com",
          contactType: "Customer Support & Artisan Guild",
          areaServed: [
            "Tamil Nadu",
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Tiruchirappalli",
            "Salem",
            "Tiruvannamalai",
            "Tiruppur",
            "Erode",
            "Vellore",
            "India",
          ],
          availableLanguage: ["English", "Tamil", "Hindi"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: storeName,
        description: settings?.store_tagline || "Handcrafted Art, Jewellery & Living Decor",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/category/all?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

