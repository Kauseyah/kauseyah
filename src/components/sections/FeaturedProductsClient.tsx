"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/CartContext";
import ProductDetailDrawer from "./ProductDetailDrawer";

export default function FeaturedProductsClient({ featuredProducts }: { featuredProducts: any[] }) {
  const { addItem } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth > 768 ? 440 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has more than 1 variant, open the variant selector drawer
    if (product.variants && product.variants.length > 1) {
      setSelectedProduct(product);
      return;
    }

    // Single variant or fallback
    const variantToAdd = (product.variants && product.variants.length > 0)
      ? product.variants[0]
      : { id: `${product.id}-default`, stock: product.stock ?? 10, price: product.price };

    addItem(product, variantToAdd);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured Handloom Masterpieces"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">

        {/* Section Heading with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <p className="font-body text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#D95D1E] uppercase mb-2 sm:mb-3">
              Artisan Made · Living Traditions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05]">
              Featured <span className="text-[#D95D1E] italic font-light">Handlooms</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />
            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Meticulously hand-spun wild silks, block-printed drapes, and heritage motifs woven by master tribal artisans across Chhattisgarh and India.
            </p>
          </div>

          {/* Carousel Arrows & View All */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors pr-2"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
            <div className="h-4 w-[1px] bg-[#1A1412]/15 hidden sm:block" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll products left"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll products right"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel Rail */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 pb-6 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredProducts.map((product) => {
            const primaryImg = product.images.find((i: any) => i.isPrimary)?.url || product.images[0]?.url;
            const secondaryImg = product.images[1]?.url || primaryImg;
            const isAdded = addedId === product.id;
            const hasMultipleVariants = product.variants && product.variants.length > 1;

            const discountPct = product.compareAtPrice && product.compareAtPrice > product.price
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : null;

            return (
              <div
                key={product.id}
                className="group w-[78vw] sm:w-[320px] lg:w-[328px] shrink-0 snap-start flex flex-col bg-[#FFF9F4] rounded-xl border border-[#1A1412]/8 hover:border-[#D95D1E]/40 hover:shadow-[0_16px_36px_rgba(26,20,18,0.08)] transition-all duration-300 overflow-hidden"
              >
                {/* 3:4 Portrait Image Container */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-full aspect-[3/4] overflow-hidden bg-[#F7EFE8] block"
                >
                  <Image
                    src={primaryImg}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 330px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {secondaryImg !== primaryImg && (
                    <Image
                      src={secondaryImg}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 330px"
                      className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
                    <span className="bg-white/95 backdrop-blur-md text-[#1A1412] px-2.5 py-1 rounded-sm font-body text-[9.5px] uppercase tracking-[0.16em] font-bold shadow-sm">
                      {product.category || "Handloom"}
                    </span>
                    {discountPct !== null && (
                      <span className="bg-[#851A36] text-white px-2 py-0.5 rounded-sm font-body text-[9px] uppercase tracking-wider font-semibold shadow-sm">
                        {discountPct}% Off
                      </span>
                    )}
                  </div>

                  {/* Desktop Quick Add Button Overlay */}
                  <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`w-full py-2.5 px-4 rounded-lg font-body text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                        isAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-[#1A1412]/90 hover:bg-[#D95D1E] text-white backdrop-blur-md"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} className="text-white" />
                          <span>Added to Bag</span>
                        </>
                      ) : hasMultipleVariants ? (
                        <>
                          <ShoppingBag size={14} />
                          <span>Select Size</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Quick Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </Link>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {product.subcategory && (
                    <span className="font-body text-[10.5px] tracking-[0.15em] text-[#D95D1E] uppercase font-semibold mb-1">
                      {product.subcategory}
                    </span>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="font-display text-xl sm:text-2xl text-[#1A1412] group-hover:text-[#D95D1E] transition-colors leading-snug line-clamp-1 mb-1.5"
                  >
                    {product.name}
                  </Link>

                  <p className="font-body text-xs text-[#665D59] line-clamp-2 leading-relaxed mb-4">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Price & Action Row */}
                  <div className="mt-auto pt-3 border-t border-[#1A1412]/8 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-body text-base sm:text-lg font-semibold text-[#1A1412]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="font-body text-xs text-[#665D59]/60 line-through">
                          ₹{product.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Mobile touch-friendly Add to Cart button */}
                    <div className="sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        aria-label={`Add ${product.name} to cart`}
                        className={`px-3 py-1.5 rounded-md font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-[#D95D1E] text-white hover:bg-[#BF4E15]"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={12} />
                            <span>Added</span>
                          </>
                        ) : hasMultipleVariants ? (
                          <span>Select</span>
                        ) : (
                          <>
                            <ShoppingBag size={12} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Desktop Details link */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="hidden sm:inline-flex items-center gap-1 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1412] hover:text-[#D95D1E] transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quick View Drawer Modal for Variant Selection */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
