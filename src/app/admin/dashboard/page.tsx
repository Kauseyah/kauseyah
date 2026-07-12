import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import Link from "next/link";
import { TrendingUp, ArrowRight, ShoppingBag, UserPlus, Clock, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Use service role to bypass RLS for admin metrics
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch metrics and recent data
  const [
    { count: productsCount }, 
    { count: ordersCount }, 
    { count: usersCount }, 
    { data: paidOrders },
    { data: recentOrders },
    { data: recentCustomers }
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
    supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid'),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('profiles').select('*').neq('role', 'admin').order('created_at', { ascending: false }).limit(4)
  ]);

  const totalRevenue = paidOrders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-900/30 rounded-lg text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base font-medium flex items-center pt-2">
            Welcome back to your workspace, 
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 shadow-sm">
              {user?.email}
            </span>
          </p>
        </div>
        
        <div className="inline-flex w-fit items-center gap-2.5 px-4 py-2.5 bg-gradient-to-b from-slate-900 to-slate-950/50 rounded-xl border border-slate-800 shadow-sm ring-1 ring-white/5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 shadow-sm text-slate-400">
            <Calendar size={14} className="text-orange-500" />
          </div>
          <span className="text-sm font-semibold text-slate-300 tracking-wide">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Revenue Card */}
        <Link href="/admin/orders" className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] group relative overflow-hidden">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-sans">Total Revenue</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </Link>

        {/* Products Card */}
        <Link href="/admin/products" className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] group relative overflow-hidden">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-sans">Products</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{productsCount || 0}</p>
            </div>
          </div>
        </Link>
        
        {/* Orders Card */}
        <Link href="/admin/orders" className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] group relative overflow-hidden">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-sans">Orders</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{ordersCount || 0}</p>
            </div>
          </div>
        </Link>
        
        {/* Customers Card */}
        <Link href="/admin/customers" className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] group relative overflow-hidden">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-sans">Customers</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">{usersCount || 0}</p>
            </div>
          </div>
        </Link>
        
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag size={20} className="text-orange-500" />
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-orange-500 font-medium hover:text-orange-400 flex items-center gap-1">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {recentOrders && recentOrders.length > 0 ? (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-white">#{order.id.split('-')[0]}</td>
                      <td className="px-6 py-4 text-slate-400 flex items-center gap-2">
                        <Clock size={14} className="text-slate-500" />
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">₹{order.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                          ${order.order_status === 'processing' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : ''}
                          ${order.order_status === 'shipped' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : ''}
                          ${order.order_status === 'delivered' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : ''}
                          ${order.order_status === 'cancelled' ? 'bg-red-900/30 text-red-400 border-red-900/50' : ''}
                          ${!['processing', 'shipped', 'delivered', 'cancelled'].includes(order.order_status) ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : ''}
                        `}>
                          {order.order_status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400">
                No orders have been placed yet.
              </div>
            )}
          </div>
        </div>

        {/* New Customers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus size={20} className="text-orange-500" />
              Newest Customers
            </h2>
          </div>
          
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 space-y-5">
            {recentCustomers && recentCustomers.length > 0 ? (
              recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                      {customer.full_name ? customer.full_name.substring(0, 2).toUpperCase() : 'CU'}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm group-hover:text-orange-400 transition-colors">{customer.full_name || 'Unnamed'}</p>
                      <p className="text-xs text-slate-400 truncate w-32 sm:w-40">{customer.email}</p>
                    </div>
                  </div>
                  <Link href={`/admin/customers/${customer.id}`} className="text-xs font-medium text-slate-400 bg-slate-950 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-md transition-colors border border-slate-800 hover:border-orange-500/50">
                    View
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">
                No new customers found.
              </div>
            )}
            
            <Link href="/admin/customers" className="block w-full text-center py-2.5 mt-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800 hover:border-orange-500/50 border-dashed">
              See all customers
            </Link>
          </div>
        </div>
        
      </div>

    </div>
  );
}
