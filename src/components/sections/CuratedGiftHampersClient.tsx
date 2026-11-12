"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Gift, Sparkles, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/store/CartContext";
import ProductDetailDrawer from "./ProductDetailDrawer";

export default function CuratedGiftHampersClient({ hampers }: { hampers: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
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
      aria-label="Conscious Gifting and Hampers"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#FFF9F4] border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-sm">
              <Gift size={12} className="text-[#D95D1E]" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Conscious Gifting · Handcrafted
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05] tracking-tight">
              Gifts with a <span className="text-[#D95D1E] italic font-light font-display">Story to Tell</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />
            
            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Thoughtfully curated keepsakes packaged in handcrafted keepsake boxes with organic botanical details. Each gift honors traditional craft wisdom and sustains rural artisan livelihoods.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              href="/collections/gift-hampers"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors pr-2"
            >
              <span>Explore All Hampers</span>
              <ArrowRight size={13} />
            </Link>
            <div className="h-4 w-[1px] bg-[#1A1412]/15 hidden sm:block" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll hampers left"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll hampers right"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Editorial Split: Featured Packaging Banner + Product Rail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-4">
          
          {/* Left: Editorial Story Banner (4 cols on desktop) */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden relative bg-[#F7EFE8] border border-[#1A1412]/8 flex flex-col justify-between p-6 sm:p-8 min-h-[380px] lg:min-h-full">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/seasonal_edit.png"
                alt="Conscious Gifting Hampers with handcrafted stationery and botanicals"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/92 via-[#1A1412]/50 to-transparent" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 self-start">
              <span className="inline-block px-3 py-1 rounded-sm bg-white/20 backdrop-blur-md border border-white/25 text-white font-body text-[9.5px] uppercase tracking-[0.2em] font-bold">
                Mindful Unboxing
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 text-white mt-auto pt-16">
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[#D4A359] font-semibold mb-2">
                Personalized Packaging
              </p>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-2">
                Curated Keepsakes with Purpose
              </h3>
              <p className="font-body text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-5">
                Every hamper is presented in a reusable keepsake box made from reclaimed materials, complete with an optional handwritten artisan card.
              </p>
              
              <div className="inline-flex items-center gap-2 bg-[#851A36] text-white px-3.5 py-1.5 rounded-sm font-body text-[10px] uppercase tracking-wider font-semibold shadow-md">
                <Sparkles size={11} className="text-[#D4A359]" />
                <span>Optional +₹100 Custom Box &amp; Note</span>
              </div>
            </div>
          </div>

          {/* Right: Real Published Products Carousel (8 cols on desktop) */}
          <div className="lg:col-span-8 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 pb-4 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden h-full"
            >
              {hampers && hampers.length > 0 ? (
                hampers.map((product) => {
                  const primaryImg = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url;
                  const isAdded = addedId === product.id;
                  const hasMultipleVariants = product.variants && product.variants.length > 1;

                  return (
                    <div
                      key={product.id}
                      className="group w-[78vw] sm:w-[320px] lg:w-[330px] shrink-0 snap-start flex flex-col bg-white rounded-2xl border border-[#1A1412]/8 hover:border-[#D95D1E]/40 hover:shadow-[0_16px_36px_rgba(26,20,18,0.08)] transition-all duration-300 overflow-hidden"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${encodeURIComponent(product.slug.trim())}`}
                        className="relative w-full aspect-[4/3] overflow-hidden bg-[#F7EFE8] block"
                      >
                        <Image
                          src={primaryImg}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 85vw, 330px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        
                        <div className="absolute top-3 left-3 bg-[#1A1412]/85 backdrop-blur-md text-white px-2.5 py-1 rounded-sm font-body text-[9px] uppercase tracking-[0.16em] font-semibold">
                          {product.subcategory || "Gift Hamper"}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <Link
                          href={`/products/${encodeURIComponent(product.slug.trim())}`}
                          className="font-display text-xl sm:text-2xl text-[#1A1412] group-hover:text-[#D95D1E] transition-colors leading-snug line-clamp-1 mb-1.5"
                        >
                          {product.name}
                        </Link>

                        <p className="font-body text-xs text-[#665D59] line-clamp-2 leading-relaxed mb-5 font-light">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Price & Quick Add Button */}
                        <div className="mt-auto pt-4 border-t border-[#1A1412]/8 flex items-center justify-between gap-3">
                          <div>
                            <span className="font-body text-base font-bold text-[#1A1412]">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="font-body text-xs text-[#665D59]/60 line-through ml-2">
                                ₹{product.compareAtPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`px-3.5 py-2 rounded-lg font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                              isAdded
                                ? "bg-emerald-700 text-white"
                                : "bg-[#1A1412] hover:bg-[#D95D1E] text-white shadow-sm"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={13} className="text-white" />
                                <span>Added</span>
                              </>
                            ) : hasMultipleVariants ? (
                              <>
                                <ShoppingBag size={13} />
                                <span>Options</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={13} />
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
                  <p className="font-body text-sm">Hampers are currently being curated by our artisan team.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Variant Selector Drawer if multiple variants exist */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
