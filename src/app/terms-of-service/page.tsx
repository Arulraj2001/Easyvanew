import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText } from "lucide-react";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Terms of Service & Patron Agreement | Easyva",
  description: "Terms and conditions governing the purchase of authentic handcrafted goods, intellectual property of creators, and platform usage on Easyva.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms-of-service" },
  ]);

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
              Legal Agreement & Platform Terms
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Last updated: October 2026 • Governed by Information Technology Act, 2000 & Consumer Protection Act, 2019
            </p>
          </div>

          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Introduction & Acceptance of Terms</h2>
              <p>
                Welcome to <strong>Easyva</strong> (operated by Easyva Artisan Crafts Pvt. Ltd., &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By browsing, accessing, or placing an order through our web application or mobile storefront, you acknowledge and agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using our store.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Handcrafted Goods & Natural Variations</h2>
              <p>
                Easyva provides an authentic marketplace for independent studio artisans, sculptors, silversmiths, and painters. Because all creations are crafted manually:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-600">
                <li>Slight variations in dimensions (within ±5%), glaze crystallization, brush strokes, and natural stone veining are inherent marks of craftsmanship and do not constitute defective merchandise.</li>
                <li>Product photographs strive to represent true color values under balanced studio lighting; subtle display variations may occur across mobile screens and monitors.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Pricing, Taxes & Payment Verification</h2>
              <p>
                All prices quoted on the store are in Indian Rupees (₹ INR) inclusive of GST. Orders paid via Direct UPI require the submission of an authentic 12-digit UPI Transaction Reference (UTR) number or screenshot. Easyva reserves the right to cancel orders where payment confirmation fails within 24 hours.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Intellectual Property & Artist Rights</h2>
              <p>
                All original artwork designs, painting compositions, jewelry motifs, product imagery, and brand marks displayed on Easyva are protected under the Copyright Act, 1957. Unauthorized commercial reproduction, modification, or distribution is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Limitation of Liability & Governing Law</h2>
              <p>
                Easyva shall not be liable for indirect, incidental, or consequential damages resulting from courier carrier delays or customs inspections. These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of courts situated in Bengaluru, Karnataka, India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
