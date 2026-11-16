"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Check,
  Pause,
  Play,
  Flame,
} from "lucide-react";
import { useCart } from "@/store/CartContext";
import ProductDetailDrawer from "./ProductDetailDrawer";

// Verified database records for the 5 hot sellers
const FALLBACK_HOT_SELLERS = [
  {
    id: "f5c73254-a4e9-4198-84f4-6c5da90752c4",
    name: "Handloom Kosa Silk Jacket for Men",
    slug: "premium-handloom-kosa-silk-jacket-men",
    price: 4588,
    compareAtPrice: undefined,
    subcategory: "Men Kosa Jackets",
    images: [
      {
        url: "https://ljdfvgvkzzjpugfxdhzk.supabase.co/storage/v1/object/public/product-images/slms29kcktk_1784616593866.jpg",
        alt: "Handloom Kosa Silk Jacket for Men",
        isPrimary: true,
      },
    ],
    variants: [],
    stock: 1,
    isAvailable: true,
  },
  {
    id: "fd321d30-c8a3-45fc-bfb9-0c7f05d7c36c",
    name: "Fabric Cover Journal with Handmade Unbleached Paper",
    slug: "journal",
    price: 315,
    compareAtPrice: undefined,
    subcategory: "Textile Journals",
    images: [
      {
        url: "https://ljdfvgvkzzjpugfxdhzk.supabase.co/storage/v1/object/public/product-images/6194751759e_1785426585281.png",
        alt: "Fabric Cover Journal with Handmade Unbleached Paper",
        isPrimary: true,
      },
    ],
    variants: [],
    stock: 4,
    isAvailable: true,
  },
  {
    id: "e9c08b85-4d15-4efd-801b-1d9f1ac2d7d9",
    name: "Muslin Cotton Saree Pouch (set of 3)",
    slug: "Saree organisers ",
    price: 315,
    compareAtPrice: undefined,
    subcategory: "Saree pouches",
    images: [
      {
        url: "https://ljdfvgvkzzjpugfxdhzk.supabase.co/storage/v1/object/public/product-images/99fdze0u7tp_1794468927295.jpeg",
        alt: "Muslin Cotton Saree Pouch",
        isPrimary: true,
      },
    ],
    variants: [],
    stock: 1,
    isAvailable: true,
  },
  {
    id: "39d0b75a-6e37-46fb-b629-32964201823b",
    name: "The Bhai Keepsake Hamper",
    slug: "ham",
    price: 2500,
    compareAtPrice: undefined,
    subcategory: "Gift Hampers",
    images: [
      {
        url: "https://ljdfvgvkzzjpugfxdhzk.supabase.co/storage/v1/object/public/product-images/gnq9ixb55r_1784273676087.jpg",
        alt: "The Bhai Keepsake Hamper",
        isPrimary: true,
      },
    ],
    variants: [],
    stock: 1,
    isAvailable: true,
  },
  {
    id: "39b71818-1b2d-4b15-b23d-b546da452cf1",
    name: "The Jingle Hamper",
    slug: "Christmas hamper",
    price: 899,
    compareAtPrice: undefined,
    subcategory: "Gift Hampers",
    images: [
      {
        url: "https://ljdfvgvkzzjpugfxdhzk.supabase.co/storage/v1/object/public/product-images/8axtacpfqle_1794472661321.jpeg",
        alt: "The Jingle Hamper",
        isPrimary: true,
      },
    ],
    variants: [],
    stock: 1,
    isAvailable: true,
  },
];

interface HandEmbroideredToysClientProps {
  products?: any[];
  toys?: any[];
}

