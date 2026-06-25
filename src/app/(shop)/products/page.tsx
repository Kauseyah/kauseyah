import type { Metadata } from "next";
import { PRODUCTS } from "@/data";
import { formatPrice } from "@/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products & Services",
  description: "Browse Kauseyah's full range of handlooms, clothing, and tribal gifts.",
};

export default function ProductsPage() {
  return (
    <div className="container-site py-16 space-y-24">
      <div className="text-center">
        <h1 className="font-display text-5xl mb-4">Our Products & Services</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Explore our complete range of handcrafted authentic tribal wear, handlooms, and unique gifts.
        </p>
      </div>

      {/* 3. Key Benefits & Features */}
      <section className="bg-stone-50 p-12 rounded border border-stone-100">
        <h2 className="font-display text-3xl mb-6 text-center">Key Benefits & Features</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold mb-2">100% Authentic</h3>
            <p className="text-sm text-stone-600">Sourced directly from the tribes</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Sustainable</h3>
            <p className="text-sm text-stone-600">Natural dyes and organic fibers</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Ethical Trade</h3>
            <p className="text-sm text-stone-600">Fair compensation for our artisans</p>
          </div>
        </div>
      </section>

      {/* 1. Complete Service / Product Listing & 2. Detailed Descriptions */}
      <section>
        <h2 className="font-display text-3xl mb-8">Complete Product Listing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="card flex flex-col group">
              <div className="aspect-product bg-stone-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 group-hover:scale-105 transition-base">
                  {/* Dummy Image Placeholder */}
                  [Image: {p.name}]
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-2xl mb-2">{p.name}</h3>
                {/* Detailed Description */}
                <p className="text-sm text-stone-600 mb-4 flex-1">{p.shortDescription}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-semibold">{formatPrice(p.price)}</span>
                  <span className="text-xs uppercase tracking-widest text-[#C8892A]">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
