"use client";

import { useState } from "react";
import { Search, Eye, UserX, UserCheck } from "lucide-react";
import Link from "next/link";

export default function CustomerTableClient({ initialCustomers }: { initialCustomers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredCustomers = initialCustomers.filter((customer) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (customer.full_name?.toLowerCase().includes(searchLower) || "") ||
      (customer.email?.toLowerCase().includes(searchLower) || "");

    // Status filter (null or true is Active, false is Blocked)
    const isActive = customer.is_active !== false; 
    const matchesStatus = 
      statusFilter === "All Statuses" ||
      (statusFilter === "Active" && isActive) ||
      (statusFilter === "Inactive" && !isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customers by name or email..." 
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
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Total Spent</th>
                <th className="px-6 py-5">Joined Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCustomers && filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/50 transition-colors group even:bg-slate-950/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-sm shadow-sm group-hover:border-orange-500/50 group-hover:text-orange-400 transition-all">
                          {customer.full_name ? customer.full_name.substring(0, 2).toUpperCase() : 'CU'}
                        </div>
                        <span className="font-bold text-white group-hover:text-orange-400 transition-colors">
                          {customer.full_name || 'Unnamed Customer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-300">{customer.email}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{customer.phone || 'No phone provided'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      ₹{customer.total_spent ? customer.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      {customer.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 shadow-sm">
                          <UserCheck size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-900/30 text-red-400 border border-red-900/50 shadow-sm">
                          <UserX size={12} />
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <Link href={`/admin/customers/${customer.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:text-orange-400 text-slate-400 text-xs font-bold rounded-lg shadow-sm transition-all">
                        <Eye size={14} />
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800">
                        <UserX size={24} className="text-slate-600" />
                      </div>
                      <p className="font-bold text-slate-400">No customers found</p>
                      <p className="text-sm">There are no customer records matching your search or filter.</p>
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
