"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/data";

const slideUpBlur = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)", scale: 0.98 },
  show: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

export default function CuratedGiftHampers() {
  const hampers = PRODUCTS.filter((p) => p.category === "conscious-gifting");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth > 768 ? 400 : 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="w-full py-12 lg:py-16 overflow-hidden bg-[#FFF8F3]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">

        {/* ── Standardized Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-12 border-b border-[#E5E5E5] pb-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl tracking-tighter mb-4 leading-[0.85] text-[#111111]"
            >
              Curated <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Gift Hampers</span>
            </motion.h2>
            <p className="font-body text-base text-[#111111]/70 leading-relaxed font-medium">
               Fill them with conscious, handcrafted products that reflect your story
            </p>
          </div>
          
          {/* Carousel Arrows */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button 
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* ── Carousel Container ── */}
        <div className="relative group/carousel">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {hampers.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={i}
                variants={slideUpBlur}
                className="group bg-white border border-[#E5E5E5] hover:shadow-[0_20px_40px_rgba(107,112,92,0.06)] hover:border-[#FF6B00]/30 transition-all duration-500 flex flex-col w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-center sm:snap-start rounded-xl overflow-hidden"
              >
                {/* Image Header */}
                <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-sand">
                  <Image
                    src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                    alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.tags?.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-white/90 backdrop-blur-sm text-[#111111] px-3 py-1 font-body text-[9px] uppercase tracking-[0.2em] shadow-sm rounded-md">
                        {tag.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rich Text Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Artisan & Region Meta */}
                  {product.artisan && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#FF6B00]">
                      {product.artisan.region}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#E5E5E5]" />
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#6E6E6E]/60">
                      By {product.artisan.name}
                    </span>
                  </div>
                  )}

                  {/* Title */}
                  <Link href={`/products/${product.slug}`} className="block font-display text-2xl md:text-3xl text-[#111111] group-hover:text-[#FF6B00] transition-colors mb-3 leading-tight">
                    {product.name}
                  </Link>

                  {/* Descriptive Text Added Here */}
                  <p className="font-body text-[13px] text-[#555555] leading-relaxed mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Footer / Price & Action */}
                  <div className="mt-auto pt-6 border-t border-[#E5E5E5] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-body text-[16px] font-medium text-[#111111]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {product.compareAtPrice && (
                        <span className="font-body text-[12px] text-[#6E6E6E]/40 line-through mt-0.5">
                          ₹{product.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <Link 
                      href={`/products/${product.slug}`}
                      className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111111] border-b border-[#111111] pb-0.5 group-hover:text-[#FF6B00] group-hover:border-[#FF6B00] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
