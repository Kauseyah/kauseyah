"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import React from "react";

export interface LifestyleCardItem {
  id: string;
  tag: string;
  title: string;
  description?: string;
  image: string;
  href: string;
  gridSpan: string;
  imagePosition?: string;
}

export interface LifestyleGalleryClientProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  cards: LifestyleCardItem[];
}

export default function LifestyleGalleryClient({
  eyebrow = "Lifestyle & Craft Edit",
  title = "Curated for",
  highlight = "Modern Living",
  description = "From rural weavers' loom benches to contemporary festive wardrobes. Explore authentic collections that seamlessly bridge indigenous craft with everyday grace.",
  cards,
}: LifestyleGalleryClientProps) {
  return (
    <section
      aria-label="Editorial Lifestyle and Craft Collections"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#F7EFE8] border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <p className="font-body text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#D95D1E] uppercase mb-2 sm:mb-3">
              {eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05] tracking-tight">
              {title} <span className="text-[#D95D1E] italic font-light font-display">{highlight}</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />
            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              {description}
            </p>
          </div>

          <div className="hidden md:block text-right">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors"
            >
              <span>Explore All Collections</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Asymmetric Editorial Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                className={`${card.gridSpan} relative rounded-2xl overflow-hidden bg-[#FFF9F4] border border-[#1A1412]/8 group hover:border-[#D95D1E]/40 hover:shadow-[0_20px_48px_rgba(26,20,18,0.12)] transition-all duration-500`}
              >
                <Link
                  href={card.href}
                  className="block w-full h-full relative focus:outline-none focus:ring-2 focus:ring-[#D95D1E] focus:ring-offset-2 rounded-2xl"
                  aria-label={`${card.title} - ${card.tag}`}
                >
                  {/* Photo Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      style={{ objectPosition: card.imagePosition || "center" }}
                    />
                  </div>

                  {/* Natural Vignette Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/92 via-[#1A1412]/35 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 p-6 sm:p-8 lg:p-9 flex flex-col justify-end text-white">
                    {/* Category Eyebrow Tag */}
                    <div className="mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-sm bg-white/15 backdrop-blur-md border border-white/20 font-body text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] text-[#D4A359] uppercase">
                        {card.tag}
                      </span>
                    </div>

                    {/* Title & Floating Arrow Action */}
                    <div className="flex items-end justify-between gap-4">
                      <div className="max-w-[85%]">
                        <h3 className="font-display text-2xl sm:text-3xl lg:text-[32px] text-white leading-tight tracking-tight group-hover:text-[#FFF9F4] transition-colors">
                          {card.title}
                        </h3>
                        {card.description && (
                          <p className="font-body text-xs sm:text-sm text-white/80 font-light leading-relaxed mt-2 line-clamp-2">
                            {card.description}
                          </p>
                        )}
                      </div>

                      {/* Pill Arrow Button */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 group-hover:bg-[#D95D1E] group-hover:border-[#D95D1E] transition-all duration-300 shadow-md">
                        <ArrowUpRight
                          size={18}
                          className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Footer Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors py-2"
          >
            <span>Explore All Collections</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
