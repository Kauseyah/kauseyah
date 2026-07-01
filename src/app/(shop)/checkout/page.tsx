"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/CartContext";
import { formatPrice } from "@/utils";
import { Check, ArrowRight, ShoppingBag, MapPin, CreditCard, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart, itemCount } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !pincode) return;

    // Generate random mock order ID
    const randomId = "KAS-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6 bg-white border border-[#FF6B00]/10 p-8 rounded-3xl shadow-[0_12px_40px_rgba(181,84,26,0.04)]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
            <Check size={38} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl md:text-3xl text-emerald-950 font-bold">Order Placed Successfully!</h1>
            <p className="font-body text-xs text-stone-500 uppercase tracking-widest font-bold">
              Order ID: {orderId}
            </p>
            <p className="font-body text-sm text-stone-600 max-w-xs mx-auto leading-relaxed pt-2">
              Thank you for supporting handloom weaving! Our team will contact you shortly to confirm your delivery details.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#FF6B00] text-white w-full py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-wider justify-center transition-colors shadow-md cursor-pointer"
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
            href="/products"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#FF6B00] text-white px-8 py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            Explore Catalog <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-8">
        
        {/* Title */}
        <div className="border-b border-[#FF6B00]/10 pb-4">
          <h1 className="font-display text-3xl md:text-4xl text-stone-900 font-bold">Secure Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left shipping address form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.02)] space-y-6">
            
            {/* shipping form header */}
            <div className="flex items-center gap-2 font-display text-lg text-stone-900 font-bold">
              <MapPin size={18} className="text-[#FF6B00]" />
              <span>1. Shipping Information</span>
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
                <label className={`border p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === "cod" ? "border-[#FF6B00] bg-[#FF6B00]/5" : "border-stone-200 bg-white"
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-[#FF6B00]"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Pay in cash on delivery</span>
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
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.02)] space-y-6 lg:sticky lg:top-28">
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
                    <div className="flex-1 font-body text-xs">
                      <h4 className="font-semibold text-stone-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-stone-400 text-[10px] mt-0.5">Qty: {item.quantity}</p>
                      {item.variant.color && <p className="text-stone-400 text-[9px]">Color: {item.variant.color}</p>}
                    </div>
                    <span className="font-body text-xs font-bold text-stone-900">
                      {formatPrice(item.variant.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-stone-100 pt-4 space-y-3 font-body text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className="font-semibold text-stone-900">
                  {cart.total - cart.subtotal === 0 ? "Free" : formatPrice(cart.total - cart.subtotal)}
                </span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-display text-base font-bold text-[#FF6B00]">
                <span>Total Amount</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} />
              Place Secure Order
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
