"use client";

import Link from "next/link";
import { ShoppingBag, Loader2, Truck, Sparkles } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import { useCart } from "@/store/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { cart, itemCount, removeItem, updateQty } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleProceedToCheckout = async () => {
    setIsCheckingOut(true);
    router.push("/checkout");
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

            {/* Free Shipping Motivator Progress Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FF6B00]/20 shadow-[0_2px_15px_rgba(255,107,0,0.06)] mb-8">
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cart.subtotal > FREE_SHIPPING_THRESHOLD ? "bg-emerald-100 text-emerald-600" : "bg-[#FF6B00]/10 text-[#FF6B00]"}`}>
                    <Truck size={16} />
                  </div>
                  <div className="text-xs sm:text-sm">
                    {cart.subtotal > FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <Sparkles size={14} className="text-emerald-600 fill-emerald-600 shrink-0" />
                        Congratulations! You have unlocked <strong>FREE SHIPPING</strong>!
                      </span>
                    ) : (
                      <span className="text-[#111111] font-medium">
                        Add <strong className="text-[#FF6B00]">₹{(FREE_SHIPPING_THRESHOLD - cart.subtotal).toLocaleString("en-IN")}</strong> more to qualify for <strong className="text-emerald-600">FREE SHIPPING</strong>!
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#6E6E6E] shrink-0">
                  {Math.min(100, Math.round((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    cart.subtotal > FREE_SHIPPING_THRESHOLD ? "bg-emerald-500" : "bg-gradient-to-r from-[#FF8C1A] to-[#FF6B00]"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%` }}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
              {/* Left Side: Items */}
              <div className="space-y-5">
                {cart.items.map((item) => {
                  const lineKey = item.id || item.variant.id;
                  const primaryImg = item.product.images.find(img => img.isPrimary)?.url || item.product.images[0]?.url;
                  return (
                  <div key={lineKey} className="flex gap-5 sm:gap-6 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
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

                        {item.giftDetails?.isGift && (
                          <div className="mt-2.5 p-2.5 bg-[#FFF8F3] rounded-lg border border-[#FF6B00]/20 text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-[#FF6B00]">
                              <span>🎁 Gift Item</span>
                              {item.giftDetails.packaging ? (
                                <span className="text-[11px] text-[#6E6E6E]">(Handcrafted Packaging Included · ₹100)</span>
                              ) : (
                                <span className="text-[11px] text-[#6E6E6E]">(Card Message Only · Free)</span>
                              )}
                            </div>
                            {item.giftDetails.message && (
                              <p className="text-gray-600 mt-1 italic text-[11px] line-clamp-2">
                                &ldquo;{item.giftDetails.message}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 sm:gap-4 border border-gray-200 rounded-lg px-2 sm:px-3 py-1 bg-gray-50/50">
                          <button onClick={() => updateQty(lineKey, Math.max(1, item.quantity - 1))} className="text-gray-500 hover:text-[#FF6B00] w-6 h-6 flex items-center justify-center text-lg transition-colors">-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(lineKey, item.quantity + 1)} className="text-gray-500 hover:text-[#FF6B00] w-6 h-6 flex items-center justify-center text-lg transition-colors">+</button>
                        </div>
                        
                        <button onClick={() => removeItem(lineKey)} className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 group pb-1">
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
                      <span className={cart.shipping === 0 ? "font-medium text-emerald-600" : "font-medium text-[#111111]"}>
                        {cart.shipping === 0 ? "Complimentary" : `₹${cart.shipping.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    {cart.giftCharge > 0 && (
                      <div className="flex justify-between text-[#6E6E6E]">
                        <span>Gift Packaging</span>
                        <span className="font-medium text-[#111111]">₹{cart.giftCharge.toLocaleString("en-IN")}</span>
                      </div>
                    )}
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
