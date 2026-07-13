import { createClient } from "@/utils/supabase/server";
import { createSubcategory } from "@/app/actions/subcategories";
import { Plus } from "lucide-react";
import DeleteSubcategoryButton from "./DeleteSubcategoryButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Subcategories() {
  const supabase = await createClient();
  
  const [categoriesRes, subcategoriesRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("subcategories").select("*, category:categories(name)").order("created_at", { ascending: false })
  ]);

  const categories = categoriesRes.data || [];
  const subcategories = subcategoriesRes.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl font-sans">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Subcategories</h1>
          <p className="mt-2 text-base text-slate-400">
            Create and manage product subcategories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Add Subcategory Form */}
        <div className="md:col-span-1">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-slate-800">Add New Subcategory</h2>
            {/* @ts-expect-error Server action return type mismatch */}
            <form action={createSubcategory} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Category *</label>
                <select 
                  name="category_id" 
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="e.g. Sarees"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug</label>
                <input 
                  type="text" 
                  name="slug" 
                  placeholder="Leave empty to auto-generate"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm text-white placeholder-slate-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-orange-500 transition-all active:scale-[0.98] shadow-sm mt-2"
              >
                <Plus size={18} />
                Create Subcategory
              </button>
            </form>
          </div>
        </div>

        {/* Subcategories List */}
        <div className="md:col-span-2">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Slug</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {subcategories && subcategories.length > 0 ? (
                    subcategories.map((subcategory: any) => (
                      <tr key={subcategory.id} className="hover:bg-slate-800/50 even:bg-slate-950/30 transition-colors group">
                        <td className="px-6 py-4 font-medium text-slate-100">{subcategory.name}</td>
                        <td className="px-6 py-4 text-slate-400">{subcategory.category?.name || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
                            {subcategory.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-3">
                          <DeleteSubcategoryButton subcategoryId={subcategory.id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No subcategories found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
