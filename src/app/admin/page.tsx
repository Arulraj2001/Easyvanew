import React from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Layers, 
  Clock, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { getOrders, getProducts, getCategories } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [orders, products, categories] = await Promise.all([
    getOrders(),
    getProducts(),
    getCategories(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.payment_status === "VERIFIED")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingVerificationOrders = orders.filter(
    (o) => o.payment_status === "PENDING" && o.payment_method === "DIRECT_UPI"
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Live Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Store Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full zero-code administrative management for Easyva e-commerce operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/admin/products"
            className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>+ Add Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200/80 flex items-center"
          >
            <span>+ Category</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid (Responsive 2x2 on Mobile / 4x1 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Verified Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Direct Studio Retained</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Pending UPI Verifications</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingVerificationOrders.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Awaiting 1-click admin check
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {products.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Published in artisan catalog
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Categories & Sub</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {categories.length +
              categories.reduce(
                (sum, c) => sum + (c.subcategories?.length || 0),
                0
              )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Dynamic catalog tree
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Orders & Direct UPI Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review customer UTR reference numbers and manage dispatch workflows.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-easyva-purple-600 hover:text-easyva-purple-800 font-bold flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No orders placed yet. As customers checkout, orders with their UTR numbers will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">UTR Reference</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.customer_name}</div>
                      <div className="text-slate-400 text-[11px]">{order.customer_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {order.utr_number || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.payment_status === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs text-easyva-purple-600 hover:text-easyva-purple-800 font-bold hover:underline"
                      >
                        Review Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Supabase & Cloudflare Sync Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-easyva-purple-600" />
            <span>Ready for 1-Click Supabase Sync</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Currently running locally with file-backed persistence (<code className="text-easyva-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px] font-mono">data/store.json</code>). When you create your Supabase account, simply run <code className="text-easyva-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px] font-mono">supabase/schema.sql</code> and fill your credentials in <code className="text-easyva-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px] font-mono">.env.local</code>.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-xs"
        >
          View System Settings
        </Link>
      </div>
    </div>
  );
}
