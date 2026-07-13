import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Package, Truck, Info } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch Order and ensure it belongs to the authenticated user
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h1 className="text-xl font-semibold">Order Not Found</h1>
        <p className="text-gray-500 text-sm">We couldn't find the order you're looking for.</p>
        <Link href="/account/orders" className="text-[#FF6B00] hover:underline text-sm font-medium">Return to My Orders</Link>
      </div>
    );
  }

  // Fetch Order Items
  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("*, product:products(name, images)")
    .eq("order_id", id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <Link 
          href="/account/orders"
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 flex items-center gap-3 tracking-wide">
            Order #{order.id.split('-')[0]}
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
              ${order.order_status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
              ${order.order_status === 'shipped' ? 'bg-purple-50 text-purple-700 border border-purple-200' : ''}
              ${order.order_status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
              ${order.order_status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
            `}>
              {order.order_status}
            </span>
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-brand/20 shadow-sm p-6 lg:p-8">
            <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-3 tracking-wide">
              <Package size={20} className="text-brand" />
              Order Items
            </h2>
            <div className="divide-y divide-brand/10">
              {items?.map((item) => (
                <div key={item.id} className="py-6 flex gap-5">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-brand/10 bg-brand/5">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-brand/40"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div>
                      <div className="flex justify-between text-[15px] font-semibold text-ink tracking-wide">
                        <h3>{item.product?.name || 'Unknown Product'}</h3>
                        <p className="ml-4 font-display text-xl text-ink">₹{item.price_at_time}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-[13px] mt-2">
                      <p className="text-muted font-medium">Qty {item.quantity}</p>
                      <p className="font-bold text-brand text-[15px]">₹{(item.quantity * item.price_at_time).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Info & Summary */}
        <div className="space-y-6">
          
          <div className="bg-card rounded-xl border border-brand/20 shadow-sm p-6 lg:p-8 space-y-4">
            <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-3 tracking-wide">
              <Truck size={20} className="text-brand" />
              Shipping Information
            </h2>
            <div className="text-[14px] text-muted space-y-2">
              <p className="font-semibold text-ink text-[15px] mb-3">{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
              <p className="pt-4 flex items-center gap-2 border-t border-brand/10 mt-4">
                <span className="text-muted font-medium">Phone:</span> <span className="text-ink font-semibold">{order.shipping_address?.phone}</span>
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-brand/20 shadow-sm p-6 lg:p-8 space-y-4">
            <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-3 tracking-wide">
              <Info size={20} className="text-brand" />
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-[14px] text-muted">
                <span>Subtotal</span>
                <span className="text-ink font-medium">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[14px] text-muted">
                <span>Shipping</span>
                <span className="text-ink font-medium">₹{order.shipping_charge}</span>
              </div>
              <div className="flex justify-between text-[14px] text-muted pb-4 border-b border-brand/10">
                <span>Payment Status</span>
                <span className="capitalize font-bold text-brand bg-brand/5 px-3 py-1 rounded-full text-[11px] tracking-widest">{order.payment_status}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-ink text-[16px] uppercase tracking-widest">Total</span>
                <span className="font-display text-3xl text-brand font-bold">₹{order.total_amount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
