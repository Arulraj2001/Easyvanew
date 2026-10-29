import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, EyeOff } from "lucide-react";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Privacy & Data Protection Policy | Easyva",
  description: "Read Easyva's commitment to customer data privacy, zero financial credentials storage, and compliance with the Digital Personal Data Protection Act, 2023.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
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
              Data Privacy & Consumer Trust
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Privacy & Data Protection Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Last updated: October 2026 • Compliant with Digital Personal Data Protection (DPDP) Act, 2023
            </p>
          </div>

          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Personal Information Collected</h2>
              <p>
                When you browse our store, add items to your cart, or finalize an order, Easyva collects only necessary information:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-600">
                <li><strong>Contact Identifiers:</strong> Name, shipping address, city, state, pincode, contact phone number, and email.</li>
                <li><strong>Order & Fulfillment History:</strong> Items ordered, preferred courier method, and customer-submitted 12-digit UPI UTR reference codes.</li>
                <li><strong>Technical Telemetry:</strong> Anonymized browser type and IP for security rate-limiting and performance analytics.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Zero Banking Credentials Storage</h2>
              <p>
                Easyva operates via direct bank-to-bank UPI transfers. <strong>We never capture, view, or store</strong> your bank account passwords, UPI MPINs, or card CVVs. All monetary transactions occur entirely within your verified payment provider application (Google Pay, PhonePe, Paytm, or BHIM).
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Purpose of Processing & Logistics Sharing</h2>
              <p>
                We do not sell, license, or monetize your personal data. Information is shared strictly with:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-600">
                <li>Designated logistics partners (Bluedart, Delhivery, DTDC, India Post) solely to facilitate parcel delivery.</li>
                <li>Transactional SMS and email gateways for dispatch tracking alerts.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Your Data Rights & Contact</h2>
              <p>
                Under the DPDP Act 2023, you retain the right to review, update, or request deletion of your order contact history from our customer databases by contacting our privacy compliance desk at <code className="text-easyva-purple-700 font-bold font-mono">privacy@easyva.in</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
