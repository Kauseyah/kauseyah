"use client";

import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/store/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CartPage() {
  const { cart, itemCount, removeItem, updateQty } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleProceedToCheckout = async () => {
    setIsCheckingOut(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    setIsCheckingOut(false);
    
    if (!user) {
      router.push("/login?redirectTo=/checkout");
    } else {
      // Assuming a /checkout page exists or will exist
      router.push("/checkout"); 
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF8F3] pt-40 pb-24 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto">
        
        {itemCount === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <ShoppingBag className="mx-auto w-16 h-16 text-[#FF6B00]/40 mb-6" />
            <h1 className="font-display text-4xl md:text-5xl text-[#111111] mb-4">Your Cart is Empty</h1>
            <p className="text-[#6E6E6E] mb-10 max-w-sm mx-auto">
              Looks like you haven't added any of our timeless indigenous crafts yet.
            </p>
            <Link 
              href="/collections" 
              className="inline-block bg-[#FF6B00] text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#111111] transition-colors duration-300 shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-none hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-10">
              <h1 className="font-display text-4xl md:text-5xl text-[#111111]">Shopping Cart</h1>
              <span className="text-[#6E6E6E] text-lg">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
              {/* Left Side: Items */}
              <div className="space-y-5">
                {cart.items.map((item) => {
                  const primaryImg = item.product.images.find(img => img.isPrimary)?.url || item.product.images[0]?.url;
                  return (
                  <div key={item.variant.id} className="flex gap-5 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[#f5efe6] overflow-hidden flex-shrink-0 relative rounded-xl">
                      {primaryImg && (
                        <Image src={primaryImg} alt={item.product.name} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <Link href={`/products/${item.product.slug}`} className="font-display text-xl sm:text-[22px] text-[#111111] hover:text-[#FF6B00] transition-colors line-clamp-2 leading-tight">
                            {item.product.name}
                          </Link>
                          <span className="font-medium text-[#111111] text-lg whitespace-nowrap">₹{(item.variant.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {(item.variant.size || item.variant.color) && (
                          <p className="text-xs sm:text-sm text-[#6E6E6E] uppercase tracking-wider mt-2">
                            {[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 sm:gap-4 border border-gray-200 rounded-lg px-2 sm:px-3 py-1 bg-gray-50/50">
                          <button onClick={() => updateQty(item.variant.id, Math.max(1, item.quantity - 1))} className="text-gray-500 hover:text-[#FF6B00] w-6 h-6 flex items-center justify-center text-lg transition-colors">-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.variant.id, item.quantity + 1)} className="text-gray-500 hover:text-[#FF6B00] w-6 h-6 flex items-center justify-center text-lg transition-colors">+</button>
                        </div>
                        
                        <button onClick={() => removeItem(item.variant.id)} className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 group pb-1">
                          <span className="underline decoration-red-200 underline-offset-4 group-hover:decoration-red-600 transition-colors">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
              
              {/* Right Side: Order Summary */}
              <div>
                <div className="bg-white p-7 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] sticky top-32">
                  <h2 className="font-display text-[22px] text-[#111111] mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 text-[15px] border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between text-[#6E6E6E]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#111111]">₹{cart.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#6E6E6E]">
                      <span>Shipping</span>
                      <span className={cart.total === cart.subtotal ? "font-medium text-emerald-600" : "font-medium text-[#111111]"}>
                        {cart.total === cart.subtotal ? "Complimentary" : `₹${(cart.total - cart.subtotal).toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[#111111] font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-[#111111]">₹{cart.total.toLocaleString("en-IN")}</span>
                  </div>
                  
                  <button 
                    onClick={handleProceedToCheckout}
                    disabled={isCheckingOut}
                    className="w-full flex justify-center items-center gap-2 bg-[#FF6B00] text-white text-xs sm:text-sm font-bold uppercase tracking-widest py-4 sm:py-5 rounded-full hover:bg-[#111111] transition-all duration-300 shadow-[0_8px_20px_rgba(255,107,0,0.2)] hover:shadow-none hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:bg-[#FF6B00] disabled:hover:translate-y-0 disabled:shadow-none"
                  >
                    {isCheckingOut && <Loader2 size={16} className="animate-spin" />}
                    {isCheckingOut ? "Verifying..." : "Proceed to Checkout"}
                  </button>

                  <div className="mt-6 text-center text-[11px] sm:text-xs text-[#6E6E6E] flex flex-col gap-1.5 opacity-80">
                    <p>Secure checkout powered by Razorpay</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
