"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  HomepageBanner, 
  createBanner, 
  updateBanner, 
  CampaignType, 
  CampaignStatus 
} from "@/app/actions/campaign-actions";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Sparkles, 
  Calendar, 
  Tag, 
  Link as LinkIcon, 
  Monitor, 
  Smartphone, 
  Save, 
  Eye, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  initialBanner?: HomepageBanner | null;
  isEdit?: boolean;
}

export default function BannerForm({ initialBanner, isEdit = false }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [campaignName, setCampaignName] = useState(initialBanner?.campaign_name || "");
  const [campaignType, setCampaignType] = useState<CampaignType>(initialBanner?.campaign_type || "general");
  const [heading, setHeading] = useState(initialBanner?.heading || "");
  const [subtitle, setSubtitle] = useState(initialBanner?.subtitle || "");
  const [description, setDescription] = useState(initialBanner?.description || "");
  const [imageAlt, setImageAlt] = useState(initialBanner?.image_alt || "");

  // Promotional Content
  const [offerText, setOfferText] = useState(initialBanner?.offer_text || "");
  const [discountLabel, setDiscountLabel] = useState(initialBanner?.discount_label || "");
  const [offerCode, setOfferCode] = useState(initialBanner?.offer_code || "");
  const [ctaText, setCtaText] = useState(initialBanner?.cta_text || "Explore Collection");
  const [ctaUrl, setCtaUrl] = useState(initialBanner?.cta_url || "/collections/apparels");

  // Scheduling & Display
  const [status, setStatus] = useState<CampaignStatus>(initialBanner?.status || "draft");
  const [displayOrder, setDisplayOrder] = useState(initialBanner?.display_order ?? 0);
  const [startAt, setStartAt] = useState(
    initialBanner?.start_at ? new Date(initialBanner.start_at).toISOString().slice(0, 16) : ""
  );
  const [endAt, setEndAt] = useState(
    initialBanner?.end_at ? new Date(initialBanner.end_at).toISOString().slice(0, 16) : ""
  );

  // Desktop Image State
  const [desktopImageUrl, setDesktopImageUrl] = useState(initialBanner?.desktop_image_url || "");
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState(initialBanner?.desktop_image_url || "");

  // Mobile Image State
  const [mobileImageUrl, setMobileImageUrl] = useState(initialBanner?.mobile_image_url || "");
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState(initialBanner?.mobile_image_url || "");

  // Preview Mode Tab
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesktopFile(file);
    const objectUrl = URL.createObjectURL(file);
    setDesktopPreview(objectUrl);
  };

  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMobileFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMobilePreview(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      toast.error("Please provide an internal campaign name");
      return;
    }
    if (!heading.trim()) {
      toast.error("Please provide a main heading");
      return;
    }
    if (!desktopPreview && !desktopImageUrl && !desktopFile) {
      toast.error("Please provide a desktop banner image");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("campaign_name", campaignName.trim());
    formData.set("campaign_type", campaignType);
    formData.set("heading", heading.trim());
    formData.set("subtitle", subtitle.trim());
    formData.set("description", description.trim());
    formData.set("image_alt", imageAlt.trim() || heading.trim());

    formData.set("offer_text", offerText.trim());
    formData.set("discount_label", discountLabel.trim());
    formData.set("offer_code", offerCode.trim());
    formData.set("cta_text", ctaText.trim());
    formData.set("cta_url", ctaUrl.trim());

    formData.set("status", status);
    formData.set("display_order", String(displayOrder));
    if (startAt) formData.set("start_at", new Date(startAt).toISOString());
    if (endAt) formData.set("end_at", new Date(endAt).toISOString());

    // Images
    formData.set("desktop_image_url", desktopImageUrl);
    if (desktopFile) {
      formData.set("desktop_image_file", desktopFile);
    }

    formData.set("mobile_image_url", mobileImageUrl);
    if (mobileFile) {
      formData.set("mobile_image_file", mobileFile);
    }

    try {
      let res;
      if (isEdit && initialBanner?.id) {
        res = await updateBanner(initialBanner.id, formData);
      } else {
        res = await createBanner(formData);
      }

      if (res.success) {
        toast.success(isEdit ? "Banner updated successfully" : "Banner created successfully");
        router.push("/admin/campaigns/banners");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save banner");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/banners"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isEdit ? "Edit Homepage Banner" : "Create Homepage Banner"}
            </h1>
            <p className="text-xs text-slate-400">
              Configure promotional copy, responsive banner media, schedule, and CTA destination.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md cursor-pointer"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : isEdit ? "Update Banner" : "Publish Banner"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Section 1: Campaign Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-[11px] text-slate-400">
              <Sparkles size={14} className="text-orange-400" />
              1. Campaign Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Internal Campaign Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Diwali Handloom Showcase 2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Campaign Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as CampaignType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="festive">Festive Celebration</option>
                    <option value="seasonal">Seasonal Edit</option>
                    <option value="promotional">Promotional Offer</option>
                    <option value="product_launch">New Collection Launch</option>
                    <option value="special_collection">Special Curation</option>
                    <option value="general">General Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="active">Active (Visible if scheduled)</option>
                    <option value="inactive">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Main Headline / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. The Timeless Splendour of Kosa Silk"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-orange-500 font-display text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Handcrafted drapes woven by indigenous tribal artisans"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Supporting Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief descriptive copy explaining the craft, heritage or collection..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banner Media & Images */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-[11px] text-slate-400">
              <Upload size={14} className="text-orange-400" />
              2. Banner Media & Responsiveness
            </h2>

            {/* Desktop Banner (Required) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Desktop Banner Image <span className="text-red-400">*</span>{" "}
                <span className="text-slate-500 font-normal">(Recommended ratio: 21:9 or 16:9, max 5 MB)</span>
              </label>

              {desktopPreview ? (
                <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                  <Image
                    src={desktopPreview}
                    alt="Desktop Banner Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer transition-colors">
                      Replace Image
                      <input type="file" accept="image/*" onChange={handleDesktopFileChange} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopFile(null);
                        setDesktopPreview("");
                        setDesktopImageUrl("");
                      }}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-orange-500 transition-colors bg-slate-950/40">
                  <Upload className="mx-auto text-slate-500 mb-2" size={24} />
                  <p className="text-xs text-slate-300 font-medium">Upload desktop hero banner</p>
                  <p className="text-[11px] text-slate-500 mt-1">JPG, PNG, WebP or AVIF up to 5 MB</p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <label className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors border border-slate-600">
                      Browse File
                      <input type="file" accept="image/*" onChange={handleDesktopFileChange} className="hidden" />
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="Or paste external image URL..."
                      value={desktopImageUrl}
                      onChange={(e) => {
                        setDesktopImageUrl(e.target.value);
                        setDesktopPreview(e.target.value);
                      }}
                      className="text-xs bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-300 w-full max-w-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Banner (Optional) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Mobile Banner Image (Optional){" "}
                <span className="text-slate-500 font-normal">(Optimized 9:16 or portrait for small screens)</span>
              </label>

              {mobilePreview ? (
                <div className="relative aspect-[4/3] w-48 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
                  <Image
                    src={mobilePreview}
                    alt="Mobile Banner Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2 py-1 rounded bg-orange-600 text-white text-[11px] font-bold cursor-pointer">
                      Replace
                      <input type="file" accept="image/*" onChange={handleMobileFileChange} className="hidden" />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileFile(null);
                        setMobilePreview("");
                        setMobileImageUrl("");
                      }}
                      className="p-1 rounded bg-red-600 text-white text-xs cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors">
                    Upload Mobile Image
                    <input type="file" accept="image/*" onChange={handleMobileFileChange} className="hidden" />
                  </label>
                  <input
                    type="url"
                    placeholder="Or mobile image URL..."
                    value={mobileImageUrl}
                    onChange={(e) => {
                      setMobileImageUrl(e.target.value);
                      setMobilePreview(e.target.value);
                    }}
                    className="flex-1 text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Image Alt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Image Alt Text <span className="text-slate-500 font-normal">(for accessibility and SEO)</span>
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive alt text for screen readers..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Section 3: Promotional Details & Call-To-Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-[11px] text-slate-400">
              <Tag size={14} className="text-orange-400" />
              3. Promotional Details & Call-To-Action
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Offer Badge Text
                </label>
                <input
                  type="text"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  placeholder="e.g. Festive Edit · Limited Batch"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Discount Tag (Optional)
                </label>
                <input
                  type="text"
                  value={discountLabel}
                  onChange={(e) => setDiscountLabel(e.target.value)}
                  placeholder="e.g. Complimentary Gift Box"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value)}
                  placeholder="e.g. UTSAV2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono uppercase focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Shop Festive Edit"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination URL <span className="text-slate-500 font-normal">(relative or https://)</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="e.g. /collections/sarees"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Scheduling & Ordering */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider text-[11px] text-slate-400">
              <Calendar size={14} className="text-orange-400" />
              4. Scheduling & Display Order (Asia/Kolkata IST)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Date & Time (IST)
                </label>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Leave blank for immediate</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  End Date & Time (IST)
                </label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Leave blank for indefinite</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">0 is highest priority</span>
              </div>
            </div>
          </div>
        </form>

        {/* Right Column: Interactive Real-Time Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} className="text-orange-400" /> Real-Time Preview
              </span>

              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewTab("desktop")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    previewTab === "desktop" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Monitor size={12} /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("mobile")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    previewTab === "mobile" ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone size={12} /> Mobile
                </button>
              </div>
            </div>

            {/* Display Component Simulation */}
            <div className="flex items-center justify-center p-3 bg-stone-950 rounded-lg border border-slate-800/80 min-h-[300px]">
              {previewTab === "desktop" ? (
                /* Desktop Banner Preview */
                <div className="w-full relative aspect-[21/9] rounded-lg overflow-hidden border border-white/10 shadow-lg flex items-center bg-slate-900">
                  {desktopPreview ? (
                    <Image
                      src={desktopPreview}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-medium">
                      Upload image to see preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
                  <div className="relative z-10 p-5 max-w-sm text-white space-y-2">
                    {offerText && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white">
                        {offerText}
                      </span>
                    )}
                    <h3 className="text-lg md:text-xl font-display font-bold leading-tight">
                      {heading || "Your Headline Appears Here"}
                    </h3>
                    {subtitle && (
                      <p className="text-[11px] text-amber-200/90 font-medium line-clamp-1">
                        {subtitle}
                      </p>
                    )}
                    {ctaText && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#FF6B00] text-white font-bold text-[10px] uppercase tracking-wider">
                          {ctaText} <ExternalLink size={10} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Mobile Banner Preview */
                <div className="w-[220px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black relative shadow-lg flex flex-col justify-end">
                  {mobilePreview || desktopPreview ? (
                    <Image
                      src={mobilePreview || desktopPreview}
                      alt="Mobile Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 p-2 text-center">
                      Upload image for mobile preview
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="relative z-10 p-3 text-white space-y-1.5 pb-4">
                    {offerText && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-orange-600 text-white">
                        {offerText}
                      </span>
                    )}
                    <h4 className="text-xs font-display font-bold leading-tight line-clamp-2">
                      {heading || "Headline Here"}
                    </h4>
                    {ctaText && (
                      <div className="pt-1">
                        <span className="w-full text-center block py-1 rounded-full bg-[#FF6B00] text-white font-bold text-[9px] uppercase tracking-wider">
                          {ctaText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Summary Card */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-white capitalize">{status}</span>
              </div>
              <div className="flex justify-between">
                <span>Display Order:</span>
                <span className="font-mono text-slate-300">{displayOrder}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-mono text-orange-400 truncate max-w-[180px]">{ctaUrl || "None"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
