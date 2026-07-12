import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, CreditCard, Receipt, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PaymentDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const supabase = await createClient();

  // Fetch payment details with associated order and customer
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*, orders(*, profiles:customer_id(full_name, email))")
    .eq("id", id)
    .single();

  if (error || !payment) {
    notFound();
  }

  const order = payment.orders;
  const customer = order?.profiles;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/payments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Payment Details</h1>
            <p className="text-sm text-gray-500">Transaction ID: {payment.id}</p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
            ${payment.status === 'completed' || payment.status === 'paid' ? 'bg-green-50 text-green-700' : ''}
            ${payment.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : ''}
            ${payment.status === 'failed' ? 'bg-red-50 text-red-700' : ''}
            ${payment.status === 'refunded' ? 'bg-gray-100 text-gray-700' : ''}
          `}>
            {payment.status === 'completed' || payment.status === 'paid' ? <CheckCircle2 size={14} /> : ''}
            {payment.status === 'pending' ? <Clock size={14} /> : ''}
            {payment.status === 'failed' ? <XCircle size={14} /> : ''}
            {payment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway Details Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-gray-500" />
            Gateway Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Razorpay Payment ID</p>
              <p className="font-mono font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100 break-all">
                {payment.razorpay_payment_id || 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Razorpay Order ID</p>
              <p className="font-mono text-sm text-gray-700">
                {payment.razorpay_order_id || 'Not available'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{payment.amount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">
                {new Date(payment.created_at).toLocaleString()}
              </p>
            </div>
            {payment.receipt_url && (
              <div className="pt-2">
                <a 
                  href={payment.receipt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Receipt size={16} />
                  View Receipt
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Associated Order Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            Order Information
          </h2>
          {order ? (
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Order ID</p>
                <Link href={`/admin/orders/${order.id}`} className="font-mono font-medium text-blue-600 hover:underline">
                  {order.id}
                </Link>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Order Total</p>
                <p className="font-medium text-gray-900">₹{order.total_amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Customer / Shipping Name</p>
                <p className="font-medium text-gray-900">{order.shipping_name}</p>
                {customer?.email && (
                  <p className="text-sm text-gray-500">{customer.email}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Order Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                  ${order.order_status === 'processing' ? 'bg-blue-50 text-blue-700' : ''}
                  ${order.order_status === 'shipped' ? 'bg-purple-50 text-purple-700' : ''}
                  ${order.order_status === 'delivered' ? 'bg-green-50 text-green-700' : ''}
                  ${order.order_status === 'cancelled' ? 'bg-red-50 text-red-700' : ''}
                `}>
                  {order.order_status}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              No order information available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}