import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Wishlist | Kauseyah",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F3] pt-36 pb-20 px-4 sm:px-8 lg:px-20">
      <div className="max-w-[1200px] mx-auto text-center">
        <Heart className="mx-auto w-16 h-16 text-[#FF6B00]/40 mb-6" />
        <h1 className="font-display text-4xl md:text-5xl text-[#111111] mb-4">Your Wishlist</h1>
        <p className="font-body text-[#111111]/70 mb-8 max-w-md mx-auto">
          Save your favorite handcrafted masterpieces here. Your wishlist is currently empty.
        </p>
        <Link 
          href="/collections" 
          className="inline-block bg-[#FF6B00] text-white font-body text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-[#111111] transition-colors duration-300"
        >
          Explore Collections
        </Link>
      </div>
    </main>
  );
}
