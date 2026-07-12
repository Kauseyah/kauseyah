"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateOrderStatus } from "@/app/actions/orders";

export default function UpdateStatusForm({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await updateOrderStatus(order.id, formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Order updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Payment Status</label>
        <select 
          key={order.payment_status} 
          name="payment_status" 
          defaultValue={order.payment_status} 
          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Order Status</label>
        <select 
          key={order.order_status} 
          name="order_status" 
          defaultValue={order.order_status} 
          className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white"
        >
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full mt-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
      >
        {loading ? "Updating..." : "Update Order"}
      </button>
    </form>
  );
}
