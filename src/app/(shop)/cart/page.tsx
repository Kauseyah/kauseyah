"use client";

import { useCart } from "@/store/CartContext";
import { formatPrice } from "@/utils";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeItem, updateQty, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="container-site py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Your Cart is Empty</h1>
        <p className="text-stone-500 mb-8">Discover handcrafted pieces made with love.</p>
        <Link href="/collections" className="btn btn-primary">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-16">
      <h1 className="font-display text-4xl mb-8">Shopping Cart ({itemCount})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.variant.id} className="card p-4 flex gap-4">
              <div className="w-24 h-32 bg-stone-100 rounded flex-shrink-0" />
              <div className="flex-1">
                <p className="font-display text-xl">{item.product.name}</p>
                {item.variant.size && <p className="text-sm text-stone-400">Size: {item.variant.size}</p>}
                {item.variant.color && <p className="text-sm text-stone-400">Color: {item.variant.color}</p>}
                <p className="mt-2 font-semibold">{formatPrice(item.variant.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.variant.id)}
                  className="text-stone-400 hover:text-red-500 text-sm transition-base"
                >
                  Remove
                </button>
                <select
                  value={item.quantity}
                  onChange={(e) => updateQty(item.variant.id, Number(e.target.value))}
                  className="border border-stone-200 rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-display text-2xl mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Shipping</span>
              <span>{cart.total - cart.subtotal === 0 ? "Free" : formatPrice(cart.total - cart.subtotal)}</span>
            </div>
            <div className="border-t border-stone-100 pt-2 mt-2 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn btn-primary w-full mt-6 justify-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
