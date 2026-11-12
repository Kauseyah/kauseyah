"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface CategoryCardData {
  id: string;
  name: string;
  tagline: string;
  href: string;
  image: string;
  count?: number;
}

interface ShopCategoriesClientProps {
  categories: CategoryCardData[];
}

export default function ShopCategoriesClient({ categories }: ShopCategoriesClientProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section 
      aria-label="Curated Categories Discovery"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#FFF9F4] border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="font-body text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#D95D1E] uppercase mb-2 sm:mb-3">
            Handcrafted With Meaning
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-tight mb-3">
            Curated <span className="text-[#D95D1E] italic font-light">Collections</span>
          </h2>
          <div className="w-12 h-[1.5px] bg-[#D95D1E] mb-4" />
          <p className="font-body text-sm sm:text-base text-[#665D59] font-light max-w-lg leading-relaxed">
            From rural loom benches to your wardrobe — explore authentic handloom weaves, upcycled textile toys, and ethical tribal gifts.
          </p>
        </div>

        {/* Categories Grid (Mobile: Horizontal Swipe Rail; Tablet: 3 cols; Desktop: 6 cols) */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="w-[68vw] sm:w-auto shrink-0 snap-start"
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-white border border-[#1A1412]/8 hover:border-[#D95D1E]/40 hover:shadow-[0_12px_28px_rgba(217,93,30,0.10)] transition-all duration-300 h-full"
              >
                {/* Image Aspect Box */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F7EFE8] mb-3.5">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 220px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#1A1412]/5 group-hover:bg-transparent transition-colors duration-300" />
                  
                  {/* Subtle top-right arrow badge */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm text-[#1A1412] group-hover:bg-[#D95D1E] group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Category Titles */}
                <h3 className="font-display text-xl sm:text-2xl text-[#1A1412] group-hover:text-[#D95D1E] transition-colors leading-snug mb-1">
                  {cat.name}
                </h3>
                
                <p className="font-body text-xs text-[#665D59] font-light leading-normal line-clamp-1">
                  {cat.tagline}
                </p>

                {typeof cat.count === "number" && cat.count > 0 && (
                  <span className="mt-2.5 inline-block text-[10px] font-body font-semibold tracking-wider uppercase text-[#D95D1E]/80 bg-[#D95D1E]/10 px-2 py-0.5 rounded-full">
                    {cat.count} Items
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

