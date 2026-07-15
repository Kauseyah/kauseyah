"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus, ChevronDown, Plus, Trash2 } from "lucide-react";
import { createProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";



const CustomSelect = ({ value, onChange, placeholder, options, groups }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
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

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  // Form State
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [variants, setVariants] = useState<{color: string, colorHex: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("*"),
        supabase.from("subcategories").select("*")
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(event.currentTarget);
    formData.set("status", status); // Explicitly ensure status is captured

    const result = await createProduct(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      toast.success("Product published successfully!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    }
  }

  const selectedCat = categories.find(c => c.id === categoryId);
  const filteredSubcategories = subcategories.filter(sc => 
    !categoryId || sc.category_id === categoryId
  );
  
  // Format into a single group for CustomSelect or just options
  const filteredSubGroups = filteredSubcategories.length > 0 ? [
    {
      label: selectedCat?.name || "Subcategories",
      options: filteredSubcategories.map(sc => ({ value: sc.name, label: sc.name }))
    }
  ] : [];

  return (
    <div className="flex-1 overflow-auto bg-slate-950">
      <div className="max-w-5xl mx-auto p-6 lg:p-8 font-sans">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Add Product</h1>
            <p className="text-sm text-slate-400 mt-1">Create a new product listing for your store.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-900/30 text-red-400 p-4 rounded-xl text-sm font-bold border border-red-900/50 mb-8 shadow-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Hidden inputs to capture custom select values for FormData */}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="category_id" value={categoryId} />
          <input type="hidden" name="subcategory" value={subcategory} />
          <input type="hidden" name="variants" value={JSON.stringify(variants)} />

          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">General Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="name" required 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. Handwoven Silk Saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Slug <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="slug" required 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. handwoven-silk-saree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                  <textarea 
                    name="description" rows={5}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="Write a detailed description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Material / Composition</label>
                  <textarea 
                    name="material" rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. 100% Organic Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Care Instructions</label>
                  <textarea 
                    name="care_instructions" rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm resize-y"
                    placeholder="e.g. Dry clean only or delicate wash"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" step="0.01" name="price" required 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Discount Price (₹)</label>
                  <input 
                    type="number" step="0.01" name="discount_price" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Stock Quantity <span className="text-red-500">*</span></label>
                  <input 
                    type="number" name="stock" required defaultValue={0}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">SKU (Optional)</label>
                  <input 
                    type="text" name="sku" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base shadow-sm"
                    placeholder="e.g. KSA-001"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
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

          </div>

          {/* Right Column - Organization & Media */}
          <div className="space-y-8">
            
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
                      setSubcategory(""); // Reset subcategory when category changes
                    }}
                    placeholder="Select a category"
                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-slate-300">Subcategory</label>
                    {filteredSubGroups.length > 0 && (
                      <button type="button" onClick={() => setIsCustomSubcategory(!isCustomSubcategory)} className="text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors">
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
                      <input type="checkbox" name="featured" value="true" className="peer w-6 h-6 bg-slate-950 border-2 border-slate-700 rounded-md checked:bg-orange-600 checked:border-orange-600 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2" />
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

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Media</h2>
              
              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950 hover:bg-orange-500/10 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer relative group">
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
                      setFileNames(Array.from(e.target.files).map(f => f.name));
                    } else {
                      setFileNames([]);
                    }
                  }}
                />
              </div>
              
              {fileNames.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{fileNames.length} file(s) selected:</p>
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
              {isSubmitting ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
