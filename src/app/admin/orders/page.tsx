"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  Truck, 
  Phone, 
  MapPin, 
  Zap, 
  Search,
  ExternalLink,
  Printer,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2
} from "lucide-react";
import { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING_VERIFICATION" | "VERIFIED" | "SHIPPED">("ALL");
  const [search, setSearch] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    updates: {
      payment_status?: Order["payment_status"];
      fulfillment_status?: Order["fulfillment_status"];
      tracking_number?: string;
    }
  ) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...updates }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleSaveTracking = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking || !tracking.trim()) {
      alert("Please enter a tracking number");
      return;
    }
    handleUpdateStatus(orderId, {
      fulfillment_status: "SHIPPED",
      tracking_number: tracking.trim(),
    });
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderNumber}?`)) return;
    setDeletingId(orderId);
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: "DELETE" });
      if (res.ok) fetchOrders();
    } catch (err) {
      alert("Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Total Amount",
      "Payment Method",
      "UTR Number",
      "Payment Status",
      "Fulfillment Status",
      "Tracking Number",
      "Shipping Address",
      "City",
      "State",
      "Pincode",
    ];

    const rows = orders.map((o) => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleDateString()}"`,
      `"${o.customer_name}"`,
      `"${o.customer_phone}"`,
      `"${o.customer_email || ""}"`,
      o.total_amount,
      `"${o.payment_method}"`,
      `"${o.utr_number || ""}"`,
      `"${o.payment_status}"`,
      `"${o.fulfillment_status}"`,
      `"${o.tracking_number || ""}"`,
      `"${o.shipping_address.replace(/"/g, '""')}"`,
      `"${o.shipping_city}"`,
      `"${o.shipping_state}"`,
      `"${o.shipping_pincode}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `easyva_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search) ||
      (o.utr_number && o.utr_number.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === "PENDING_VERIFICATION") {
      return o.payment_status === "PENDING" && o.payment_method === "DIRECT_UPI";
    }
    if (filter === "VERIFIED") return o.payment_status === "VERIFIED";
    if (filter === "SHIPPED") return o.fulfillment_status === "SHIPPED";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
            Order Lifecycle & Reconciliation
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Orders & UPI Verifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review buyer UTR numbers, verify direct bank deposits, assign courier tracking, and print tax invoices.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors self-start border border-slate-200/90"
        >
          <Download className="w-4 h-4 text-easyva-purple-600" />
          <span>Export Orders (CSV)</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              filter === "ALL"
                ? "bg-easyva-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter("PENDING_VERIFICATION")}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filter === "PENDING_VERIFICATION"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Pending UPI Check (
              {orders.filter((o) => o.payment_status === "PENDING" && o.payment_method === "DIRECT_UPI").length}
              )
            </span>
          </button>
          <button
            onClick={() => setFilter("VERIFIED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              filter === "VERIFIED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70"
            }`}
          >
            Verified ({orders.filter((o) => o.payment_status === "VERIFIED").length})
          </button>
          <button
            onClick={() => setFilter("SHIPPED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              filter === "SHIPPED"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Dispatched ({orders.filter((o) => o.fulfillment_status === "SHIPPED").length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by order #, phone, UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-900 pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:bg-white outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Orders List (Light Theme) */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-easyva-purple-600" />
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 text-slate-400 text-xs">
          No orders match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 hover:border-slate-300 transition-all shadow-xs"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-base font-black text-slate-900">
                    {order.order_number}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.payment_status === "VERIFIED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    Payment: {order.payment_status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Fulfillment: {order.fulfillment_status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-slate-900">
                    ₹{order.total_amount.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => setInvoiceOrder(order)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200/90 flex items-center gap-1.5 text-xs font-bold transition-colors"
                    title="Print Tax Invoice / Packing Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-easyva-purple-600" />
                    <span>Packing Slip</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id, order.order_number)}
                    disabled={deletingId === order.id}
                    className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors"
                    title="Delete / Cancel Order"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                {/* 1. Customer & Shipping Details */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Customer & Delivery Address
                  </span>
                  <div className="font-bold text-slate-900">{order.customer_name}</div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customer_phone}</span>
                  </div>
                  {order.customer_email && (
                    <div className="text-slate-500">{order.customer_email}</div>
                  )}
                  <div className="flex items-start gap-2 text-slate-600 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                    </span>
                  </div>
                </div>

                {/* 2. Direct UPI Verification Status */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Direct UPI Payment Verification
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Submitted UTR:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {order.utr_number || "Awaiting entry"}
                    </span>
                  </div>

                  {order.utr_proof_image && (
                    <button
                      onClick={() => setScreenshotModalUrl(order.utr_proof_image || null)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white hover:bg-slate-100 text-easyva-purple-700 rounded-lg border border-slate-200 text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Payment Screenshot</span>
                    </button>
                  )}

                  <div className="pt-2 flex gap-2">
                    {order.payment_status === "PENDING" ? (
                      <button
                        onClick={() => handleUpdateStatus(order.id, { payment_status: "VERIFIED" })}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Payment</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(order.id, { payment_status: "PENDING" })}
                        className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Mark Unverified
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Dispatch & Courier Tracking */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Fulfillment & Courier Tracking
                  </span>

                  {order.tracking_number ? (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                      <div className="text-[11px] text-slate-400">Tracking Number:</div>
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {order.tracking_number}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter Courier AWB / Tracking #"
                        value={trackingInputs[order.id] || ""}
                        onChange={(e) =>
                          setTrackingInputs({
                            ...trackingInputs,
                            [order.id]: e.target.value,
                          })
                        }
                        className="w-full bg-white p-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs outline-none"
                      />
                      <button
                        onClick={() => handleSaveTracking(order.id)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch & Assign Tracking</span>
                      </button>
                    </div>
                  )}

                  {order.fulfillment_status === "SHIPPED" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, { fulfillment_status: "DELIVERED" })}
                      className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-xs border border-purple-200 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Items Ordered ({order.items.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
                    >
                      {item.product_image && (
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          <Image
                            src={item.product_image}
                            alt={item.product_title}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">
                          {item.product_title}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.quantity} × ₹{item.unit_price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshot Modal (Responsive & Compact) */}
      {screenshotModalUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white max-w-md w-full max-h-[86vh] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xl flex flex-col overflow-hidden space-y-3 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">
                Customer Payment Screenshot Proof
              </h3>
              <button
                type="button"
                onClick={() => setScreenshotModalUrl(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[340px] rounded-xl overflow-hidden bg-slate-100 border">
              <Image
                src={screenshotModalUrl}
                alt="Payment Proof"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-right pt-1">
              <button
                type="button"
                onClick={() => setScreenshotModalUrl(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice Modal (Responsive, Compact, Printable) */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:fixed">
          <div className="bg-white max-w-2xl w-full max-h-[88vh] rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 my-auto animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-h-none print:overflow-visible">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0 print:hidden">
              <span className="text-xs font-bold text-slate-700">
                Invoice Preview • #{invoiceOrder.order_number}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-easyva-purple-600 hover:bg-easyva-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Scrollable Printable Paper Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 print:p-0 print:overflow-visible">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    EASYVA
                  </h2>
                  <p className="text-xs text-slate-500">
                    Handcrafted Art, Jewellery & Living Decor
                  </p>
                  <p className="text-[11px] text-slate-400">
                    orders@easyva.in | www.easyva.in
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-easyva-purple-700 bg-easyva-purple-50 px-2 py-0.5 rounded">
                    Official Packing Slip
                  </span>
                  <div className="font-mono font-bold text-base mt-1">
                    {invoiceOrder.order_number}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(invoiceOrder.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Billed To
                  </span>
                  <div className="font-bold text-slate-900">{invoiceOrder.customer_name}</div>
                  <div>{invoiceOrder.customer_phone}</div>
                  <div>{invoiceOrder.customer_email || "—"}</div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Shipping Destination
                  </span>
                  <div className="text-slate-800">
                    {invoiceOrder.shipping_address}
                  </div>
                  <div>
                    {invoiceOrder.shipping_city}, {invoiceOrder.shipping_state} - {invoiceOrder.shipping_pincode}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b font-bold text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-800">
                    {invoiceOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold">{item.product_title}</td>
                        <td className="py-2 px-3 text-center">{item.quantity}</td>
                        <td className="py-2 px-3 text-right font-mono">₹{item.unit_price}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{item.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs pt-2">
                <span className="text-slate-400 text-[11px]">
                  Official computer-generated invoice. 100% authentic artisan sourced.
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Grand Total:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{invoiceOrder.total_amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
