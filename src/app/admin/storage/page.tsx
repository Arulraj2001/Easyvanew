"use client";

import React, { useState, useEffect } from "react";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  FileImage,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";

interface StorageFile {
  name: string;
  url: string;
  size: number;
  sizeFormatted: string;
  created_at: string;
  isOrphan: boolean;
  category: string;
}

interface StorageStats {
  totalBytes: number;
  totalMB: string;
  quotaBytes: number;
  quotaMB: number;
  percentUsed: string;
  fileCount: number;
  orphanCount: number;
  files: StorageFile[];
}

export default function AdminStoragePage() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchStorageStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/storage");
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load storage statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${fileName}"? This cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_file", fileName }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Successfully deleted ${fileName}`);
        await fetchStorageStats();
      } else {
        alert(data.error || "Failed to delete file");
      }
    } catch (err: any) {
      alert(err.message || "Delete error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCleanOrphans = async () => {
    if (!confirm(`Are you sure you want to clean all orphaned media files? These files are not linked to any active product, category, or banner.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clean_orphans" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Cleaned ${data.deletedCount} orphaned files (Freed ${data.freedMB} MB)!`);
        await fetchStorageStats();
      } else {
        alert(data.error || "Clean orphans failed");
      }
    } catch (err: any) {
      alert(err.message || "Action error");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurgeProofs = async () => {
    if (!confirm(`Are you sure you want to purge all payment verification screenshot proofs? Make sure you have verified pending orders.`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purge_old_proofs" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Purged ${data.deletedCount} payment verification proofs.`);
        await fetchStorageStats();
      } else {
        alert(data.error || "Purge failed");
      }
    } catch (err: any) {
      alert(err.message || "Action error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFiles = stats?.files?.filter((f) => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterCategory !== "all" && f.category !== filterCategory) {
      return false;
    }
    if (filterStatus === "orphan" && !f.isOrphan) return false;
    if (filterStatus === "in_use" && f.isOrphan) return false;
    return true;
  }) || [];

  const percentNum = Number(stats?.percentUsed || 0);
  const statusColor =
    percentNum > 85 ? "bg-red-500" : percentNum > 60 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-easyva-purple-600" />
            Storage Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor Supabase 1 GB free-tier storage, clean unreferenced orphan assets, and purge old UTR proofs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStorageStats}
            disabled={loading || actionLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleCleanOrphans}
            disabled={actionLoading || (stats?.orphanCount || 0) === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-easyva-purple-600 hover:bg-easyva-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Clean Orphaned Media ({stats?.orphanCount || 0})
          </button>
        </div>
      </div>

      {/* Storage Quota Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Supabase Free Tier Quota (1 GB)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.totalMB || "0.00"} MB
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                / {stats?.quotaMB || 1024} MB ({stats?.percentUsed || "0"}% utilized)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                percentNum > 85
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : percentNum > 60
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {percentNum > 85 ? "Critical Space" : percentNum > 60 ? "Moderate Usage" : "Healthy Quota"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
            style={{ width: `${Math.min(100, Math.max(1, percentNum))}%` }}
          />
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Files</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{stats?.fileCount || 0}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Orphaned Files</span>
            <p className="text-lg font-black text-amber-600 mt-0.5">{stats?.orphanCount || 0}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Average File Size</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {stats && stats.fileCount > 0
                ? `${((stats.totalBytes / stats.fileCount) / 1024).toFixed(1)} KB`
                : "0 KB"}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Available Free</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">
              {stats ? (stats.quotaMB - Number(stats.totalMB)).toFixed(1) : "1024.0"} MB
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Purge Old Payment Verification Screenshots</h4>
            <p className="text-[11px] text-slate-300">
              Clear temporary buyer UTR receipt screenshots from completed orders to conserve storage space.
            </p>
          </div>
        </div>
        <button
          onClick={handlePurgeProofs}
          disabled={actionLoading}
          className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-all border border-white/20 whitespace-nowrap"
        >
          Purge Verification Proofs
        </button>
      </div>

      {/* File Explorer & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:border-easyva-purple-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Product Asset">Product Assets</option>
              <option value="Hero Banner">Hero Banners</option>
              <option value="Merchant Standee QR">Merchant Standee QR</option>
              <option value="Payment Verification Proof">Payment Proofs</option>
              <option value="Blog Featured Image">Blog Featured Images</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="in_use">In Use Only</option>
              <option value="orphan">Orphaned Only</option>
            </select>
          </div>
        </div>

        {/* Mobile Media Cards (< 768px) */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-easyva-purple-600" />
              Scanning storage directory and references...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <FileImage className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              No files found matching criteria.
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file.name} className="p-3.5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="font-mono font-bold text-slate-700">{file.sizeFormatted}</span>
                      <span>•</span>
                      <span>{file.category}</span>
                    </div>
                    <div className="mt-1">
                      {file.isOrphan ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Orphan (Not Linked)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active In Use
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-lg border border-slate-200"
                      title="View Original"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.name)}
                      disabled={actionLoading}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg border border-rose-200"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop File Table (≥ 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Asset Preview</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-easyva-purple-600" />
                    Scanning storage directory and references...
                  </td>
                </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    <FileImage className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    No files found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-slate-900 max-w-[200px] truncate" title={file.name}>
                        {file.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(file.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {file.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-700 font-bold">
                      {file.sizeFormatted}
                    </td>
                    <td className="px-4 py-2.5">
                      {file.isOrphan ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Orphan (Not Linked)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active In Use
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Original"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.name)}
                          disabled={actionLoading}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

