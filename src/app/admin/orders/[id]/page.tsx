import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Package, User, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import UpdateStatusForm from "./UpdateStatusForm";

export default async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch Order robustly without relying on foreign key joins
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (order && order.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", order.user_id)
      .single();
    order.customer = profile || null;
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">Return to Orders</Link>
      </div>
    );
  }

  // Fetch Order Items
  const { data: items } = await supabase
    .from("order_items")
    .select("*, product:products(name, images)")
    .eq("order_id", id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/orders"
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-sans text-white tracking-tight flex items-center gap-3">
            Order #{order.id.split('-')[0]}
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
              ${order.order_status === 'processing' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' : ''}
              ${order.order_status === 'shipped' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' : ''}
              ${order.order_status === 'delivered' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : ''}
              ${order.order_status === 'cancelled' ? 'bg-red-900/30 text-red-400 border border-red-900/50' : ''}
            `}>
              {order.order_status}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-slate-500" />
              Order Items
            </h2>
            <div className="divide-y divide-slate-800">
              {items?.map((item) => (
                <div key={item.id} className="py-6 flex gap-6">
                  <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-500"><Package size={28} /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2">
                    <div>
                      <div className="flex justify-between text-[20px] font-bold text-white tracking-wide">
                        <h3>{item.product?.name || 'Unknown Product'}</h3>
                        <p className="ml-4 text-[#FF6B00]">₹{item.price_at_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[18px] mt-1">
                      <p className="text-slate-400 font-medium">Qty: {item.quantity}</p>
                      <p className="font-bold text-white">₹{(item.quantity * item.price_at_time).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-800 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping</span>
                <span>₹{order.shipping_charge}</span>
              </div>
              <div className="flex justify-between text-base font-medium text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Customer and Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                Customer
              </h2>
              <div className="text-sm text-slate-400">
                <p className="font-medium text-white">{order.customer?.full_name || 'Guest Checkout'}</p>
                <p>{order.customer?.email || 'No email'}</p>
                <p className="mt-2 text-slate-500 text-xs">ID: {order.user_id || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <Truck size={18} className="text-slate-500" />
                Shipping Info
              </h2>
              <div className="text-sm text-slate-400 space-y-1">
                <p className="font-medium text-white">{order.shipping_address?.name}</p>
                <p>{order.shipping_address?.address}</p>
                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
                <p className="pt-2 flex items-center gap-2">
                  <span className="text-slate-500">Phone:</span> {order.shipping_address?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status */}
        <div className="space-y-6">

          {/* Update Status Form */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-slate-500" />
              Manage Status
            </h2>
            <UpdateStatusForm order={order} />
          </div>

        </div>
      </div>
    </div>
  );
}