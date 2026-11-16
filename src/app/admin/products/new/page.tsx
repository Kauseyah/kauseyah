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
  X
} from "lucide-react";
import { createProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

interface VariantItem {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price?: number | "";
  stock: number;
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
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [parentStock, setParentStock] = useState(0);
  const [sku, setSku] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

  // Variant State
  const [variantItems, setVariantItems] = useState<VariantItem[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  const addVariantPresetSize = (size: string) => {
    const exists = variantItems.some((v) => v.size === size);
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
        price: "",
        stock: 0,
      },
    ]);
  };

  const addColorVariant = () => {
    setVariantItems((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        size: "",
        color: "New Color",
        colorHex: "#D95D1E",
        price: "",
        stock: 0,
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

  const updateVariantStock = (idx: number, newStock: number) => {
    setVariantItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], stock: Math.max(0, newStock) };
      return updated;
    });
  };

  const updateVariantPrice = (idx: number, newPrice: string) => {
    setVariantItems((prev) => {
      const updated = [...prev];
      const num = parseFloat(newPrice);
      updated[idx] = { ...updated[idx], price: !isNaN(num) && num >= 0 ? num : "" };
      return updated;
    });
  };

  const removeVariant = (idx: number) => {
    setVariantItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalVariantStock = variantItems.reduce((sum, v) => sum + (v.stock || 0), 0);

  // Fetch Categories & Subcategories
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*"),
      ]);

      if (catsRes.error) {
        console.error("Error fetching categories:", catsRes.error);
      } else if (catsRes.data) {
        setCategories(catsRes.data);
      }

      if (subcatsRes.error) {
        console.error("Error fetching subcategories:", subcatsRes.error);
      } else if (subcatsRes.data) {
        setSubcategories(subcatsRes.data);
      }
    };
    fetchData();
  }, []);

  // Duplicate product prefilling
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
      setDescription(data.description || "");
      setMaterial(data.material || "");
      setCareInstructions(data.care_instructions || "");
      setPrice(data.price ? String(data.price) : "");
      setDiscountPrice(data.discount_price ? String(data.discount_price) : "");
      setSku(data.sku ? `${data.sku}-COPY` : "");
      setCategoryId(data.category_id || "");
      setSubcategory(data.subcategory || "");
      setFeatured(false);

      // CRITICAL DUPLICATE CONSTRAINTS:
      // Status strictly set to 'draft', stock set to 0
      setStatus("draft");
      setParentStock(0);

      // Clone existing images independently
      if (data.images && Array.isArray(data.images)) {
        setExistingImages([...data.images]);
      }

      // Clone variants with stock reset to 0
      if (data.variants && Array.isArray(data.variants)) {
        setVariantItems(
          data.variants.map((v: any, i: number) => ({
            id: `dup-${Date.now()}-${i}`,
            size: v.size || "",
            color: v.color || "",
            colorHex: v.colorHex || "",
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

    const formData = new FormData(event.currentTarget);
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("material", material);
    formData.set("care_instructions", careInstructions);
    formData.set("price", price);
    if (discountPrice) formData.set("discount_price", discountPrice);
    formData.set("sku", sku);
    formData.set("status", status);
    formData.set("category_id", categoryId);
    formData.set("subcategory", subcategory);
    if (featured) formData.set("featured", "true");

    // Stock handling
    const finalStock = variantItems.length > 0 ? totalVariantStock : Math.max(0, parentStock);
    formData.set("stock", String(finalStock));

    // Variants JSON payload
    if (variantItems.length > 0) {
      const cleanVariants = variantItems.map((v) => ({
        ...(v.size ? { size: v.size } : {}),
        ...(v.color ? { color: v.color, colorHex: v.colorHex } : {}),
        ...(typeof v.price === "number" && v.price >= 0 ? { price: v.price } : {}),
        stock: Math.max(0, Number(v.stock) || 0),
      }));
      formData.set("variants", JSON.stringify(cleanVariants));
    } else {
      formData.set("variants", "[]");
    }

    // Preserve existing images from duplication
    if (existingImages.length > 0) {
      existingImages.forEach((img) => formData.append("existing_images", img));
    }

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
      setErrorMsg("Failed to upload: Files might be too large, or network error occurred.");
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
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="max-w-5xl mx-auto p-6 lg:p-8 font-sans">

        {/* Top Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {duplicateId ? "Duplicate Product" : "Add Product"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {duplicateId
                ? `Creating a copy with zero stock in Draft mode.`
                : "Create a new product listing for your store."}
            </p>
          </div>
        </div>

        {/* Duplication Notice Banner */}
        {duplicateId && duplicateSourceTitle && (
          <div className="mb-8 p-4 bg-orange-950/40 border border-orange-500/40 rounded-2xl flex items-start gap-3 text-orange-200">
            <Copy size={20} className="text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-white">Duplicating: &ldquo;{duplicateSourceTitle}&rdquo;</span>
              <p className="text-xs text-orange-300/80 mt-1">
                Product details and photos have been prefilled. For your safety, the duplicate has been set to <strong>Draft</strong> status and inventory stock has been reset to <strong>0</strong>.
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

          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* General Info */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">General Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. Handwoven Silk Saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Slug <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. handwoven-silk-saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="Write a detailed description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Material / Composition</label>
                  <textarea
                    name="material"
                    rows={2}
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. 100% Organic Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Care Instructions</label>
                  <textarea
                    name="care_instructions"
                    rows={2}
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. Dry clean only or delicate wash"
                  />
                </div>
              </div>
            </div>

            {/* Base Pricing & Inventory */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Pricing & Inventory</h2>
                  <p className="text-xs text-slate-400 mt-1">Set base price and stock quantities. If variant rows are added below, overall stock is automatically calculated from variant inventory.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Base Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_price"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-300">
                      Total Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    {variantItems.length > 0 && (
                      <span className="text-[11px] bg-orange-950/60 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-500/30">
                        Sum of {variantItems.length} variants
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    name="stock"
                    required
                    min={0}
                    value={variantItems.length > 0 ? totalVariantStock : parentStock}
                    readOnly={variantItems.length > 0}
                    onChange={(e) => setParentStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-white transition-all text-base shadow-sm ${
                      variantItems.length > 0
                        ? "border-slate-800 text-slate-400 cursor-not-allowed bg-slate-950/60"
                        : "border-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">SKU (Optional)</label>
                  <input
                    type="text"
                    name="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. KSA-001"
                  />
                </div>
              </div>
            </div>

            {/* Variant Inventory & Pricing Matrix */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Variant Inventory & Pricing Matrix</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage individual stock quantities and custom prices for each size/color variant.
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

              {/* Preset Size Adders */}
              <div className="space-y-3">
                {/* Sabai Wall Plates Presets */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Wall Plate Size Presets (Sabai Grass):
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

                {/* Apparel Size Presets */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Apparel Size Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
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

                {/* Custom Size Adder */}
                <div className="flex items-center gap-2 max-w-sm pt-1">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder='Custom size (e.g. 14", 16x9x6)...'
                    className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customSizeInput.trim()) return;
                      addVariantPresetSize(customSizeInput.trim());
                      setCustomSizeInput("");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    Add Size
                  </button>
                </div>
              </div>

              {/* Variant Rows Table */}
              {variantItems.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                  <p className="text-sm text-slate-500">
                    No individual variants added yet. Total stock will follow the general inventory field above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
                    <span className="sm:col-span-3">Variant / Size</span>
                    <span className="sm:col-span-3">Color (Hex)</span>
                    <span className="sm:col-span-3">Custom Price (₹)</span>
                    <span className="sm:col-span-2">Stock</span>
                    <span className="sm:col-span-1 text-center">Action</span>
                  </div>

                  {variantItems.map((variant, idx) => (
                    <div
                      key={variant.id || idx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-3">
                        <label className="sm:hidden block text-xs font-bold text-slate-400 mb-1">Variant Size</label>
                        <input
                          type="text"
                          value={variant.size || ""}
                          onChange={(e) => updateVariant(idx, { size: e.target.value })}
                          placeholder='e.g. 6"'
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="sm:hidden block text-xs font-bold text-slate-400 mb-1">Color & Hex</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.colorHex || "#000000"}
                            onChange={(e) => updateVariant(idx, { colorHex: e.target.value })}
                            className="w-7 h-7 cursor-pointer border-0 p-0 rounded bg-transparent"
                            title="Pick color"
                          />
                          <input
                            type="text"
                            value={variant.color || ""}
                            onChange={(e) => updateVariant(idx, { color: e.target.value })}
                            placeholder="Optional color"
                            className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="sm:hidden block text-xs font-bold text-slate-400 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price !== undefined ? variant.price : ""}
                          onChange={(e) => updateVariantPrice(idx, e.target.value)}
                          placeholder={`Default (₹${price || "0"})`}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="sm:hidden block text-xs font-bold text-slate-400 mb-1">Stock</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={variant.stock}
                          onChange={(e) => updateVariantStock(idx, parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Remove variant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Organization & Media */}
          <div className="space-y-8">

            {/* Organization */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Organization</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
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
                    <Link href="/admin/products/categories" className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors">
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
                        className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors"
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
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

                <div className="pt-6 border-t border-slate-800">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="peer w-6 h-6 bg-slate-950 border-2 border-slate-700 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      />
                      <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-300 group-hover:text-white transition-colors">Feature on Homepage</span>
                      <span className="text-sm text-slate-500 mt-1">Display this product prominently on the storefront.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Media</h2>

              {/* Existing Images from Duplicated Product */}
              {existingImages.length > 0 && (
                <div className="mb-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Copied Product Images ({existingImages.length}):
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {existingImages.map((imgUrl, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 group bg-slate-950">
                        <Image
                          src={imgUrl}
                          alt={`Product media ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                        <button
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full transition-colors"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Product Images */}
              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950 hover:bg-orange-500/10 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                <div className="p-4 bg-slate-900 rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform border border-slate-800">
                  <ImagePlus strokeWidth={2} className="text-orange-500" size={28} />
                </div>

                <p className="text-base font-bold text-slate-300 mb-1">Upload Product Images</p>
                <p className="text-sm text-slate-500 mb-4">PNG, JPG up to 5MB (Select multiple)</p>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileNames(Array.from(e.target.files).map((f) => f.name));
                    } else {
                      setFileNames([]);
                    }
                  }}
                />
              </div>

              {fileNames.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{fileNames.length} new file(s) selected:</p>
                  {fileNames.map((fileName, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                      <ImagePlus size={14} className="text-orange-500" /> {fileName}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Action Buttons */}
          <div className="lg:col-span-3 flex justify-end gap-4 pt-4 mb-10">
            <Link href="/admin/products" className="px-6 py-3 text-base font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loadingDuplicate}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white text-base font-bold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting
                ? (status === "draft" ? "Saving Draft..." : "Publishing...")
                : (status === "draft" ? "Save as Draft" : "Publish Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    }>
      <AddProductForm />
    </Suspense>
  );
}
