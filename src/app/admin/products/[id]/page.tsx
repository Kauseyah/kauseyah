"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  ImagePlus,
  Plus,
  Trash2,
  X,
  Copy,
  Layers,
} from "lucide-react";
import { updateProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

interface VariantItem {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  price?: number | string;
  stock: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [status, setStatus] = useState("draft");

  // Variant & Inventory State
  const [variantItems, setVariantItems] = useState<VariantItem[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [singleStock, setSingleStock] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*"),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (subcatsRes.data) setSubcategories(subcatsRes.data);

      // Fetch product details
      if (id) {
        const { data: prod, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (prod) {
          setProduct(prod);
          setSelectedCategoryId(prod.category_id || "");
          setStatus(prod.status || "draft");
          setSingleStock(typeof prod.stock === "number" ? Math.max(0, prod.stock) : 0);

          if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
            const loadedVariants: VariantItem[] = prod.variants.map((v: any, idx: number) => ({
              id: v.id || `var-${idx}-${Date.now()}`,
              size: v.size || "",
              color: v.color || "",
              colorHex: v.colorHex || "#ffffff",
              price: typeof v.price === "number" ? v.price : "",
              stock: typeof v.stock === "number" ? Math.max(0, v.stock) : 0,
            }));
            setVariantItems(loadedVariants);
          }
        } else if (error) {
          setErrorMsg("Could not load product details.");
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // Variant Management Handlers
  const addSizeVariant = (sizeLabel: string) => {
    const trimmed = sizeLabel.trim();
    if (!trimmed) return;
    if (variantItems.some((v) => v.size?.toLowerCase() === trimmed.toLowerCase() && !v.color)) {
      toast.error(`Size "${trimmed}" is already present.`);
      return;
    }
    setVariantItems((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        size: trimmed,
        color: "",
        colorHex: "",
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
        color: "New Color",
        colorHex: "#D95D1E",
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

  const totalVariantStock = variantItems.reduce(
    (sum, v) => sum + (typeof v.stock === "number" ? v.stock : 0),
    0
  );

  const generateVariantsJson = () => {
    if (variantItems.length === 0) return "[]";
    return JSON.stringify(
      variantItems.map((v) => ({
        ...(v.size ? { size: v.size } : {}),
        ...(v.color ? { color: v.color, colorHex: v.colorHex } : {}),
        ...(typeof v.price === "number" && v.price > 0 ? { price: v.price } : {}),
        stock: Math.max(0, Number(v.stock) || 0),
      }))
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    formData.set("status", status);

    // Prevent negative stock and synchronize parent stock if variants exist
    if (variantItems.length > 0) {
      formData.set("stock", String(Math.max(0, totalVariantStock)));
    } else {
      formData.set("stock", String(Math.max(0, singleStock)));
    }
    formData.set("variants", generateVariantsJson());

    try {
      const result = await updateProduct(id, formData);

      if (result?.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else {
        toast.success("Product and inventory updated successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update: Network error occurred.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500">Product not found.</p>
          <Link href="/admin/products" className="text-orange-500 mt-4 inline-block hover:underline">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
              title="Back to Products"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Edit Product</h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage details, pricing, and variant inventory for {product.name}
              </p>
            </div>
          </div>

          {/* Duplicate Product Action */}
          <Link
            href={`/admin/products/new?duplicate_from=${id}`}
            className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
            title="Duplicate Product"
          >
            <Copy size={16} />
            <span>Duplicate Product</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-xl text-sm font-bold border border-red-900/50 mb-8 shadow-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hidden inputs */}
          <input type="hidden" name="variants" value={generateVariantsJson()} />
          {product.images?.map((img: string, idx: number) => (
            <input key={`exist_img_${idx}`} type="hidden" name="existing_images" value={img} />
          ))}

          {/* Left Column - Main Details & Variant Inventory */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">
                General Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={product.name}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. Custom Sabai Wall Plates"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    required
                    defaultValue={product.slug}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm font-mono text-sm"
                    placeholder="e.g. custom-sabai-wall-plates"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={5}
                    defaultValue={product.description || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="Write a detailed craft description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Material / Composition</label>
                  <textarea
                    name="material"
                    rows={2}
                    defaultValue={product.material || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. Natural Sabai Grass & Wild Palm Leaf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Care Instructions</label>
                  <textarea
                    name="care_instructions"
                    rows={2}
                    defaultValue={product.care_instructions || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. Wipe with dry soft cloth. Keep away from excess moisture."
                  />
                </div>
              </div>
            </div>

            {/* Base Pricing & Inventory Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">
                Base Pricing &amp; Stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Base Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    min="0"
                    defaultValue={product.price}
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
                    min="0"
                    defaultValue={product.discount_price || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="Optional compare price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {variantItems.length > 0 ? "Total Inventory (Sum of Variants)" : "Stock Quantity"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    required
                    readOnly={variantItems.length > 0}
                    value={variantItems.length > 0 ? totalVariantStock : singleStock}
                    onChange={(e) => setSingleStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm font-bold ${
                      variantItems.length > 0 ? "text-emerald-400 bg-slate-950/80 cursor-not-allowed" : ""
                    }`}
                  />
                  {variantItems.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      Auto-calculated from {variantItems.length} variant(s) below.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">SKU (Optional)</label>
                  <input
                    type="text"
                    name="sku"
                    defaultValue={product.sku || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. KSA-SWP-001"
                  />
                </div>
              </div>
            </div>

            {/* Variant-Level Inventory & Pricing Matrix */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Variant Inventory &amp; Dimensions</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage individual stock and prices for sizes (6&quot;, 8&quot;, 10&quot;, 12&quot;) or colors.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addColorVariant}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
                >
                  <Plus size={14} /> Add Color Variant
                </button>
              </div>

              {/* Quick Dimension & Size Presets */}
              <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Size / Dimension Presets:
                </p>

                {/* Sabai Wall Plates & Craft Dimensions */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] text-orange-400 font-semibold mr-1">Craft Plates:</span>
                  {['6"', '8"', '10"', '12"'].map((sz) => {
                    const isAdded = variantItems.some((v) => v.size === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => addSizeVariant(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                            : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-orange-500 hover:text-white"
                        }`}
                      >
                        {isAdded ? `✓ ${sz}` : `+ ${sz}`}
                      </button>
                    );
                  })}

                  <div className="h-4 w-[1px] bg-slate-800 mx-2 hidden sm:block" />

                  {/* Apparel Sizes */}
                  <span className="text-[11px] text-indigo-400 font-semibold mr-1">Apparel:</span>
                  {["S", "M", "L", "XL", "XXL"].map((sz) => {
                    const isAdded = variantItems.some((v) => v.size === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => addSizeVariant(sz)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                            : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-white"
                        }`}
                      >
                        {isAdded ? `✓ ${sz}` : `+ ${sz}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Adder */}
                <div className="flex gap-2 max-w-md pt-3 border-t border-slate-800/80">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder='Custom size, e.g. 14" or 16" × 9" × 6"'
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSizeVariant(customSizeInput);
                        setCustomSizeInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addSizeVariant(customSizeInput);
                      setCustomSizeInput("");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold tracking-wide transition-colors"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Variant Inventory Table */}
              {variantItems.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-sm">
                  <p>No variants defined for this product.</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Click a size preset above or add a color variant to enable individual inventory tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Variant / Dimension</th>
                          <th className="py-2.5 px-3">Variant Price (₹)</th>
                          <th className="py-2.5 px-3">Stock Quantity</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {variantItems.map((v, idx) => (
                          <tr key={v.id || idx} className="hover:bg-slate-950/40 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                {v.color !== undefined && v.color !== "" ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={v.colorHex || "#ffffff"}
                                      onChange={(e) =>
                                        updateVariant(idx, { colorHex: e.target.value })
                                      }
                                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent shrink-0"
                                      title="Select color"
                                    />
                                    <input
                                      type="text"
                                      value={v.color}
                                      onChange={(e) =>
                                        updateVariant(idx, { color: e.target.value })
                                      }
                                      placeholder="Color Name"
                                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-28 focus:outline-none focus:border-orange-500"
                                    />
                                  </div>
                                ) : null}

                                {v.size ? (
                                  <span className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs">
                                    {v.size}
                                  </span>
                                ) : null}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-500">₹</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={v.price}
                                  onChange={(e) => updateVariantPrice(idx, e.target.value)}
                                  placeholder="Parent Price"
                                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-24 focus:outline-none focus:border-orange-500 font-mono"
                                />
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <input
                                type="number"
                                min="0"
                                required
                                value={v.stock}
                                onChange={(e) =>
                                  updateVariantStock(
                                    idx,
                                    Math.max(0, parseInt(e.target.value, 10) || 0)
                                  )
                                }
                                className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white text-xs w-24 font-bold focus:outline-none focus:border-orange-500 font-mono"
                              />
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => removeVariant(idx)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Remove variant"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 font-medium">Total Variant Inventory:</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm">
                      {totalVariantStock} units
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Status, Category & Media */}
          <div className="space-y-8">
            {/* Status & Categorization */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">
                Status &amp; Category
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                  <select
                    name="category_id"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-300">Subcategory</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSubcategory(!isCustomSubcategory)}
                      className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors"
                    >
                      {isCustomSubcategory ? "Select existing" : "+ Custom Subcategory"}
                    </button>
                  </div>
                  {isCustomSubcategory ||
                  subcategories.filter((sc) => !selectedCategoryId || sc.category_id === selectedCategoryId)
                    .length === 0 ? (
                    <input
                      type="text"
                      name="subcategory"
                      defaultValue={product.subcategory || ""}
                      placeholder="Type a custom subcategory..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    />
                  ) : (
                    <select
                      id="subcategory_select"
                      name="subcategory"
                      defaultValue={product.subcategory || ""}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm"
                    >
                      <option value="">Select a subcategory</option>
                      {subcategories
                        .filter((sc) => !selectedCategoryId || sc.category_id === selectedCategoryId)
                        .map((sc: any) => (
                          <option key={sc.id} value={sc.name}>
                            {sc.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        name="featured"
                        value="true"
                        defaultChecked={product.featured}
                        className="peer w-6 h-6 bg-slate-950 border-2 border-slate-700 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      />
                      <svg
                        className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5L4.5 8.5L13 1"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-300 group-hover:text-white transition-colors">
                        Feature on Homepage
                      </span>
                      <span className="text-sm text-slate-500 mt-1">
                        Display this product prominently on the storefront.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">
                Product Media
              </h2>

              {product.images && product.images.length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Current Images:
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950 shadow-xs"
                      >
                        <img
                          src={img}
                          alt={`Product ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...product.images];
                            newImages.splice(idx, 1);
                            setProduct({ ...product, images: newImages });
                          }}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-md transition-colors"
                          title="Remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950 hover:bg-orange-500/10 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                <div className="p-3 bg-slate-900 rounded-full shadow-sm mb-3 group-hover:scale-105 transition-transform border border-slate-800">
                  <ImagePlus strokeWidth={2} className="text-orange-500 z-10" size={24} />
                </div>
                <p className="text-sm font-bold text-slate-300 mb-1">Add More Images</p>
                <p className="text-xs text-slate-500 mb-3">PNG, JPG up to 5MB (Select multiple)</p>
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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {fileNames.length} new file(s) selected:
                  </p>
                  {fileNames.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800"
                    >
                      <ImagePlus size={13} className="text-orange-500" /> {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="lg:col-span-3 flex justify-end gap-4 pt-4 mb-10">
            <Link
              href="/admin/products"
              className="px-6 py-3 text-base font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white text-base font-bold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? "Updating..." : "Update Product & Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