export default function HandEmbroideredToysClient({
  products,
  toys,
}: HandEmbroideredToysClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Use passed products, or legacy toys, or fallback verified items
  const sourceProducts =
    products && products.length > 0
      ? products
      : toys && toys.length > 0
      ? toys
      : FALLBACK_HOT_SELLERS;

  // Ensure minimum items for ultra-smooth marquee looping on wide displays
  // Group A and Group B are identical, each with repeated items
  const baseSequence =
    sourceProducts.length < 10
      ? [...sourceProducts, ...sourceProducts]
      : sourceProducts;

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

    const variantToAdd =
      product.variants && product.variants.length > 0
        ? product.variants[0]
        : { id: `${product.id}-default`, stock: product.stock ?? 10, price: product.price };

    addItem(product, variantToAdd);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const renderProductCard = (product: any, idxKey: string) => {
    const primaryImg =
      product.images?.find((img: any) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "/images/placeholder.png";

    const isAdded = addedId === product.id;
    const hasMultipleVariants = product.variants && product.variants.length > 1;

    const hasDiscount =
      typeof product.compareAtPrice === "number" &&
      product.compareAtPrice > product.price;

    const discountPct = hasDiscount
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;

    const cleanSlug = encodeURIComponent((product.slug || "").trim());

    return (
      <article
        key={idxKey}
        className="group w-[260px] sm:w-[280px] lg:w-[300px] shrink-0 flex flex-col bg-[#FFF9F4] rounded-2xl border border-[#1A1412]/8 hover:border-[#D95D1E]/40 hover:shadow-[0_16px_36px_rgba(26,20,18,0.08)] transition-all duration-300 overflow-hidden"
      >
        {/* Portrait Image Container */}
        <Link
          href={`/products/${cleanSlug}`}
          className="relative w-full aspect-[4/5] overflow-hidden bg-[#FAF4ED] block"
        >
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 35vw, 300px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges: Discount percentage badge or Hot Seller badge */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
            {discountPct !== null ? (
              <span className="px-2.5 py-1 rounded-full bg-[#851A36] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {discountPct}% Off
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D95D1E] text-white text-[9.5px] font-bold uppercase tracking-wider shadow-sm">
                <Flame size={10} className="fill-white" />
                <span>Hot Seller</span>
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="bg-white/95 backdrop-blur-md text-[#1A1412] px-2.5 py-1 rounded-md font-body text-[9px] uppercase tracking-[0.16em] font-bold shadow-xs border border-[#1A1412]/6">
              Now on Sale
            </span>
          </div>
        </Link>

        {/* Body Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <span className="font-body text-[10px] tracking-[0.18em] text-[#D95D1E] uppercase font-semibold mb-1">
            {product.subcategory || "Curated Craft"}
          </span>

          <Link
            href={`/products/${cleanSlug}`}
            className="font-display text-base sm:text-lg text-[#1A1412] group-hover:text-[#D95D1E] transition-colors leading-snug line-clamp-1 mb-2 font-medium"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Price & Quick Add Button */}
          <div className="mt-auto pt-3 border-t border-[#1A1412]/8 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-body text-base sm:text-lg font-bold text-[#1A1412]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="font-body text-xs text-[#8C827A] line-through font-normal">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => handleQuickAdd(e, product)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isAdded
                  ? "bg-emerald-700 text-white"
                  : "bg-[#1A1412] hover:bg-[#D95D1E] text-white shadow-sm"
              }`}
              aria-label={`Add ${product.name} to cart`}
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
      </article>
    );
  };

  return (
    <section
      aria-label="Discover Our Hot Sellers — Now on Sale"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#F7EFE8] border-b border-[#1A1412]/8 overflow-hidden relative"
    >
      {/* Scoped Marquee Animation Styles */}
      <style>{`
        @keyframes kauseyahMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .hot-sellers-marquee {
          display: flex;
          width: max-content;
          animation: kauseyahMarquee 32s linear infinite;
          will-change: transform;
        }
        .hot-sellers-marquee:hover,
        .hot-sellers-marquee:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .hot-sellers-marquee {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* ── Stationary Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-xs">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Limited-Batch Craft Curations
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05] tracking-tight">
              Discover Our Hot Sellers —{" "}
              <span className="text-[#D95D1E] italic font-light font-display">
                Now on Sale
              </span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />

            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Our most cherished handcrafted heirlooms, festival hampers, and living textiles —
              woven with heritage integrity and available for celebratory gifting.
            </p>
          </div>

          {/* Stationary Navigation & Marquee Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors pr-2"
            >
              <span>Explore All Products</span>
              <ArrowRight size={13} />
            </Link>

            <div className="h-4 w-[1px] bg-[#1A1412]/15 hidden sm:block" />

            {/* Play/Pause Toggle for Marquee */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume carousel animation" : "Pause carousel animation"}
              className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer bg-white/70"
            >
              {isPaused ? <Play size={14} className="translate-x-[1px]" /> : <Pause size={14} />}
            </button>

            {/* Manual Nudge Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer bg-white/70"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer bg-white/70"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Seamless Horizontal Marquee Track ── */}
      <div className="relative w-full overflow-hidden">
        {/* Luxury Edge Gradient Masks (Desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[#F7EFE8] to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[#F7EFE8] to-transparent z-10"
        />

        {/* Scroll Container with Touch/Mobile Manual Scroll & Seamless CSS Marquee */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto sm:overflow-hidden pb-6 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="hot-sellers-marquee"
            style={{ animationPlayState: isPaused ? "paused" : undefined }}
          >
            {/* Group 1 (Primary track) */}
            <div className="flex gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0">
              {baseSequence.map((product, idx) =>
                renderProductCard(product, `hot-seller-g1-${product.id}-${idx}`)
              )}
            </div>

            {/* Group 2 (Exact duplicate for 100% seamless infinite loop) */}
            <div
              className="flex gap-5 sm:gap-6 pr-5 sm:pr-6 shrink-0"
              aria-hidden="true"
            >
              {baseSequence.map((product, idx) =>
                renderProductCard(product, `hot-seller-g2-${product.id}-${idx}`)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Bottom CTA & Customization Note */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3.5">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-[#1A1412] hover:bg-[#D95D1E] text-white px-8 py-3.5 rounded-sm font-body text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:-translate-y-0.5 min-h-[48px]"
          >
            <span>Explore All Hot Sellers &amp; Gifts</span>
            <ArrowRight size={14} />
          </Link>

          {/* Visually subtle customization note */}
          <p className="font-body text-xs sm:text-[13px] text-[#665D59] font-light text-center max-w-lg leading-relaxed">
            Looking for bulk orders or a different design?{" "}
            <Link
              href="/contact"
              className="text-[#851A36] hover:text-[#D95D1E] font-medium underline underline-offset-4 decoration-[#851A36]/30 hover:decoration-[#D95D1E] transition-colors"
            >
              Get in touch
            </Link>{" "}
            with us for customization options.
          </p>
        </div>
      </div>

      {/* Variant Selector Drawer if product has variants */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
