import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { PackageSearch, ChevronRight, Package, Eye } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Orders | Kauseyah",
  description: "View your order history.",
};

export default async function OrdersPage() {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-center pb-8 mb-10">
         <h1 className="font-display text-4xl text-ink tracking-wide">Order History</h1>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-ivory rounded-xl border border-brand/10">
          <h2 className="font-display text-4xl text-ink tracking-wide">No orders yet</h2>
          <p className="text-[16px] text-muted max-w-[400px]">
            Your purchase history is empty. Discover our exclusive collections and start your journey with Kauseyah.
          </p>
          <Link 
            href="/shop" 
            className="mt-8 btn btn-primary px-10 py-4 text-[13px]"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-lg shadow-brand/5 overflow-hidden border border-[#2D2825]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#2D2825] text-[#F3EFEA]">
                  <th className="py-5 px-6 text-[12px] font-bold tracking-[0.15em] uppercase">Order ID</th>
                  <th className="py-5 px-6 text-[12px] font-bold tracking-[0.15em] uppercase">Date</th>
                  <th className="py-5 px-6 text-[12px] font-bold tracking-[0.15em] uppercase">Total</th>
                  <th className="py-5 px-6 text-[12px] font-bold tracking-[0.15em] uppercase">Status</th>
                  <th className="py-5 px-6 text-right text-[12px] font-bold tracking-[0.15em] uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2825]/5 bg-[#FFFCFA]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white transition-colors group">
                    <td className="py-6 px-6">
                      <span className="font-bold text-ink text-[15px]">#{order.id.split('-')[0]}</span>
                    </td>
                    <td className="py-6 px-6 text-[14px] text-muted font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-6 px-6 font-bold text-ink text-[15px]">
                      ₹{order.total_amount}
                    </td>
                    <td className="py-6 px-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block shadow-sm
                        ${order.order_status === 'processing' ? 'bg-white text-[#FF6B00] border border-[#FF6B00]/20' : ''}
                        ${order.order_status === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''}
                        ${order.order_status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-200' : ''}
                        ${order.order_status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-200' : ''}
                      `}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-right">
                      <Link 
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center justify-end gap-2 text-[12px] font-bold uppercase tracking-widest text-[#FF6B00] group-hover:translate-x-1 transition-transform"
                      >
                        View <span className="hidden sm:inline">Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
