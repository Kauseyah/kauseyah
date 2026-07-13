"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, CreditCard, ArrowRightLeft, X, Search } from "lucide-react";

export default function PaymentsTable({ payments }: { payments: any[] }) {
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredPayments = payments.filter((p) => {
    // Filter by status
    if (statusFilter !== "All Statuses") {
      const matchStatus = statusFilter.toLowerCase() === "completed" ? "paid" : statusFilter.toLowerCase();
      if (p.payment_status !== matchStatus) return false;
    }
    
    // Filter by search query (Order ID, Razorpay ID, or Customer Name)
            if (searchQuery) {
      const q = searchQuery.toLowerCase().replace(/#/g, ''); // Ignore # if they copy-paste the formatted ID
      if (
        !p.id?.toLowerCase().includes(q) &&
        !p.payment_id?.toLowerCase().includes(q) &&
        !p.shipping_address?.name?.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Payment ID, Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="hidden md:table-cell px-6 py-4 font-semibold">Transaction ID</th>
                <th className="hidden md:table-cell px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer / Order</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPayments && filteredPayments.length > 0 ? (
                filteredPayments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="font-mono text-xs text-white mb-1">
                        {payment.payment_id || 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {payment.id}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-400">
                      <span suppressHydrationWarning>{new Date(payment.created_at).toLocaleDateString()}</span>
                      <div className="text-xs text-slate-500" suppressHydrationWarning>{new Date(payment.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">
                        {payment.shipping_address?.name || 'Unknown Customer'}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Link href={`/admin/orders/${payment.id}`} className="hover:text-orange-400 hover:underline transition-colors">
                          Order #{payment.id.split('-')[0]}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">
                      ₹{payment.total_amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                        ${payment.payment_status === 'paid' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : ''}
                        ${payment.payment_status === 'pending' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : ''}
                        ${payment.payment_status === 'failed' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : ''}
                        ${payment.payment_status === 'refunded' ? 'bg-slate-800 text-slate-300 border border-slate-700' : ''}
                      `}>
                        {payment.payment_status === 'paid' ? <CreditCard size={12} /> : <ArrowRightLeft size={12} />}
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedPayment(payment)}
                        className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-950 border border-slate-800 hover:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard size={18} className="text-orange-500" />
                Payment Details
              </h3>
              <button 
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Razorpay Transaction ID</label>
                <div className="font-mono text-sm text-white bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all">
                  {selectedPayment.razorpay_payment_id || 'Not available'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                  <div className="text-lg font-bold text-white">
                    ₹{selectedPayment.total_amount}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                        ${selectedPayment.payment_status === 'paid' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : ''}
                        ${selectedPayment.payment_status === 'pending' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : ''}
                        ${selectedPayment.payment_status === 'failed' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : ''}
                        ${selectedPayment.payment_status === 'refunded' ? 'bg-slate-800 text-slate-300 border border-slate-700' : ''}
                      `}>
                        {selectedPayment.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Customer Name</label>
                <div className="text-sm font-medium text-white bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedPayment.shipping_name || 'Unknown Customer'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date & Time</label>
                <div className="text-sm text-slate-300">
                  {new Date(selectedPayment.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
