"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  AnnouncementBarItem, 
  CampaignStatus,
  updateAnnouncementStatus, 
  duplicateAnnouncement, 
  deleteAnnouncement,
  reorderAnnouncements
} from "@/app/actions/campaign-actions";
import { 
  Search, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  Megaphone,
  AlertTriangle,
  X
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialAnnouncements: AnnouncementBarItem[];
}

export default function AnnouncementsClientList({ initialAnnouncements }: Props) {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<AnnouncementBarItem[]>(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "scheduled" | "expired" | "inactive">("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [previewItem, setPreviewItem] = useState<AnnouncementBarItem | null>(
    initialAnnouncements.find(a => a.status === "active") || initialAnnouncements[0] || null
  );
  const [mountedTime, setMountedTime] = useState<number | null>(null);

  useEffect(() => {
    setMountedTime(Date.now());
  }, []);

  // Helper to determine status
  const getAnnouncementState = (item: AnnouncementBarItem) => {
    if (item.status === "inactive" || item.status === "draft") return "inactive";
    if (!mountedTime) return "active";
    if (item.start_at && new Date(item.start_at).getTime() > mountedTime) return "scheduled";
    if (item.end_at && new Date(item.end_at).getTime() < mountedTime) return "expired";
    return "active";
  };

  // Filtered items
  const filteredAnnouncements = announcements.filter(item => {
    const state = getAnnouncementState(item);
    if (statusFilter !== "all" && state !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.internal_name.toLowerCase().includes(q);
      const matchMessage = item.message.toLowerCase().includes(q);
      const matchLink = item.cta_text?.toLowerCase().includes(q) || false;
      return matchName || matchMessage || matchLink;
    }

    return true;
  });

  // Toggle status
  const handleToggleStatus = async (item: AnnouncementBarItem) => {
    const newStatus: CampaignStatus = item.status === "active" ? "inactive" : "active";
    const toastId = toast.loading(`${newStatus === "active" ? "Activating" : "Deactivating"} announcement...`);
    
    try {
      const res = await updateAnnouncementStatus(item.id, newStatus);
      if (res.success) {
        setAnnouncements(prev => prev.map(a => a.id === item.id ? { ...a, status: newStatus } : a));
        toast.success(`Announcement ${newStatus === "active" ? "activated" : "deactivated"}`, { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status", { id: toastId });
      }
    } catch {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  // Duplicate
  const handleDuplicate = async (id: string) => {
    const toastId = toast.loading("Duplicating announcement...");
    try {
      const res = await duplicateAnnouncement(id);
      if (res.success && res.data) {
        setAnnouncements(prev => [res.data, ...prev]);
        toast.success("Announcement duplicated as inactive draft", { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to duplicate", { id: toastId });
      }
    } catch {
      toast.error("Failed to duplicate", { id: toastId });
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting announcement...");
    try {
      const res = await deleteAnnouncement(id);
      if (res.success) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        if (previewItem?.id === id) {
          setPreviewItem(null);
        }
        setIsDeleting(null);
        toast.success("Announcement deleted successfully", { id: toastId });
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete announcement", { id: toastId });
      }
    } catch {
      toast.error("Failed to delete announcement", { id: toastId });
    }
  };

  // Reorder up/down
  const handleMove = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= announcements.length) return;

    const newOrder = [...announcements];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setAnnouncements(newOrder.map((item, idx) => ({ ...item, display_order: idx + 1 })));
    setIsReordering(true);

    try {
      const res = await reorderAnnouncements(newOrder.map(a => a.id));
      if (res.success) {
        toast.success("Display sequence updated");
      } else {
        toast.error(res.error || "Failed to save reorder");
      }
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Storefront Preview of Selected Announcement */}
      {previewItem ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-orange-400" />
              <span>Live Top Bar Preview: <strong className="text-slate-200">{previewItem.internal_name}</strong></span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Priority: {previewItem.priority} • Order: #{previewItem.display_order}
            </span>
          </div>

          <div 
            className="py-2.5 px-4 text-xs font-medium text-center relative transition-colors duration-300 flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: previewItem.background_color || "#851A36", 
              color: previewItem.text_color || "#FFFFFF" 
            }}
          >
            <span>{previewItem.message}</span>
            {previewItem.cta_text && previewItem.cta_url && (
              <a
                href={previewItem.cta_url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 font-bold ml-1.5 inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: previewItem.text_color || "#FFFFFF" }}
              >
                {previewItem.cta_text}
                <ExternalLink size={12} />
              </a>
            )}
            {previewItem.is_dismissible && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
                aria-label="Dismiss announcement"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Filter and Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search announcements by title or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "active", "scheduled", "expired", "inactive"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === tab
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Order</th>
                <th className="py-3.5 px-4">Title & Message</th>
                <th className="py-3.5 px-4">Colors</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Megaphone className="mx-auto mb-2 opacity-30" size={32} />
                    <p className="text-sm">No announcements found matching your filter.</p>
                    <Link
                      href="/admin/campaigns/announcements/new"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-semibold"
                    >
                      <Plus size={14} /> Create your first announcement
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((item, index) => {
                  const state = getAnnouncementState(item);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setPreviewItem(item)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        previewItem?.id === item.id ? "bg-slate-800/30" : ""
                      }`}
                    >
                      {/* Reorder controls */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0 || isReordering}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{item.display_order}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMove(index, "down")}
                            disabled={index === announcements.length - 1 || isReordering}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>

                      {/* Title & Message */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-semibold text-white truncate flex items-center gap-2">
                          {item.internal_name}
                          {item.is_dismissible && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                              Dismissible
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.message}
                        </p>
                        {item.cta_text && item.cta_url && (
                          <div className="text-[11px] text-orange-400/80 truncate mt-0.5 flex items-center gap-1">
                            <ExternalLink size={10} />
                            <span>{item.cta_text}: {item.cta_url}</span>
                          </div>
                        )}
                      </td>

                      {/* Colors */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-md border border-slate-700 shadow-xs"
                            style={{ backgroundColor: item.background_color }}
                            title={`Background: ${item.background_color}`}
                          />
                          <span
                            className="w-5 h-5 rounded-md border border-slate-700 shadow-xs flex items-center justify-center text-[10px] font-bold"
                            style={{ backgroundColor: item.background_color, color: item.text_color }}
                            title={`Text: ${item.text_color}`}
                          >
                            Aa
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {item.start_at || item.end_at ? (
                          <div className="space-y-0.5">
                            {item.start_at && (
                              <div className="flex items-center gap-1">
                                <Clock size={11} className="text-slate-500" />
                                <span>From: {new Date(item.start_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                              </div>
                            )}
                            {item.end_at && (
                              <div className="flex items-center gap-1">
                                <Clock size={11} className="text-slate-500" />
                                <span>Until: {new Date(item.end_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">Always active</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                          item.priority >= 10
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : item.priority >= 5
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-800 text-slate-300"
                        }`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            state === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : state === "scheduled"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                              : state === "expired"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {state === "active" && <CheckCircle2 size={12} />}
                          {state === "scheduled" && <Calendar size={12} />}
                          {state === "expired" && <Clock size={12} />}
                          {state === "inactive" && <XCircle size={12} />}
                          <span className="capitalize">{state}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/campaigns/announcements/${item.id}`}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Announcement"
                          >
                            <Edit3 size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(item.id)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Duplicate Announcement"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsDeleting(item.id)}
                            className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Announcement"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle size={24} />
              </span>
              <h3 className="text-lg font-bold text-white">Delete Announcement</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this announcement? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleting(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(isDeleting)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Delete Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
