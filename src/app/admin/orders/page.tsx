import { createClient } from "@supabase/supabase-js";
import { Search, Eye } from "lucide-react";
import Link from "next/link";

import Pagination from "@/components/admin/Pagination";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: orders, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-slate-400">
            View and manage customer orders.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search orders by ID or customer..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer shadow-sm">
            <option>All Statuses</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden pb-4">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="hidden md:table-cell px-6 py-4 font-bold">Order ID</th>
                <th className="hidden md:table-cell px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="hidden md:table-cell px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className="font-mono text-xs font-bold text-white bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-md group-hover:border-orange-500/50 group-hover:text-orange-400 transition-colors">
                        #{order.id.split('-')[0]}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-400 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{order.shipping_name}</div>
                      <div className="text-xs text-slate-500">{order.shipping_phone}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₹{order.total_amount}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border
                        ${order.payment_status === 'paid' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : ''}
                        ${order.payment_status === 'pending' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' : ''}
                        ${order.payment_status === 'failed' ? 'bg-red-900/30 text-red-400 border-red-900/50' : ''}
                        ${order.payment_status === 'refunded' ? 'bg-slate-800 text-slate-300 border-slate-700' : ''}
                      `}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border
                        ${order.order_status === 'processing' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : ''}
                        ${order.order_status === 'shipped' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : ''}
                        ${order.order_status === 'delivered' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : ''}
                        ${order.order_status === 'cancelled' ? 'bg-red-900/30 text-red-400 border-red-900/50' : ''}
                      `}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-orange-400 transition-colors bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500 font-medium">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
