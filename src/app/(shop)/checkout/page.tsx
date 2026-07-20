"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/CartContext";
import { formatPrice } from "@/utils";
import { Check, ArrowRight, ShoppingBag, MapPin, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import toast from "react-hot-toast";
import { createOrder } from "@/app/actions/checkout";

export default function CheckoutPage() {
  const { cart, clearCart, itemCount } = useCart();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  useEffect(() => {
    if (orderPlaced) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderPlaced]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !pincode) return;

    setIsProcessing(true);

    try {
      if (paymentMethod === "cod") {
        const randomId = "KAS-" + Math.floor(100000 + Math.random() * 900000);
        
        const orderData = {
          id: randomId,
          email,
          shipping_name: name,
          shipping_address: address,
          city,
          pincode,
          shipping_phone: phone,
          subtotal: cart.subtotal,
          shipping_charge: cart.total - cart.subtotal,
          payment_status: "pending",
          total_amount: cart.total,
        };

        const res = await createOrder(orderData, cart.items);

        if (res.error) {
          throw new Error(res.error);
        }

        setOrderId(res.orderId as string);
        setOrderPlaced(true);
        clearCart();
        setIsProcessing(false);
      } else if (paymentMethod === "online") {
        // 1. Create order on our backend
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItems: cart.items }),
        });

        const order = await res.json();
        
        if (!res.ok) {
          // If the error is about missing credentials, fallback to a mock testing flow
          if (order.error === "Razorpay credentials not configured") {
            toast.success("MOCK PAYMENT: Simulating successful online payment...", { duration: 3000 });
            
            setTimeout(async () => {
              const randomId = "KAS-" + Math.floor(100000 + Math.random() * 900000);
              // // console.log("Mock Payment Success");

              const orderData = {
                id: randomId,
                email,
                shipping_name: name,
                shipping_address: address,
                city,
                pincode,
                shipping_phone: phone,
                subtotal: cart.subtotal,
                shipping_charge: cart.total - cart.subtotal,
                payment_status: "paid",
                total_amount: cart.total,
                razorpay_order_id: "mock_order_id",
                razorpay_payment_id: "mock_payment_id",
              };

              const dbRes = await createOrder(orderData, cart.items);
              if (dbRes.error) {
                toast.error(dbRes.error);
                setIsProcessing(false);
                return;
              }
              
              setOrderId(dbRes.orderId as string);
              setOrderPlaced(true);
              clearCart();
              setIsProcessing(false);
            }, 2000);
            return;
          }
          
          throw new Error(order.error || "Failed to initiate payment");
        }

        // 2. Open Razorpay checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC for frontend
          amount: order.amount,
          currency: order.currency,
          name: "Kauseyah",
          description: "Purchase from Kauseyah",
          order_id: order.id,
          handler: async function (response: any) {
            // Payment successful
            try {
              // 1. Verify Payment
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error("Payment verification failed");
              }

              // 2. Save Order to Database
              const orderId = response.razorpay_order_id || "KAS-" + Math.floor(100000 + Math.random() * 900000);
              const orderData = {
                id: orderId,
                email,
                shipping_name: name,
                shipping_address: address,
                city,
                pincode,
                shipping_phone: phone,
                subtotal: cart.subtotal,
                shipping_charge: cart.total - cart.subtotal,
                payment_status: "paid",
                total_amount: cart.total,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              };

              const dbRes = await createOrder(orderData, cart.items);
              if (dbRes.error) {
                throw new Error(dbRes.error);
              }

              toast.success("Payment Successful!");
              setOrderId(dbRes.orderId as string);
              setOrderPlaced(true);
              clearCart();
            } catch (error: any) {
              // // console.error("Verification error:", error);
              toast.error(error.message || "Payment verification failed");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#FF6B00",
          },
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay Online',
                  instruments: [
                    { method: 'upi' },
                    { method: 'card' },
                    { method: 'netbanking' },
                    { method: 'wallet' }
                  ],
                },
              },
              sequence: ['block.banks'],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              toast.error("Payment cancelled");
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (err: any) {
      // // console.error(err);
      toast.error(err.message || "An error occurred");
      setIsProcessing(false);
    }
  };



  if (orderPlaced) {
    return (
      <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6 bg-[#2D2825] border border-[#FF6B00]/20 p-8 rounded-3xl shadow-[0_12px_40px_rgba(181,84,26,0.15)]">
          <div className="w-20 h-20 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/30">
            <Check size={38} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl md:text-3xl text-[#F3EFEA] font-bold">Order Placed Successfully!</h1>
            <p className="font-body text-xs text-[#FF6B00] uppercase tracking-widest font-bold">
              Order ID: {orderId}
            </p>
            <p className="font-body text-[15px] text-stone-300 max-w-sm mx-auto leading-relaxed pt-2">
              Thank you for supporting handloom weaving! <br/> We have sent a receipt of this order to your registered email address.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white w-full py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-wider justify-center transition-colors shadow-md cursor-pointer"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  if (itemCount === 0) {
    return (
      <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
            <ShoppingBag size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-stone-900 font-bold">Checkout is Empty</h1>
            <p className="font-body text-sm text-stone-500 max-w-xs mx-auto">
              Please add items to your shopping cart before heading to checkout.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#FF6B00] text-white px-8 py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            Explore Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <main className="bg-[#FAF4ED] min-h-screen pt-36 pb-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-8">
        
        {/* Title */}
        <div className="border-b border-[#FF6B00]/10 pb-4">
          <h1 className="font-display text-3xl md:text-4xl text-stone-900 font-bold">Secure Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left shipping address form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[#FF6B00]/15 shadow-[0_12px_40px_rgba(181,84,26,0.08)] space-y-6">
            
            {/* shipping form header */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 font-display text-lg text-stone-900 font-bold">
                <MapPin size={18} className="text-[#FF6B00]" />
                <span>1. Shipping Information</span>
              </div>
              

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-xs text-stone-800">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@example.com"
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">Shipping Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete delivery address with landmark..."
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-stone-500">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560038"
                  className="w-full bg-stone-50 border border-stone-300 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-all placeholder-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Payment Method section */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex items-center gap-2 font-display text-lg text-stone-900 font-bold">
                <CreditCard size={18} className="text-[#FF6B00]" />
                <span>2. Payment Option</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-xs">
                <label className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${
                  paymentMethod === "cod" ? "border-[#FF6B00] bg-[#FF6B00]/5" : "border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      disabled
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#FF6B00]"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Currently unavailable</span>
                    </div>
                  </div>
                </label>

                <label className={`border p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === "online" ? "border-[#FF6B00] bg-[#FF6B00]/5" : "border-stone-200 bg-white"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#FF6B00]"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">Online Payments</span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">UPI / Card / Netbanking</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right order summary */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-[#FF6B00]/15 shadow-[0_12px_40px_rgba(181,84,26,0.08)] space-y-6 lg:sticky lg:top-28">
            <h2 className="font-display text-xl text-stone-900 font-bold">Order Summary</h2>

            {/* Cart list preview */}
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-2">
              {cart.items.map((item) => {
                const imgUrl = item.product.images.find(img => img.isPrimary)?.url || item.product.images[0].url;
                return (
                  <div key={item.variant.id} className="py-3 flex gap-4 items-center">
                    <div className="relative w-12 h-16 bg-stone-50 rounded overflow-hidden shrink-0 border border-stone-100">
                      <Image src={imgUrl} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 font-sans text-base">
                      <h4 className="font-semibold text-stone-900 line-clamp-2">{item.product.name}</h4>
                      <p className="text-stone-600 text-sm mt-1">Qty: {item.quantity}</p>
                      {item.variant.color && <p className="text-stone-600 text-sm">Color: {item.variant.color}</p>}
                    </div>
                    <span className="font-sans text-base font-bold text-stone-900">
                      {formatPrice(item.variant.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-stone-200 pt-5 space-y-4 font-sans text-base">
              <div className="flex justify-between">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600 font-medium">Shipping</span>
                <span className="font-semibold text-stone-900">
                  {cart.total - cart.subtotal === 0 ? "Free" : formatPrice(cart.total - cart.subtotal)}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-4 flex justify-between font-sans text-lg font-bold text-[#FF6B00]">
                <span>Total Amount</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ShieldCheck size={14} />
              )}
              {isProcessing ? "Processing..." : "Place Secure Order"}
            </button>
          </div>
        </form>

      </div>
    </main>
    </>
  );
}
