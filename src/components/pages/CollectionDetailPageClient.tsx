 
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils";
import { useCart } from "@/store/CartContext";
import { Star, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductDetailDrawer from "@/components/sections/ProductDetailDrawer";

interface CollectionDetailPageClientProps {
  title: string;
  description: string;
  products: any[];
}

export default function CollectionDetailPageClient({
  title,
  description,
  products,
}: CollectionDetailPageClientProps) {
  const { addItem } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0]);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2000);
    }
  };

  return (
    <main className="bg-white">
      {/* ── Page Hero ── */}
      <section className="w-full bg-[#0D0400] pt-36 lg:pt-44 pb-20 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-[#FF6B00]/8 to-transparent blur-[80px]" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-20 text-center relative z-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white leading-tight">
              {title}
            </h1>
            <p className="font-body text-xs md:text-sm text-[#FFF8F3]/75 mt-3 max-w-xl font-light">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="bg-[#FFF8F3] py-16 lg:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];
                const isAdded = addedProductId === product.id;

                return (
                  <motion.div
                    layout
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer group bg-white border border-[#FF6B00]/10 hover:shadow-[0_15px_40px_rgba(181,84,26,0.08)] hover:border-[#FF6B00]/30 transition-all duration-500 rounded-2xl flex flex-col overflow-hidden"
                  >
                    {/* Image block */}
                    <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden shrink-0">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 22vw"
                      />
                      {product.subcategory && (
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-1 text-[8px] font-bold tracking-[0.2em] uppercase rounded-md shadow-sm">
                          {product.subcategory}
                        </span>
                      )}
                    </div>

                    {/* Card details */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 font-body text-[10px] text-stone-500 uppercase tracking-widest">
                          <span>{product.region}</span>
                          {product.artisan && (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                              <span>By {product.artisan.name}</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display text-2xl text-[#111111] group-hover:text-[#FF6B00] transition-colors duration-300 mb-2 leading-tight">
                          <Link 
                            href={`/products/${product.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                          >
                            {product.name}
                          </Link>
                        </h3>

                        <p className="font-body text-[13px] text-stone-600 line-clamp-2 leading-relaxed mb-4">
                          {product.shortDescription}
                        </p>

                        {/* Star Rating */}
                        {product.rating && (
                          <div className="flex items-center gap-1.5 mb-4">
                            <div className="flex text-amber-500">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={12}
                                  fill={idx < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                                  strokeWidth={1.5}
                                />
                              ))}
                            </div>
                            <span className="font-body text-[11px] font-semibold text-stone-700 mt-0.5">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="font-body text-[15px] font-bold text-[#111111]">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="font-body text-[11px] text-stone-400 line-through mt-0.5">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-body text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isAdded 
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                              : "bg-[#111111] text-white hover:bg-[#FF6B00] shadow-md shadow-black/10"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={12} strokeWidth={3} />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={12} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-[#FF6B00]/10 rounded-2xl p-8 max-w-lg mx-auto">
              <p className="font-body text-stone-500 text-lg mb-6">No products found in this category yet.</p>
              <Link 
                href="/collections"
                className="inline-block bg-[#111111] text-white px-6 py-3 rounded-xl font-body text-xs font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Product details sidebar drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailDrawer 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

    </main>
  );
}
