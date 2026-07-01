/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "@/data";
import { formatPrice } from "@/utils";
import { useCart } from "@/store/CartContext";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import type { Product } from "@/types";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem("kauseyah-wishlist");
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      const items = PRODUCTS.filter((p) => ids.includes(p.id));
      setWishlistItems(items);
    }
  }, []);

  const handleRemove = (productId: string) => {
    const saved = localStorage.getItem("kauseyah-wishlist");
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      const updatedIds = ids.filter((id) => id !== productId);
      localStorage.setItem("kauseyah-wishlist", JSON.stringify(updatedIds));
      setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0]);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] mx-auto animate-pulse">
            <Heart size={38} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-stone-900 font-bold">Your Wishlist is Empty</h1>
            <p className="font-body text-sm text-stone-500 max-w-xs mx-auto">
              Save your favorite handwoven masterworks and artisan crafts to explore them later.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#FF6B00] text-white px-8 py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            Explore Masterpieces <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFF8F3] min-h-screen pt-36 pb-20">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-16 space-y-10">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-2 border-b border-[#FF6B00]/10 pb-6">
          <h1 className="font-display text-4xl md:text-5xl text-stone-900 font-bold">My Favorites</h1>
          <p className="font-body text-xs md:text-sm text-stone-500 uppercase tracking-widest">
            Handpicked Handloom Treasures ({wishlistItems.length})
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((product) => {
            const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
            return (
              <div
                key={product.id}
                className="bg-white border border-[#FF6B00]/10 rounded-2xl overflow-hidden hover:shadow-[0_12px_30px_rgba(181,84,26,0.06)] hover:border-[#FF6B00]/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Overlay */}
                <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* Remove Button Overlay */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/95 hover:bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-md border border-stone-100 cursor-pointer transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                  {/* Category Badge */}
                  {product.subcategory && (
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-1 text-[8px] font-bold tracking-[0.2em] uppercase rounded-md shadow-sm">
                      {product.subcategory}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 font-body">
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block">{product.region}</span>
                    <h3 className="font-display text-xl text-stone-900 line-clamp-1">{product.name}</h3>
                    <p className="text-stone-800 font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={13} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
