"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/CartContext";
import ProductDetailDrawer from "./ProductDetailDrawer";

const FALLBACK_TOY_IMAGES: Record<string, string> = {
  default: "/images/toy_elephant2.jpeg",
  camel: "/images/toy_camel.png",
  doll: "/images/toy_doll2.jpeg",
  elephant: "/images/toy_elephant2.jpeg",
};

export default function HandEmbroideredToysClient({ toys }: { toys: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth > 768 ? 440 : 310;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 1) {
      setSelectedProduct(product);
      return;
    }

    const variantToAdd = (product.variants && product.variants.length > 0)
      ? product.variants[0]
      : { id: `${product.id}-default`, stock: product.stock ?? 10, price: product.price };

    addItem(product, variantToAdd);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section 
      aria-label="Handcrafted Zero-Waste Textile Toys"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#F7EFE8] border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-sm">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Zero-Waste · Upcycled Handloom Remnants
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05] tracking-tight">
              Little Companions, <span className="text-[#D95D1E] italic font-light font-display">Made by Hand</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />
            
            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Pure nostalgic warmth, lovingly hand-stitched by rural women artisans from upcycled handloom fabric remnants. 100% plastic-free, heirloom-quality, and treasured by children and collectors alike.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              href="/collections/textile-toys"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors pr-2"
            >
              <span>Explore All Toys</span>
              <ArrowRight size={13} />
            </Link>
            <div className="h-4 w-[1px] bg-[#1A1412]/15 hidden sm:block" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll toys left"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll toys right"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Product Carousel Rail ── */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 pb-6 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {toys && toys.length > 0 ? (
            toys.map((product) => {
              let primaryImg = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url;
              if (!primaryImg || primaryImg.includes("placeholder")) {
                const nameLower = product.name.toLowerCase();
                if (nameLower.includes("camel")) primaryImg = FALLBACK_TOY_IMAGES.camel;
                else if (nameLower.includes("doll")) primaryImg = FALLBACK_TOY_IMAGES.doll;
                else primaryImg = FALLBACK_TOY_IMAGES.default;
              }

              const isAdded = addedId === product.id;
              const hasMultipleVariants = product.variants && product.variants.length > 1;

              return (
                <div
                  key={product.id}
                  className="group w-[74vw] sm:w-[280px] lg:w-[290px] shrink-0 snap-start flex flex-col bg-[#FFF9F4] rounded-2xl border border-[#1A1412]/8 hover:border-[#D95D1E]/40 hover:shadow-[0_16px_36px_rgba(26,20,18,0.08)] transition-all duration-300 overflow-hidden"
                >
                  {/* Portrait Image Container */}
                  <Link
                    href={`/products/${encodeURIComponent(product.slug.trim())}`}
                    className="relative w-full aspect-[4/5] overflow-hidden bg-[#F7EFE8] block"
                  >
                    <Image
                      src={primaryImg}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 290px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#1A1412] px-2.5 py-1 rounded-sm font-body text-[9px] uppercase tracking-[0.16em] font-bold shadow-sm">
                      Zero-Waste Remnant
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <span className="font-body text-[10px] tracking-[0.18em] text-[#D95D1E] uppercase font-semibold mb-1">
                      {product.subcategory || "Textile Toy"}
                    </span>

                    <Link
                      href={`/products/${encodeURIComponent(product.slug.trim())}`}
                      className="font-display text-lg sm:text-xl text-[#1A1412] group-hover:text-[#D95D1E] transition-colors leading-snug line-clamp-1 mb-1.5"
                    >
                      {product.name}
                    </Link>

                    {/* Price & Quick Add Button */}
                    <div className="mt-auto pt-3 border-t border-[#1A1412]/8 flex items-center justify-between gap-2">
                      <span className="font-body text-base font-bold text-[#1A1412]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-700 text-white"
                            : "bg-[#1A1412] hover:bg-[#D95D1E] text-white shadow-sm"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={12} className="text-white" />
                            <span>Added</span>
                          </>
                        ) : hasMultipleVariants ? (
                          <>
                            <ShoppingBag size={12} />
                            <span>Options</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={12} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full py-12 text-center text-[#665D59]">
              <p className="font-body text-sm">Textile toys are currently in craft production.</p>
            </div>
          )}
        </div>

        {/* Global CTA */}
        <div className="mt-10 sm:mt-14 flex justify-center">
          <Link
            href="/collections/textile-toys"
            className="inline-flex items-center gap-3 bg-[#1A1412] hover:bg-[#D95D1E] text-white px-8 py-3.5 rounded-sm font-body text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:-translate-y-0.5 min-h-[48px]"
          >
            <span>Explore All Conscious Toys</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* Variant Selector Drawer if needed */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
