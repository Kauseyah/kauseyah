"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ImagePlus } from "lucide-react";
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
  const [fileName, setFileName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch categories
      const { data: cats } = await supabase.from("categories").select("*");
      if (cats) setCategories(cats);
      
      // Fetch product details
      if (id) {
        const { data: prod, error } = await supabase.from("products").select("*").eq("id", id).single();
        if (prod) {
          setProduct(prod);
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

          </div>

          {/* Right Column - Organization & Media */}
          <div className="space-y-8">
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md duration-300">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">Status & Organization</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Status</label>
                  <select name="status" defaultValue={product.status || "draft"} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                  <select 
                    name="category_id" 
                    defaultValue={product.category_id || ""}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm"
                    onChange={(e) => {
                      const selectedCat = categories.find(c => c.id === e.target.value);
                      if (selectedCat) {
                        const subSelect = document.getElementById("subcategory_select") as HTMLSelectElement;
                        if (subSelect) {
                          subSelect.value = "";
                          Array.from(subSelect.options).forEach((opt) => {
                            if (opt.value === "") return;
                            const group = opt.parentElement as HTMLOptGroupElement;
                            if (group) {
                              group.style.display = group.label.toLowerCase().includes(selectedCat.name.toLowerCase().split(' ')[0]) || 
                                                    selectedCat.name.toLowerCase().includes(group.label.toLowerCase().split(' ')[0]) 
                                                    ? "block" : "none";
                            }
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Subcategory</label>
                  <select id="subcategory_select" name="subcategory" defaultValue={product.subcategory || ""} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-base cursor-pointer shadow-sm">
                    <option value="">Select a subcategory</option>
                    <optgroup label="Handlooms">
                      <option value="sarees">Sarees</option>
                      <option value="kurtis">Easy Cotton Kurtis</option>
                      <option value="dupattas">Dupattas</option>
                      <option value="stoles">Stoles</option>
                      <option value="fabric-yardages">Fabric Yardages</option>
                      <option value="kosa-jackets">Men Kosa Jackets</option>
                    </optgroup>
                    <optgroup label="Jewellery">
                      <option value="earrings">Handcrafted Earrings</option>
                    </optgroup>
                    <optgroup label="Home">
                      <option value="baskets">Baskets</option>
                      <option value="wall-plates">Wall Plates</option>
                      <option value="diyas">Cow Dung Diyas</option>
                      <option value="fridge-magnets">Hand Painted Fridge Magnets</option>
                      <option value="incense-holders">Hand Painted Incense Stick Holders</option>
                      <option value="toran">Eco Seed Paper Toran</option>
                    </optgroup>
                    <optgroup label="Conscious">
                      <option value="gift-hampers">Gift Hampers</option>
                      <option value="rakhi">Rakhi Collection</option>
                      <option value="sunglass-pouch">Sunglass Pouch</option>
                      <option value="brass-plates">Brass Plates</option>
                    </optgroup>
                    <optgroup label="Tribal">
                      <option value="gond-art">Gond Art</option>
                      <option value="dhokra-craft">Dhokra Craft</option>
                    </optgroup>
                    <optgroup label="Upcycled">
                      <option value="textile-toys">Textile Toys</option>
                      <option value="faabr">Faabr</option>
                    </optgroup>
                  </select>
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
              
              <div className="border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-950 hover:bg-orange-500/10 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                <div className="p-4 bg-slate-900 rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform border border-slate-800 overflow-hidden relative w-16 h-16 flex items-center justify-center">
                  {product.images && product.images[0] && !fileName ? (
                     <img src={product.images[0]} alt="Current product image" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                     <ImagePlus strokeWidth={2} className="text-orange-500 z-10" size={28} />
                  )}
                </div>
                {fileName ? (
                  <p className="text-base font-bold text-white mb-1">{fileName}</p>
                ) : (
                  <p className="text-base font-bold text-slate-300 mb-1">{product.images && product.images[0] ? "Click to replace image" : "Click to upload an image"}</p>
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
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}