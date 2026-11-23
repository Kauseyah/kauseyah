"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  ImagePlus,
  ChevronDown,
  Plus,
  Trash2,
  Copy,
  AlertCircle,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  Video,
  FileText,
  Lock,
  Globe,
  Sparkles,
  Layers,
  HelpCircle,
  Eye,
} from "lucide-react";
import { createProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

interface VariantItem {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  imageUrl?: string;
  price?: number | "";
  stock: number;
}

interface SpecificationItem {
  key: string;
  value: string;
}

const CustomSelect = ({ value, onChange, placeholder, options, groups }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  let selectedLabel = placeholder;
  if (value) {
    if (options) {
      const opt = options.find((o: any) => o.value === value);
      if (opt) selectedLabel = opt.label;
    } else if (groups) {
      for (const g of groups) {
        const opt = g.options.find((o: any) => o.value === value);
        if (opt) {
          selectedLabel = opt.label;
          break;
        }
      }
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
      >
        <span className={!value && placeholder !== "Draft" ? "text-slate-500" : "text-white"}>{selectedLabel}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto top-full left-0 origin-top animate-in fade-in zoom-in-95 duration-100 py-1">
          {options && options.map((opt: any) => (
            <div
              key={opt.value}
              className={`px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm transition-colors ${value === opt.value ? 'bg-orange-500/10 text-orange-400 font-bold' : 'text-slate-300'}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}

          {groups && groups.map((g: any) => (
            <div key={g.label}>
              <div className="px-4 py-2 bg-slate-950 text-xs font-bold text-slate-500 uppercase tracking-wider">{g.label}</div>
              {g.options.map((opt: any) => (
                <div
                  key={opt.value}
                  className={`px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm pl-6 transition-colors ${value === opt.value ? 'bg-orange-500/10 text-orange-400 font-bold' : 'text-slate-300'}`}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          ))}

          {(!options || options.length === 0) && (!groups || groups.length === 0) && (
            <div className="px-4 py-3 text-sm text-slate-500 italic text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate_from");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingDuplicate, setLoadingDuplicate] = useState(false);
  const [duplicateSourceTitle, setDuplicateSourceTitle] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Media States
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoPosterUrl, setVideoPosterUrl] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoPosterFile, setVideoPosterFile] = useState<File | null>(null);

  // Taxonomy States
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Core Form Fields
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [parentStock, setParentStock] = useState(0);
  const [sku, setSku] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

  // Structured Specifications State
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([
    { key: "Craft", value: "Traditional Handloom" },
    { key: "Weave", value: "Wild Kosa Silk" },
  ]);

  // Special Notes State
  const [publicNotes, setPublicNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Variant State
  const [variantItems, setVariantItems] = useState<VariantItem[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Auto-generate slug when typing name if not duplicating
  const handleNameChange = (val: string) => {
    setName(val);
    if (!duplicateId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  // Specification helpers
  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateSpecification = (index: number, field: "key" | "value", val: string) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Image Gallery Helpers
  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // Validate sizes
    const validFiles = files.filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`File ${f.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((f) => URL.createObjectURL(f));
    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveExistingImage = (from: number, to: number) => {
    if (to < 0 || to >= existingImages.length) return;
    setExistingImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const makeExistingPrimary = (idx: number) => {
    if (idx === 0) return;
    moveExistingImage(idx, 0);
    toast.success("Cover image set");
  };

  // Video Helpers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video exceeds maximum allowed size of 50MB");
      return;
    }
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid format. Please upload MP4 or WebM.");
      return;
    }
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl("");
    setVideoUrl("");
    setVideoPosterUrl("");
    setVideoPosterFile(null);
    toast.success("Video removed");
  };

  // Variant Helpers
  const addVariantPresetSize = (size: string) => {
    const exists = variantItems.some((v) => v.size === size && !v.color);
    if (exists) {
      toast("Size variant already added");
      return;
    }
    setVariantItems((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        size,
        color: "",
        colorHex: "",
        imageUrl: "",
        price: "",
        stock: 5,
      },
    ]);
  };

  const addColorVariant = () => {
    setVariantItems((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        size: "",
        color: "Terracotta",
        colorHex: "#D95D1E",
        imageUrl: existingImages[0] || "",
        price: "",
        stock: 5,
      },
    ]);
  };

  const updateVariant = (idx: number, patch: Partial<VariantItem>) => {
    setVariantItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], ...patch };
      return updated;
    });
  };

  const removeVariant = (idx: number) => {
    setVariantItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalVariantStock = variantItems.reduce((sum, v) => sum + (v.stock || 0), 0);

  // Discount Calculation Helper
  const numSellingPrice = parseFloat(price) || 0;
  const numComparePrice = parseFloat(compareAtPrice) || 0;
  const hasDiscount = numComparePrice > numSellingPrice && numSellingPrice > 0;
  const calculatedDiscountPercent = hasDiscount
    ? Math.round(((numComparePrice - numSellingPrice) / numComparePrice) * 100)
    : 0;

  // Fetch Categories & Subcategories
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*"),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (subcatsRes.data) setSubcategories(subcatsRes.data);
    };
    fetchData();
  }, []);

  // Duplicate Product Prefilling
  useEffect(() => {
    if (!duplicateId) return;

    const fetchDuplicateSource = async () => {
      setLoadingDuplicate(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", duplicateId)
        .single();

      if (error || !data) {
        toast.error("Could not fetch product to duplicate");
        setLoadingDuplicate(false);
        return;
      }

      const randomSuffix = Math.random().toString(36).substring(2, 6);
      setDuplicateSourceTitle(data.name);
      setName(`Copy of ${data.name}`);
      setSlug(`${data.slug}-copy-${randomSuffix}`);
      setSubtitle(data.subtitle || "");
      setDescription(data.description || "");
      setShortDescription(data.short_description || "");
      setMaterial(data.material || "");
      setDimensions(data.dimensions || "");
      setCareInstructions(data.care_instructions || "");
      setPrice(data.price ? String(data.price) : "");
      setCompareAtPrice(data.compare_at_price ? String(data.compare_at_price) : (data.discount_price ? String(data.discount_price) : ""));
      setSku(data.sku ? `${data.sku}-COPY` : "");
      setCategoryId(data.category_id || "");
      setSubcategory(data.subcategory || "");
      setPublicNotes(data.public_notes || "");
      setInternalNotes(data.internal_notes || "");
      setSeoTitle(data.seo_title || "");
      setSeoDescription(data.seo_description || "");
      setFeatured(false);

      // CRITICAL DUPLICATE CONSTRAINTS:
      // Status strictly set to 'draft', stock reset to 0
      setStatus("draft");
      setParentStock(0);

      // Copy specifications
      if (data.specifications && Array.isArray(data.specifications)) {
        setSpecifications([...data.specifications]);
      }

      // Clone existing images independently
      if (data.images && Array.isArray(data.images)) {
        setExistingImages([...data.images]);
      }

      // Copy video references if present
      if (data.video_url) setVideoUrl(data.video_url);
      if (data.video_poster_url) setVideoPosterUrl(data.video_poster_url);

      // Clone variants with stock reset to 0
      if (data.variants && Array.isArray(data.variants)) {
        setVariantItems(
          data.variants.map((v: any, i: number) => ({
            id: `dup-${Date.now()}-${i}`,
            size: v.size || "",
            color: v.color || "",
            colorHex: v.colorHex || "",
            imageUrl: v.imageUrl || "",
            price: v.price || "",
            stock: 0,
          }))
        );
      }

      toast.success(`Prefilled from "${data.name}". Stock set to 0 & status set to Draft.`);
      setLoadingDuplicate(false);
    };

    fetchDuplicateSource();
  }, [duplicateId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Validate discount price logic
    if (compareAtPrice && parseFloat(compareAtPrice) <= parseFloat(price)) {
      setErrorMsg("Original list price (MSRP) must be higher than selling price when setting a discount.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    if (subtitle) formData.set("subtitle", subtitle);
    formData.set("description", description);
    if (shortDescription) formData.set("short_description", shortDescription);
    if (material) formData.set("material", material);
    if (dimensions) formData.set("dimensions", dimensions);
    if (careInstructions) formData.set("care_instructions", careInstructions);
    formData.set("price", price);
    if (compareAtPrice) formData.set("compare_at_price", compareAtPrice);
    if (sku) formData.set("sku", sku);
    formData.set("status", status);
    if (categoryId) formData.set("category_id", categoryId);
    if (subcategory) formData.set("subcategory", subcategory);
    if (featured) formData.set("featured", "true");

    // Specifications JSON
    formData.set("specifications", JSON.stringify(specifications.filter((s) => s.key.trim() && s.value.trim())));

    // Special Notes
    if (publicNotes) formData.set("public_notes", publicNotes);
    if (internalNotes) formData.set("internal_notes", internalNotes);

    // SEO
    if (seoTitle) formData.set("seo_title", seoTitle);
    if (seoDescription) formData.set("seo_description", seoDescription);

    // Stock handling
    const finalStock = variantItems.length > 0 ? totalVariantStock : Math.max(0, parentStock);
    formData.set("stock", String(finalStock));

    // Variants JSON payload
    if (variantItems.length > 0) {
      const cleanVariants = variantItems.map((v) => ({
        id: v.id,
        ...(v.size ? { size: v.size } : {}),
        ...(v.color ? { color: v.color, colorHex: v.colorHex } : {}),
        ...(v.imageUrl ? { imageUrl: v.imageUrl } : {}),
        ...(typeof v.price === "number" && v.price > 0 ? { price: v.price } : {}),
        stock: Math.max(0, Number(v.stock) || 0),
      }));
      formData.set("variants", JSON.stringify(cleanVariants));
    } else {
      formData.set("variants", "[]");
    }

    // Preserve existing images in exact user-configured order
    if (existingImages.length > 0) {
      existingImages.forEach((img) => formData.append("existing_images", img));
    }

    // Append new image files
    newImageFiles.forEach((file) => formData.append("images", file));

    // Video handling
    if (videoFile) formData.append("video_file", videoFile);
    if (videoPosterFile) formData.append("video_poster_file", videoPosterFile);
    if (videoUrl) formData.set("video_url", videoUrl);
    if (videoPosterUrl) formData.set("video_poster_url", videoPosterUrl);

    try {
      const result = await createProduct(formData);

      if (result?.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else {
        toast.success(status === "draft" ? "Draft saved successfully!" : "Product published successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to upload: Files might be too large, or a network error occurred.");
      setIsSubmitting(false);
    }
  }

  const selectedCat = categories.find((c) => c.id === categoryId);
  const filteredSubcategories = subcategories.filter(
    (sc) => !categoryId || sc.category_id === categoryId
  );

  const filteredSubGroups = filteredSubcategories.length > 0 ? [
    {
      label: selectedCat?.name || "Subcategories",
      options: filteredSubcategories.map((sc) => ({ value: sc.name, label: sc.name })),
    },
  ] : [];

  return (
    <div className="flex-1 overflow-auto bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 font-sans">

        {/* Top Navigation & Action Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {duplicateId ? "Duplicate Product" : "Add New Product"}
                </h1>
                {duplicateId && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-950/60 border border-orange-500/30 text-orange-400">
                    Duplication Mode
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {duplicateId
                  ? "Creating an independent copy with zero stock in Draft mode."
                  : "Complete product lifecycle management: content, media, variants, pricing and inventory."}
              </p>
            </div>
          </div>
        </div>

        {/* Duplication Safety Notice Banner */}
        {duplicateId && duplicateSourceTitle && (
          <div className="mb-8 p-4 bg-orange-950/40 border border-orange-500/40 rounded-2xl flex items-start gap-3.5 text-orange-200">
            <Copy size={22} className="text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-white">Duplicating from: &ldquo;{duplicateSourceTitle}&rdquo;</span>
              <p className="text-xs text-orange-300/80 mt-1 leading-relaxed">
                All details and photos have been prefilled. For your inventory and financial safety, the duplicate is set to <strong>Draft</strong> status, inventory stock is set to <strong>0</strong>, and image references are decoupled so changes to this copy will never affect the original product.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-xl text-sm font-bold border border-red-900/50 mb-8 shadow-sm flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── LEFT COLUMN: CORE CONTENT & MEDIA (2 COLUMNS) ─── */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Basic Information */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <FileText size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-white">1. Basic Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-base shadow-sm"
                    placeholder="e.g. Handwoven Kosa Silk Saree with Temple Border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Subtitle / Tagline <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    placeholder="e.g. Pure Wild Forest Silk woven on Traditional Pit Looms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    placeholder="e.g. handwoven-kosa-silk-saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Short Description <span className="text-xs text-slate-500 font-normal">(Card preview &amp; top summary)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm shadow-sm resize-y"
                    placeholder="Brief 1-2 sentence overview for product cards and quick previews..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Full Description</label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm shadow-sm resize-y"
                    placeholder="Write a detailed storytelling description of the artisan craft, weave, motif symbolism, and drape..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Advanced Product Image Gallery */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImagePlus size={18} className="text-orange-500" />
                  <h2 className="text-lg font-bold text-white">2. Product Image Gallery</h2>
                </div>
                <span className="text-xs text-slate-400">
                  {existingImages.length + newImageFiles.length} images (Minimum 3 recommended)
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Drag, reorder, and set your primary cover image. The first image is highlighted as the primary thumbnail across the storefront.
              </p>

              {/* Existing Images Grid (Supports Reorder, Cover, Delete) */}
              {existingImages.length > 0 && (
                <div className="mb-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Product Gallery Images ({existingImages.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {existingImages.map((imgUrl, i) => (
                      <div
                        key={`existing-${i}`}
                        className={`relative aspect-square rounded-xl overflow-hidden border group bg-slate-950 transition-all ${
                          i === 0 ? "border-orange-500 ring-2 ring-orange-500/30" : "border-slate-800"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Product media ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                        {/* Cover Badge on Index 0 */}
                        {i === 0 ? (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
                            <Star size={10} fill="currentColor" /> Cover Image
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => makeExistingPrimary(i)}
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-orange-600 text-slate-300 hover:text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all z-10"
                          >
                            Set Cover
                          </button>
                        )}

                        {/* Image Actions Overlay */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={() => moveExistingImage(i, i - 1)}
                              className="p-1 hover:text-orange-400 text-slate-400 transition-colors"
                              title="Move left"
                            >
                              <ArrowLeft size={13} />
                            </button>
                          )}
                          {i < existingImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveExistingImage(i, i + 1)}
                              className="p-1 hover:text-orange-400 text-slate-400 transition-colors"
                              title="Move right"
                            >
                              <ArrowLeft size={13} className="rotate-180" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExistingImage(i)}
                            className="p-1 hover:text-red-400 text-slate-400 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Selected Local Previews */}
              {newImagePreviews.length > 0 && (
                <div className="mb-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                    New Uploads To Add ({newImagePreviews.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {newImagePreviews.map((url, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 group">
                        <Image src={url} alt={`New upload ${idx + 1}`} fill className="object-cover" sizes="180px" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-950/80 hover:bg-red-600 text-white rounded-lg transition-colors z-10"
                          title="Remove upload"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50 group">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleNewImageUpload}
                  className="hidden"
                  id="image-upload-input"
                />
                <label htmlFor="image-upload-input" className="cursor-pointer block">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-orange-400 group-hover:border-orange-500 mx-auto mb-3 transition-colors">
                    <ImagePlus size={22} />
                  </div>
                  <span className="text-sm font-bold text-white block mb-1">
                    Click to browse or drag and drop product photos
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Supports JPEG, PNG, WebP (Max 10MB per image).
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Product Video Management */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video size={18} className="text-orange-500" />
                  <h2 className="text-lg font-bold text-white">3. Product Video Management</h2>
                </div>
                {(videoPreviewUrl || videoUrl) && (
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Remove Video
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Upload a showcase video (MP4/WebM, max 50MB). Videos are played on the product detail page with responsive mobile controls and muted autoplay.
              </p>

              {/* Video Player Preview if Available */}
              {(videoPreviewUrl || videoUrl) ? (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                    <video
                      src={videoPreviewUrl || videoUrl}
                      controls
                      playsInline
                      muted
                      poster={videoPosterUrl || undefined}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="truncate">
                      Video Source: {videoFile ? `Local: ${videoFile.name}` : videoUrl}
                    </span>
                    <span className="text-emerald-400 font-semibold shrink-0">Ready for Storefront</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Local Video */}
                  <div className="border border-slate-700 hover:border-orange-500 rounded-xl p-5 text-center bg-slate-950 transition-colors">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="video-file-input"
                    />
                    <label htmlFor="video-file-input" className="cursor-pointer block">
                      <Video size={24} className="text-orange-400 mx-auto mb-2" />
                      <span className="text-sm font-bold text-white block">Upload Video File</span>
                      <span className="text-xs text-slate-500 block mt-1">MP4 or WebM (Max 50MB)</span>
                    </label>
                  </div>

                  {/* Or Direct Video URL */}
                  <div className="border border-slate-700 rounded-xl p-4 bg-slate-950 flex flex-col justify-center">
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">Direct Video URL</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. Specifications & Dimensions */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-orange-500" />
                  <h2 className="text-lg font-bold text-white">4. Specifications &amp; Craft Details</h2>
                </div>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors"
                >
                  <Plus size={14} /> Add Specification
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Material / Composition</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. 100% Wild Forest Kosa Silk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Dimensions &amp; Measurements</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Saree: 5.5m | Blouse Piece: 0.8m | Width: 46 inches"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Care Instructions</label>
                  <input
                    type="text"
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Dry Clean Only. Store in breathable muslin bag away from direct sunlight."
                  />
                </div>
              </div>

              {/* Dynamic Key-Value Specifications */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key-Value Product Attributes:
                </span>
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Attribute Name (e.g. Weave)"
                      value={spec.key}
                      onChange={(e) => updateSpecification(idx, "key", e.target.value)}
                      className="w-1/3 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. Handloom Extra Weft)"
                      value={spec.value}
                      onChange={(e) => updateSpecification(idx, "value", e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove attribute"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Special Product Notes (Dual Visibility) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-white">5. Special Product Notes</h2>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Manage notices with strict privacy segregation between storefront public notices and internal procurement/artisan notes.
              </p>

              <div className="space-y-6">
                {/* Public Customer Notice */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={15} className="text-emerald-400" />
                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Public Customer Notice (Displayed on Storefront)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={publicNotes}
                    onChange={(e) => setPublicNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Made-to-order by tribal artisan cooperative. Expected delivery: 7-10 business days. Slight motif variations are celebrated as authentic hallmarks of handloom craft."
                  />
                </div>

                {/* Internal Admin Note (Admin Only) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={15} className="text-amber-400" />
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Internal Admin Notes (Strictly Confidential • Excluded from Storefront)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Direct artisan weaver: Sukuram Dewangan, Bastar cluster. Minimum craft lead time for raw reorders: 3 weeks. Raw material cost: ₹2,400."
                  />
                </div>
              </div>
            </div>

            {/* 6. Variant Matrix (Colour & Size Combinations) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">6. Variant Inventory &amp; Colour Matrix</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure individual size, colour, stock, and photo associations.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors"
                  >
                    <Plus size={14} /> Add Color Variant
                  </button>
                </div>
              </div>

              {/* Preset Size Buttons */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Wall Plate Size Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["6\"", "8\"", "10\"", "12\""].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => addVariantPresetSize(size)}
                        className="px-3.5 py-1.5 bg-slate-950 border border-slate-700 hover:border-orange-500 hover:text-orange-400 text-xs font-bold text-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Apparel Size Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => addVariantPresetSize(size)}
                        className="px-3.5 py-1.5 bg-slate-950 border border-slate-700 hover:border-orange-500 hover:text-orange-400 text-xs font-bold text-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Variant Rows Table */}
              {variantItems.length > 0 && (
                <div className="space-y-3 pt-2">
                  {variantItems.map((variant, idx) => (
                    <div
                      key={variant.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl items-center"
                    >
                      {/* Size */}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Size</label>
                        <input
                          type="text"
                          value={variant.size || ""}
                          onChange={(e) => updateVariant(idx, { size: e.target.value })}
                          placeholder="Size (e.g. M)"
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Color & Hex */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Colour</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorHex || "#D95D1E"}
                            onChange={(e) => updateVariant(idx, { colorHex: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            title="Pick color"
                          />
                          <input
                            type="text"
                            value={variant.color || ""}
                            onChange={(e) => updateVariant(idx, { color: e.target.value })}
                            placeholder="Colour name"
                            className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Variant-Specific Image Assignment */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Variant Photo</label>
                        <select
                          value={variant.imageUrl || ""}
                          onChange={(e) => updateVariant(idx, { imageUrl: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="">Default Image</option>
                          {existingImages.map((img, i) => (
                            <option key={i} value={img}>Photo {i + 1} {i === 0 ? "(Cover)" : ""}</option>
                          ))}
                        </select>
                      </div>

                      {/* Price Override */}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price !== undefined ? variant.price : ""}
                          onChange={(e) => updateVariant(idx, { price: e.target.value ? parseFloat(e.target.value) : "" })}
                          placeholder={`₹${price || "Base"}`}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Stock */}
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Stock</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={variant.stock}
                          onChange={(e) => updateVariant(idx, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold px-2 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Delete */}
                      <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Remove variant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. SEO Settings */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold text-white">7. Search Engine Optimization (SEO)</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Handcrafted Wild Kosa Silk Saree | Authentic Bastar Handloom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-1.5">Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Discover authentic handloom sarees directly from Chhattisgarh tribal artisans. Sustainable wild kosa silk delivered across India."
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: PRICING, INVENTORY & PUBLISH ACTIONS (1 COLUMN) ─── */}
          <div className="space-y-8">

            {/* Publishing & Organization */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-white">Status &amp; Category</h2>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Publishing Status</label>
                <CustomSelect
                  value={status}
                  onChange={setStatus}
                  placeholder="Draft"
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "archived", label: "Archived" }
                  ]}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-300">Category</label>
                  <Link href="/admin/products/categories" className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline">
                    + New Category
                  </Link>
                </div>
                <CustomSelect
                  value={categoryId}
                  onChange={(val: string) => {
                    setCategoryId(val);
                    setSubcategory("");
                  }}
                  placeholder="Select a category"
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-300">Subcategory</label>
                  {filteredSubGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsCustomSubcategory(!isCustomSubcategory)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline"
                    >
                      {isCustomSubcategory ? "Select existing" : "+ Custom Subcategory"}
                    </button>
                  )}
                </div>
                {isCustomSubcategory || filteredSubGroups.length === 0 ? (
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Type a subcategory..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 text-sm"
                  />
                ) : (
                  <CustomSelect
                    value={subcategory}
                    onChange={setSubcategory}
                    placeholder="Select a subcategory"
                    groups={filteredSubGroups}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Product SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. KSA-SILK-001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="mt-1 w-5 h-5 bg-slate-950 border-2 border-slate-700 rounded-md checked:bg-orange-600 checked:border-orange-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white">Feature on Homepage</span>
                    <span className="text-xs text-slate-500 block mt-0.5">Showcase this item in curated homepage grids.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pricing & Automatic Discount Engine */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-white">Pricing &amp; Discounts</h2>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 4500.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-base font-bold focus:outline-none focus:border-orange-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Authoritative amount charged at checkout.
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-300">
                    Original / List Price (MSRP)
                  </label>
                  {hasDiscount && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      Save {calculatedDiscountPercent}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="e.g. 5000.00 (Optional for strikethrough)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Displayed with strikethrough when higher than selling price.
                </span>
              </div>

              {/* Total Stock */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-300">Total Available Stock</label>
                  {variantItems.length > 0 && (
                    <span className="text-[10px] font-bold bg-orange-950 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">
                      Sum of {variantItems.length} variants
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  required
                  value={variantItems.length > 0 ? totalVariantStock : parentStock}
                  readOnly={variantItems.length > 0}
                  onChange={(e) => setParentStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white text-base font-bold ${
                    variantItems.length > 0
                      ? "border-slate-800 text-slate-400 cursor-not-allowed bg-slate-950/60"
                      : "border-slate-700 focus:outline-none focus:border-orange-500"
                  }`}
                />
              </div>
            </div>

            {/* Submission Actions */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <span>{status === "draft" ? "Save Product Draft" : "Publish Product Now"}</span>
                )}
              </button>

              <Link
                href="/admin/products"
                className="w-full block text-center py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel and Return
              </Link>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      }
    >
      <AddProductForm />
    </Suspense>
  );
}
