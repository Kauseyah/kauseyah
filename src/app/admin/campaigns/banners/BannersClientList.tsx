"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  HomepageBanner, 
  updateBannerStatus, 
  duplicateBanner, 
  deleteBanner, 
  reorderBanners 
} from "@/app/actions/campaign-actions";
import { 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Calendar, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Smartphone,
  Monitor,
  X
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialBanners: HomepageBanner[];
}

export default function BannersClientList({ initialBanners }: Props) {
  const router = useRouter();
  const [banners, setBanners] = useState<HomepageBanner[]>(initialBanners);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewBanner, setPreviewBanner] = useState<HomepageBanner | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mountedTime, setMountedTime] = useState<number | null>(null);

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);

  // Helper to compute effective time-based schedule status
  const getEffectiveStatus = useCallback((b: HomepageBanner): "draft" | "active" | "inactive" | "scheduled" | "expired" => {
    if (b.status === "draft") return "draft";
    if (b.status === "inactive") return "inactive";
    if (!mountedTime) return "active";

    const start = b.start_at ? new Date(b.start_at).getTime() : null;
    const end = b.end_at ? new Date(b.end_at).getTime() : null;

    if (start && start > mountedTime) return "scheduled";
    if (end && end < mountedTime) return "expired";
    return "active";
  }, [mountedTime]);

  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const matchesSearch = 
        b.campaign_name.toLowerCase().includes(search.toLowerCase()) ||
        b.heading.toLowerCase().includes(search.toLowerCase()) ||
        (b.offer_text && b.offer_text.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === "all") return true;
      const effective = getEffectiveStatus(b);
      return effective === statusFilter;
    });
  }, [banners, search, statusFilter]);

  const handleToggleStatus = async (b: HomepageBanner) => {
    const newStatus = b.status === "active" ? "inactive" : "active";
    setIsUpdating(true);
    const res = await updateBannerStatus(b.id, newStatus);
    setIsUpdating(false);

    if (res.success) {
      toast.success(`Banner status updated to ${newStatus}`);
      setBanners((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, status: newStatus } : item))
      );
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const handleDuplicate = async (id: string) => {
    setIsUpdating(true);
    toast.loading("Duplicating banner...", { id: "dup" });
    const res = await duplicateBanner(id);
    setIsUpdating(false);

    if (res.success && res.data) {
      toast.success("Banner duplicated as Draft", { id: "dup" });
      setBanners((prev) => [res.data, ...prev]);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to duplicate", { id: "dup" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign banner? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    const res = await deleteBanner(id);
    setDeletingId(null);

    if (res.success) {
      toast.success("Banner deleted successfully");
      setBanners((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete banner");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    setBanners(reordered);
    const orderedIds = reordered.map((b) => b.id);
    await reorderBanners(orderedIds);
    toast.success("Display order updated");
    router.refresh();
  };

  const getStatusBadge = (b: HomepageBanner) => {
    const effective = getEffectiveStatus(b);
    switch (effective) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={12} /> Active
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock size={12} /> Scheduled
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle size={12} /> Expired
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Draft
          </span>
        );
      case "inactive":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} /> Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by name, heading, or offer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses ({banners.length})</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Banners Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4">Banner & Campaign</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Schedule (IST)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="text-base font-medium">No homepage banners found</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {search || statusFilter !== "all" 
                        ? "Try adjusting your search query or status filter." 
                        : "Click 'Create Banner' to set up your first campaign banner."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBanners.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-950/40 transition-colors">
                    {/* Display Order with Move Up/Down */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {idx + 1}
                        </span>
                        <button
                          type="button"
                          disabled={idx === banners.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail & Campaign Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0">
                          {b.desktop_image_url ? (
                            <Image
                              src={b.desktop_image_url}
                              alt={b.image_alt || b.campaign_name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate max-w-xs">
                            {b.campaign_name}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                            {b.heading}
                          </p>
                          {b.offer_text && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 mt-1">
                              <Tag size={11} /> {b.offer_text}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Campaign Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 capitalize">
                        {b.campaign_type.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs">
                      {b.start_at || b.end_at ? (
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 text-slate-300">
                            <Calendar size={12} className="text-slate-500" />
                            {b.start_at ? new Date(b.start_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "Immediate"}
                            {" → "}
                            {b.end_at ? new Date(b.end_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "Indefinite"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500">Always Active</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(b)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewBanner(b);
                            setPreviewDevice("desktop");
                          }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Preview banner appearance"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(b.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate banner"
                        >
                          <Copy size={16} />
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/campaigns/banners/${b.id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors inline-block"
                          title="Edit banner"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          disabled={deletingId === b.id}
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete banner"
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Status Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(b)}
                          className={`ml-2 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                            b.status === "active"
                              ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {b.status === "active" ? "Deactivate" : "Activate"}
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

      {/* PREVIEW MODAL */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-base">
                  Preview: {previewBanner.campaign_name}
                </span>
                <span className="text-xs text-slate-400">
                  ({previewBanner.campaign_type})
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 border border-slate-700 p-0.5 rounded-lg flex items-center">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      previewDevice === "desktop" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Monitor size={14} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      previewDevice === "mobile" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewBanner(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-stone-950">
              {previewDevice === "desktop" ? (
                /* Desktop Hero Simulation */
                <div className="w-full relative aspect-[21/9] max-h-[460px] rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center">
                  <Image
                    src={previewBanner.desktop_image_url}
                    alt={previewBanner.image_alt || previewBanner.heading}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
                  <div className="relative z-10 p-8 md:p-12 max-w-2xl text-white space-y-3">
                    {previewBanner.offer_text && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/90 text-white shadow-sm">
                        {previewBanner.offer_text}
                        {previewBanner.offer_code ? ` · Code: ${previewBanner.offer_code}` : ""}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight">
                      {previewBanner.heading}
                    </h2>
                    {previewBanner.subtitle && (
                      <p className="text-base text-amber-200/90 font-medium">
                        {previewBanner.subtitle}
                      </p>
                    )}
                    {previewBanner.description && (
                      <p className="text-xs md:text-sm text-stone-300 line-clamp-2 max-w-xl">
                        {previewBanner.description}
                      </p>
                    )}
                    {previewBanner.cta_text && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B00] text-white font-bold text-xs shadow-lg uppercase tracking-wider">
                          {previewBanner.cta_text}
                          <ExternalLink size={13} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Mobile Simulation Frame */
                <div className="w-[320px] aspect-[9/16] rounded-[36px] overflow-hidden border-4 border-slate-700 bg-black relative shadow-2xl flex flex-col justify-end">
                  <Image
                    src={previewBanner.mobile_image_url || previewBanner.desktop_image_url}
                    alt={previewBanner.image_alt || previewBanner.heading}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="relative z-10 p-5 text-white space-y-2 pb-8">
                    {previewBanner.offer_text && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-600 text-white">
                        {previewBanner.offer_text}
                      </span>
                    )}
                    <h3 className="text-xl font-display leading-tight font-bold">
                      {previewBanner.heading}
                    </h3>
                    {previewBanner.subtitle && (
                      <p className="text-xs text-amber-200/90 font-medium">
                        {previewBanner.subtitle}
                      </p>
                    )}
                    {previewBanner.cta_text && (
                      <div className="pt-2">
                        <span className="w-full text-center block py-2 rounded-full bg-[#FF6B00] text-white font-bold text-xs uppercase tracking-wider">
                          {previewBanner.cta_text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
