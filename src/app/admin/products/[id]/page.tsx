"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { updateProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

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
  const [variants, setVariants] = useState<{color: string, colorHex: string}[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const generateVariantsJson = () => {
    let finalVariants: any[] = [];
    if (variants.length === 0 && selectedSizes.length === 0) return "[]";
    
    const colorsToMap = variants.length > 0 ? variants : [{color: "", colorHex: ""}];
    const sizesToMap = selectedSizes.length > 0 ? selectedSizes : [""];
    
    for (const c of colorsToMap) {
      for (const s of sizesToMap) {
        const v: any = {};
        if (c.color) { v.color = c.color; v.colorHex = c.colorHex; }
        if (s) v.size = s;
        if (Object.keys(v).length > 0) finalVariants.push(v);
      }
    }
    return JSON.stringify(finalVariants);
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*")
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (subcatsRes.data) setSubcategories(subcatsRes.data);
      
      // Fetch product details
      if (id) {
        const { data: prod, error } = await supabase.from("products").select("*").eq("id", id).single();
        if (prod) {
          setProduct(prod);
          setSelectedCategoryId(prod.category_id || "");
          setStatus(prod.status || "draft");
          if (prod.variants) {
            const uniqueColorsMap = new Map();
            const uniqueSizesSet = new Set<string>();
            prod.variants.forEach((v: any) => {
              if (v.color) uniqueColorsMap.set(v.color, { color: v.color, colorHex: v.colorHex || "#ffffff" });
              if (v.size) uniqueSizesSet.add(v.size);
            });
            setVariants(Array.from(uniqueColorsMap.values()));
            setSelectedSizes(Array.from(uniqueSizesSet));
          }
        } else if (error) {
          setErrorMsg("Could not load product details.");
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(event.currentTarget);
    formData.set("status", status); // Explicitly ensure status is captured
    
    try {
      const result = await updateProduct(id, formData);
      
      if (result?.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
      } else {
        toast.success("Product updated successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to update: Files might be too large, or network error occurred.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 overflow-auto bg-slate-950 p-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-500">Product not found.</p>
          <Link href="/admin/products" className="text-orange-500 mt-4 inline-block hover:underline">Return to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Product</h1>
            <p className="text-sm text-slate-400 mt-1">Update information for {product.name}</p>
          </div>
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

          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">General Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="name" required defaultValue={product.name}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. Handwoven Silk Saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="slug" required defaultValue={product.slug}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. handwoven-silk-saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                  <textarea 
                    name="description" rows={5} defaultValue={product.description || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="Write a detailed description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Material / Composition</label>
                  <textarea 
                    name="material" rows={2} defaultValue={product.material || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. 100% Organic Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Care Instructions</label>
                  <textarea 
                    name="care_instructions" rows={2} defaultValue={product.care_instructions || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. Dry clean only or delicate wash"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" step="0.01" name="price" required defaultValue={product.price}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Discount Price (₹)</label>
                  <input 
                    type="number" step="0.01" name="discount_price" defaultValue={product.discount_price || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Stock Quantity <span className="text-red-500">*</span></label>
                  <input 
                    type="number" name="stock" required defaultValue={product.stock}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">SKU (Optional)</label>
                  <input 
                    type="text" name="sku" defaultValue={product.sku || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. KSA-001"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Color Variants</h2>
                <button 
                  type="button" 
                  onClick={() => setVariants([...variants, { color: "", colorHex: "#ffffff" }])}
                  className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors"
                >
                  <Plus size={16} /> Add Color
                </button>
              </div>
              
              {variants.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No color variants added. Will use default variant.</p>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Color Name</label>
                        <input 
                          type="text" 
                          value={variant.color}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[idx].color = e.target.value;
                            setVariants(newVariants);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="e.g. Crimson Red"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Hex Code</label>
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                          <input 
                            type="color" 
                            value={variant.colorHex}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[idx].colorHex = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-8 h-8 cursor-pointer border-0 p-0 shrink-0 bg-transparent"
                            title="Choose color"
                          />
                          <input
                            type="text"
                            value={variant.colorHex}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[idx].colorHex = e.target.value;
                              setVariants(newVariants);
                            }}
                            className="w-full bg-transparent text-white text-xs focus:outline-none p-2"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newVariants = [...variants];
                          newVariants.splice(idx, 1);
                          setVariants(newVariants);
                        }}
                        className="mt-5 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300 mt-8">
              <div className="mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Size Variations</h2>
                <p className="text-sm text-slate-500 mt-1">Select available sizes for this product.</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {["S", "M", "L", "XL", "XXL"].map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSizes(selectedSizes.filter(s => s !== size));
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-orange-500 text-white border-2 border-orange-500 shadow-md shadow-orange-500/20" 
                          : "bg-slate-950 text-slate-400 border border-slate-700 hover:border-orange-500 hover:text-orange-500"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Organization & Media */}
          <div className="space-y-8">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">Status & Organization</h2>
              
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-300">Category</label>
                    <Link href="/admin/products/categories" className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors">
                      + New Category
                    </Link>
                  </div>
                  <select 
                    name="category_id" 
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-300">Subcategory</label>
                    <button type="button" onClick={() => setIsCustomSubcategory(!isCustomSubcategory)} className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors">
                      {isCustomSubcategory ? "Select existing" : "+ Custom Subcategory"}
                    </button>
                  </div>
                  {isCustomSubcategory || (subcategories.filter(sc => !selectedCategoryId || sc.category_id === selectedCategoryId).length === 0) ? (
                    <input 
                      type="text" 
                      name="subcategory"
                      defaultValue={product.subcategory || ""}
                      placeholder="Type a custom subcategory..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    />
                  ) : (
                    <select id="subcategory_select" name="subcategory" defaultValue={product.subcategory || ""} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm">
                      <option value="">Select a subcategory</option>
                      {subcategories.filter(sc => !selectedCategoryId || sc.category_id === selectedCategoryId).map((sc: any) => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input type="checkbox" name="featured" value="true" defaultChecked={product.featured} className="peer w-6 h-6 bg-slate-950 border-2 border-slate-700 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" />
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

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">Media</h2>
              
              {product.images && product.images.length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Images:</p>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = [...product.images];
                            newImages.splice(idx, 1);
                            setProduct({ ...product, images: newImages });
                          }}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950 hover:bg-orange-500/10 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                <div className="p-4 bg-slate-900 rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform border border-slate-800">
                  <ImagePlus strokeWidth={2} className="text-orange-500 z-10" size={28} />
                </div>
                <p className="text-base font-bold text-slate-300 mb-1">Add More Images</p>
                <p className="text-sm text-slate-500 mb-4">PNG, JPG up to 5MB (Select multiple)</p>
                <input 
                  type="file" 
                  name="images" 
                  multiple
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileNames(Array.from(e.target.files).map(f => f.name));
                    } else {
                      setFileNames([]);
                    }
                  }}
                />
              </div>

              {fileNames.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{fileNames.length} new file(s) selected:</p>
                  {fileNames.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                      <ImagePlus size={14} className="text-orange-500" /> {name}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-3 flex justify-end gap-4 pt-4 mb-10">
            <Link href="/admin/products" className="px-6 py-3 text-base font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white text-base font-bold rounded-xl hover:bg-orange-500 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}