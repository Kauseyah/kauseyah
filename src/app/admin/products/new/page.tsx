"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus, ChevronDown } from "lucide-react";
import { createProduct } from "@/app/actions/product-actions";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

const SUBCATEGORY_GROUPS = [
  {
    label: "Handlooms",
    options: [
      { value: "sarees", label: "Sarees" },
      { value: "kurtis", label: "Easy Cotton Kurtis" },
      { value: "dupattas", label: "Dupattas" },
      { value: "stoles", label: "Stoles" },
      { value: "fabric-yardages", label: "Fabric Yardages" },
      { value: "kosa-jackets", label: "Men Kosa Jackets" },
    ]
  },
  {
    label: "Jewellery",
    options: [
      { value: "earrings", label: "Handcrafted Earrings" }
    ]
  },
  {
    label: "Home",
    options: [
      { value: "baskets", label: "Baskets" },
      { value: "wall-plates", label: "Wall Plates" },
      { value: "diyas", label: "Cow Dung Diyas" },
      { value: "fridge-magnets", label: "Hand Painted Fridge Magnets" },
      { value: "incense-holders", label: "Hand Painted Incense Stick Holders" },
      { value: "toran", label: "Eco Seed Paper Toran" }
    ]
  },
  {
    label: "Conscious",
    options: [
      { value: "gift-hampers", label: "Gift Hampers" },
      { value: "rakhi", label: "Rakhi Collection" },
      { value: "sunglass-pouch", label: "Sunglass Pouch" },
      { value: "brass-plates", label: "Brass Plates" }
    ]
  },
  {
    label: "Tribal",
    options: [
      { value: "gond-art", label: "Gond Art" },
      { value: "dhokra-craft", label: "Dhokra Craft" }
    ]
  },
  {
    label: "Upcycled",
    options: [
      { value: "textile-toys", label: "Textile Toys" },
      { value: "faabr", label: "Faabr" }
    ]
  }
];

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
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto top-full left-0 origin-top animate-in fade-in zoom-in-95 duration-100">
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
        </div>
      )}
    </div>
  );
};

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  // Form State
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(event.currentTarget);
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
  const filteredSubGroups = SUBCATEGORY_GROUPS.filter(group => {
    if (!selectedCat) return true;
    return group.label.toLowerCase().includes(selectedCat.name.toLowerCase().split(' ')[0]) || 
           selectedCat.name.toLowerCase().includes(group.label.toLowerCase().split(' ')[0]);
  });

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
                  <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
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
                  <label className="block text-sm font-bold text-slate-300 mb-2">Subcategory</label>
                  <CustomSelect 
                    value={subcategory}
                    onChange={setSubcategory}
                    placeholder="Select a subcategory"
                    groups={filteredSubGroups}
                  />
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
                {fileName ? (
                  <p className="text-base font-bold text-white mb-1">{fileName}</p>
                ) : (
                  <p className="text-base font-bold text-slate-300 mb-1">Upload Product Image</p>
                )}
                <p className="text-sm text-slate-500 mb-4">PNG, JPG up to 5MB</p>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileName(e.target.files[0].name);
                    } else {
                      setFileName("");
                    }
                  }}
                />
              </div>
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
