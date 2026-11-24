"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  AnnouncementBarItem, 
  CampaignStatus,
  createAnnouncement, 
  updateAnnouncement 
} from "@/app/actions/campaign-actions";
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Calendar, 
  Link as LinkIcon, 
  Palette, 
  ExternalLink,
  Eye,
  Megaphone,
  X
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialAnnouncement?: AnnouncementBarItem | null;
  isEdit?: boolean;
}

const COLOR_PRESETS = [
  { name: "Kauseyah Burgundy", bg: "#851A36", text: "#FFFFFF" },
  { name: "Festive Deep Maroon", bg: "#4A1D24", text: "#FFF8F3" },
  { name: "Royal Obsidian", bg: "#1A1A1A", text: "#FFFFFF" },
  { name: "Heritage Forest", bg: "#1B382B", text: "#FFFFFF" },
  { name: "Warm Terracotta", bg: "#7C2D12", text: "#FFFFFF" },
];

export default function AnnouncementForm({ initialAnnouncement, isEdit = false }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [internalName, setInternalName] = useState(initialAnnouncement?.internal_name || "");
  const [message, setMessage] = useState(initialAnnouncement?.message || "");
  const [ctaUrl, setCtaUrl] = useState(initialAnnouncement?.cta_url || "");
  const [ctaText, setCtaText] = useState(initialAnnouncement?.cta_text || "");
  
  // Colors
  const [backgroundColor, setBackgroundColor] = useState(initialAnnouncement?.background_color || "#851A36");
  const [textColor, setTextColor] = useState(initialAnnouncement?.text_color || "#FFFFFF");

  // Scheduling & Behavior
  const [status, setStatus] = useState<CampaignStatus>(initialAnnouncement?.status || "active");
  const [isDismissible, setIsDismissible] = useState(initialAnnouncement ? initialAnnouncement.is_dismissible : true);
  const [priority, setPriority] = useState<number>(initialAnnouncement?.priority ?? 0);
  const [displayOrder, setDisplayOrder] = useState<number>(initialAnnouncement?.display_order ?? 1);
  const [startAt, setStartAt] = useState(
    initialAnnouncement?.start_at ? new Date(initialAnnouncement.start_at).toISOString().slice(0, 16) : ""
  );
  const [endAt, setEndAt] = useState(
    initialAnnouncement?.end_at ? new Date(initialAnnouncement.end_at).toISOString().slice(0, 16) : ""
  );

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalName.trim() || !message.trim()) {
      toast.error("Please provide both an internal title and an announcement message.");
      return;
    }

    if (startAt && endAt && new Date(startAt) >= new Date(endAt)) {
      toast.error("Scheduled end time must be later than start time.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(isEdit ? "Saving announcement..." : "Creating announcement...");

    try {
      const formData = new FormData();
      formData.set("internal_name", internalName);
      formData.set("message", message);
      formData.set("cta_url", ctaUrl);
      formData.set("cta_text", ctaText);
      formData.set("background_color", backgroundColor);
      formData.set("text_color", textColor);
      formData.set("status", status);
      formData.set("is_dismissible", String(isDismissible));
      formData.set("priority", String(priority));
      formData.set("display_order", String(displayOrder));
      formData.set("start_at", startAt ? new Date(startAt).toISOString() : "");
      formData.set("end_at", endAt ? new Date(endAt).toISOString() : "");

      const res = isEdit && initialAnnouncement
        ? await updateAnnouncement(initialAnnouncement.id, formData)
        : await createAnnouncement(formData);

      if (res.success) {
        toast.success(isEdit ? "Announcement updated successfully" : "Announcement created successfully", { id: toastId });
        router.push("/admin/campaigns/announcements");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save announcement", { id: toastId });
      }
    } catch {
      toast.error("An error occurred while saving announcement", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/announcements"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isEdit ? "Edit Announcement" : "Create New Announcement"}
            </h1>
            <p className="text-xs text-slate-400">
              Configure top-bar notification text, brand colors, link destination, and scheduling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/campaigns/announcements"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            <Save size={16} />
            {isSubmitting ? "Saving..." : isEdit ? "Update Announcement" : "Publish Announcement"}
          </button>
        </div>
      </div>

      {/* Live Sticky Preview Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg sticky top-4 z-20">
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-orange-400" />
            <span className="font-semibold text-slate-200">Live Top Bar Preview</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono capitalize">
            Status: {status}
          </span>
        </div>

        <div 
          className="py-2.5 px-4 text-xs font-medium text-center relative transition-colors duration-300 flex items-center justify-center gap-2 min-h-[38px]"
          style={{ backgroundColor: backgroundColor, color: textColor }}
        >
          <span>{message || "Preview: Enter your announcement message below to preview live..."}</span>
          {ctaText && (
            <span
              className="underline underline-offset-2 font-bold ml-1.5 inline-flex items-center gap-1 cursor-pointer"
              style={{ color: textColor }}
            >
              {ctaText}
              <ExternalLink size={12} />
            </span>
          )}
          {isDismissible && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 p-1"
              title="Dismiss preview"
            >
              <X size={14} />
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Announcement Details & Message */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone size={18} className="text-orange-400" />
              Content & Copy
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Internal Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Festive Complimentary Shipping, Diwali 20% Off Ticker"
                  value={internalName}
                  onChange={(e) => setInternalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                />
                <p className="mt-1 text-[11px] text-slate-500">For internal admin identification.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Announcement Message *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g., Complimentary Pan-India Delivery on Handcrafted Silk & Brass Gifts Above ₹2,500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <LinkIcon size={13} className="text-orange-400" />
                    Action Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Shop Now, Explore Gifts, Claim Offer"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-orange-400" />
                    Target Destination URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., /collections/bespoke-gifts or /products"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color & Styling Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Palette size={18} className="text-orange-400" />
              Brand Colors & Styling
            </h2>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Brand Palettes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2.5 p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-colors"
                  >
                    <span
                      className="w-6 h-6 rounded-md border border-slate-700 shadow-xs shrink-0"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{preset.bg}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Text & Link Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Scheduling */}
        <div className="space-y-6">
          {/* Status & Priority Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-orange-400" />
              Settings & Priority
            </h2>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Campaign Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500/50"
              >
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Unpublished)</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Dismissible Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">User Dismissible</span>
                <span className="text-[11px] text-slate-400">Show close (✕) button for users</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDismissible}
                  onChange={(e) => setIsDismissible(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {/* Priority Weight */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Weight (0 to 100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Higher priority notices are displayed first or take precedence during urgent events.
              </p>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Display Order Sequence
              </label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Rotation order sequence among active announcements with identical priority.
              </p>
            </div>
          </div>

          {/* Scheduling Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-orange-400" />
              Scheduling (IST Asia/Kolkata)
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Start Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                End Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Leave dates empty if this announcement is evergreen and always active.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
