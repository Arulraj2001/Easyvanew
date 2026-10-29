import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import StoreLayoutWrapper from "@/components/StoreLayoutWrapper";
import { getCategories, getSiteSettings } from "@/lib/db";
import { generateStoreJsonLd, SITE_URL } from "@/lib/seo";

/**
 * Sanitizes and extracts the exact Google Search Console verification token,
 * whether the admin pastes:
 * 1. The full tag: <meta name="google-site-verification" content="XYZ" />
 * 2. Key-value: google-site-verification=XYZ
 * 3. Raw token: XYZ
 */
function extractGscToken(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const contentMatch = trimmed.match(/content=["']([^"']+)["']/i);
  if (contentMatch && contentMatch[1]) {
    return contentMatch[1].trim();
  }
  if (trimmed.toLowerCase().startsWith("google-site-verification=")) {
    return trimmed.split("=")[1]?.trim() || null;
  }
  return trimmed.replace(/[<>"']/g, "").trim() || null;
}

/**
 * Sanitizes and extracts the GA4 Measurement ID (G-XXXXXXXXXX)
 */
function extractGaId(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const match = trimmed.match(/G-[A-Z0-9]+/i);
  if (match) return match[0].toUpperCase();
  return trimmed.replace(/[<>"']/g, "").trim() || null;
}

export const viewport: Viewport = {
  themeColor: "#4c1d95",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.store_name} | ${settings.store_tagline}`;
  const description =
    "Discover authentic handcrafted paintings, pure 925 sterling silver jewellery, studio ceramic pottery, and bespoke home decor on Easyva. Directly sourced from indie artisan studios with insured express delivery.";

  return {
    title: {
      default: title,
      template: `%s | ${settings.store_name}`,
    },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: settings.store_name,
      images: [
        {
          url: "/easyva-logo.png",
          width: 800,
          height: 800,
          alt: settings.store_name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/easyva-logo.png"],
    },
    icons: {
      icon: "/easyva-logo.png",
      apple: "/easyva-logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();
  const settings = await getSiteSettings();
  const storeJsonLd = generateStoreJsonLd(settings);

  const gscToken = extractGscToken(settings.google_search_console_tag);
  const gaId = extractGaId(settings.google_analytics_id);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Search Console Verification Meta Tag */}
        {gscToken && (
          <meta
            name="google-site-verification"
            content={gscToken}
          />
        )}

        {/* Structured Data (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />

        {/* Google Analytics 4 Script (Loads asynchronously via Next.js Script) */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[#F1F2F4] text-slate-900 antialiased selection:bg-easyva-purple-500 selection:text-white">
        <StoreLayoutWrapper categories={categories} settings={settings}>
          {children}
        </StoreLayoutWrapper>
      </body>
    </html>
  );
}

