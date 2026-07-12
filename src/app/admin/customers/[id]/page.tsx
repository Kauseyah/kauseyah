import { createClient as createAdminClient } from "@supabase/supabase-js";
import { ArrowLeft, Mail, Phone, Calendar, UserCheck, UserX, ShoppingBag, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlockAccountButton from "./BlockAccountButton"; // We will create this

export default async function CustomerDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch customer details
  const { data: customer, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !customer) {
    notFound();
  }

  // Fetch customer orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  // Dynamically calculate real total spent from orders
  const validOrders = orders ? orders.filter(o => o.order_status !== 'cancelled') : [];
  const realTotalSpent = validOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
  
  // Use the larger of the two just in case the profile has legacy data
  const displayTotalSpent = Math.max(Number(customer.total_spent || 0), realTotalSpent);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Profile Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/customers" className="p-2 hover:bg-slate-800 rounded-full transition-colors border border-transparent">
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Avatar Profile */}
              <div className="h-14 w-14 rounded-full bg-slate-950 flex items-center justify-center text-slate-300 text-lg font-bold border border-slate-700 shrink-0 shadow-sm">
                {customer.full_name ? customer.full_name.substring(0, 2).toUpperCase() : 'CU'}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight font-display">
                  {customer.full_name || 'Unnamed Customer'}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  ID: {customer.id}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {customer.is_active !== false ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 shadow-sm">
                <UserCheck size={14} /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-red-900/30 text-red-400 border border-red-900/50 shadow-sm">
                <UserX size={14} /> Inactive
              </span>
            )}
            
            <BlockAccountButton customerId={customer.id} isActive={customer.is_active} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 font-display">
              Contact Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">{customer.email}</span>
                </div>
              </div>
              
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">{customer.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">Member Since</p>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">{new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-5 font-display">
              Store Stats
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  ₹{displayTotalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">Total Orders</p>
                <p className="text-lg font-bold text-white">{orders ? orders.length : 0} <span className="text-sm text-slate-500 font-medium">orders</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-800 bg-slate-950/50">
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShoppingBag size={16} />
                </span>
                Purchase History
              </h2>
              <p className="text-sm text-slate-400 mt-2 ml-11">A complete log of all transactions made by this user.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-950 text-slate-500 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Total</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-500 font-mono text-xs">
                              #
                            </div>
                            <span className="font-bold text-white font-mono group-hover:text-orange-400 transition-colors">
                              {order.id.split('-')[0]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-400 font-medium">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5 font-bold text-white">
                          ₹{order.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border
                            ${order.order_status === 'processing' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : ''}
                            ${order.order_status === 'shipped' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : ''}
                            ${order.order_status === 'delivered' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : ''}
                            ${order.order_status === 'cancelled' ? 'bg-red-900/30 text-red-400 border-red-900/50' : ''}
                            ${order.order_status === 'pending' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' : ''}
                          `}>
                            {order.order_status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800 hover:text-orange-400 text-slate-400 text-xs font-bold rounded-lg shadow-sm transition-all">
                            View Order
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center bg-slate-950/30">
                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                          <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm">
                            <ShoppingBag size={24} className="text-slate-600" />
                          </div>
                          <p className="font-bold text-white">No purchase history found</p>
                          <p className="text-sm">This customer hasn't placed any orders yet.</p>
                        </div>
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