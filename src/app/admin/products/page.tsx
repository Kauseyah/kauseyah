import { createClient } from "@/utils/supabase/server";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProducts() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your store's products and inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/categories"
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-colors shadow-sm"
          >
            Categories
          </Link>
          <Link 
            href="/admin/products/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer shadow-sm">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wide">Product</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Category</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Price</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Stock</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 bg-slate-900">
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product.id} className={`${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950/30'} hover:bg-slate-800/50 transition-colors duration-200 group`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images && product.images[0] ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 shadow-sm shrink-0 bg-slate-950">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                            <Plus size={18} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{product.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.category?.name ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 shadow-sm">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {product.discount_price ? (
                          <>
                            <span className="font-bold text-white">₹{product.discount_price}</span>
                            <span className="text-xs text-slate-500 line-through mt-0.5">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="font-bold text-white">₹{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock <= 5 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        <span className={`font-bold ${product.stock <= 5 ? 'text-rose-400' : 'text-slate-300'}`}>
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm
                        ${product.status === 'published' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : ''}
                        ${product.status === 'draft' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' : ''}
                        ${product.status === 'archived' ? 'bg-rose-900/30 text-rose-400 border-rose-900/50' : ''}
                      `}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2 transition-opacity">
                      <Link href={`/admin/products/${product.id}`} className="text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors p-2 rounded-lg" title="Edit">
                        <Edit size={16} />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 bg-slate-950/30">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 shadow-sm">
                        <Search size={20} />
                      </div>
                      <p className="font-bold text-white mb-1">No products found</p>
                      <p className="text-sm">Add a new product to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
