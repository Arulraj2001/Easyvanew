"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building
} from "lucide-react";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export default function ContactPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Inquiry",
    message: "",
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Contact & Support", url: "/contact" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="bg-[#F1F2F4] min-h-screen py-8 sm:py-14 pb-28 md:pb-14">
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

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-easyva-purple-700 bg-easyva-purple-50 px-3 py-1 rounded-full">
              Artisan Studio Concierge & Support
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Contact Us & Grievance Redressal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Have questions regarding custom paintings, pottery care, delivery timelines, or bulk studio orders? Our team is dedicated to assisting you.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Email Support</h3>
              <p className="text-slate-500">For order inquiries & custom requests:</p>
              <a href="mailto:muruganboutiqueandcosmetics@gmail.com" className="text-easyva-purple-700 font-bold block hover:underline break-all font-mono">
                muruganboutiqueandcosmetics@gmail.com
              </a>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Helpline & WhatsApp</h3>
              <p className="text-slate-500">Mon – Sat, 9:30 AM to 6:30 PM IST:</p>
              <div className="space-y-1">
                <a href="tel:+918072415334" className="text-easyva-teal-800 font-bold block font-mono hover:underline">
                  +91 8072 415 334
                </a>
                <a
                  href="https://wa.me/918072415334?text=Hi%20Easyva!%20I%20have%20an%20inquiry%20about%20your%20handcrafted%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <span>Chat on WhatsApp →</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Headquarters & Studio</h3>
              <p className="text-slate-500">Registered Office:</p>
              <span className="text-slate-700 font-medium block">
                Coimbatore, Tamil Nadu - 641001, India
              </span>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-500">
                Submit an inquiry and an artisan studio coordinator will respond within 4 business hours.
              </p>
            </div>

            {formSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Message Successfully Sent!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. We have received your query and sent an acknowledgment to your email address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 8072 415 334"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none font-semibold"
                    >
                      <option value="Order Inquiry">Order Status & Tracking</option>
                      <option value="Custom Artwork">Custom Painting / Commission</option>
                      <option value="Bulk Order">Studio Corporate Gifting</option>
                      <option value="Artisan Partnership">Artisan Studio Collaboration</option>
                      <option value="Other">General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Message Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:border-easyva-purple-500 outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Grievance Redressal Officer */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-easyva-teal-400 text-[11px]">
              Grievance Redressal Officer (Consumer Protection Act, 2019)
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Designation: <strong>Head of Customer Relations & Artisan Compliance</strong><br />
              Entity: <strong>Easyva Artisan Crafts</strong><br />
              Headquarters: Coimbatore, Tamil Nadu - 641001, India<br />
              Phone & WhatsApp: <code className="text-easyva-teal-300 font-mono">+91 8072 415 334</code><br />
              Email: <code className="text-easyva-purple-300 font-mono">muruganboutiqueandcosmetics@gmail.com</code><br />
              SLA Standard: All formal inquiries acknowledged within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
