"use client";

import Link from "next/link";
import { Sparkles, Feather, Gift, Recycle, ArrowRight } from "lucide-react";
import BespokeGiftsCatalogue from "./BespokeGiftsCatalogue";

export interface TrustPillar {
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  description: string;
}

const DEFAULT_PILLARS: TrustPillar[] = [
  {
    icon: Feather,
    title: "Handcrafted with Care",
    subtitle: "Ancestral Wooden Looms",
    description: "Every warp, weft, and motif is shaped by patient human hands, never high-speed mass industrial machinery.",
  },
  {
    icon: Sparkles,
    title: "Traditional Craft Heritage",
    subtitle: "Living Indigenous Knowledge",
    description: "Honoring wild Kosa silk rearing, natural vegetable dyes, and generations of sacred tribal art traditions.",
  },
  {
    icon: Gift,
    title: "Conscious Gifting",
    subtitle: "100% Plastic-Free",
    description: "Packed in handmade kraft paper and unbleached boxes, creating memorable keepsakes that honor the earth.",
  },
  {
    icon: Recycle,
    title: "Thoughtful Textile Reuse",
    subtitle: "Zero-Waste Remnants",
    description: "Handloom remnants and cutting scraps are lovingly transformed into heirloom toys, bookmarks, and accessories.",
  },
];

interface BrandTrustProps {
  pillars?: TrustPillar[];
}

export default function BrandTrust({ pillars = DEFAULT_PILLARS }: BrandTrustProps) {
  return (
    <section
      aria-label="Kauseyah Bespoke Gifting & Living Values"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#F7EFE8] border-b border-[#1A1412]/8"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">

        {/* ── Primary Hero Message: Bespoke Gifting ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D95D1E]/25 text-[#D95D1E] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-sm mb-4">
            <Gift size={13} className="text-[#D95D1E]" />
            <span>Bespoke &amp; Celebratory Gifting</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.08] tracking-tight mb-4">
            Discover Kauseyah <span className="text-[#851A36] italic font-light font-display">Bespoke Gifts</span>
          </h2>
          <div className="w-14 h-[1.5px] bg-[#D95D1E] mx-auto mb-5" />

          <p className="font-body text-sm sm:text-base lg:text-lg text-[#665D59] font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Thoughtfully curated gifts, personalized details and handcrafted keepsakes, created to make every celebration meaningful.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#851A36] text-white hover:bg-[#6e132b] transition-all duration-200 font-body text-xs sm:text-sm font-bold uppercase tracking-[0.18em] shadow-md hover:shadow-lg group"
            >
              <span>Contact Us</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <span className="font-body text-xs text-[#8C827A] font-light tracking-wide">
              Weddings · Corporate Curations · Personal Celebrations
            </span>
          </div>
        </div>

        {/* ── 9 Handcrafted Bespoke Products Catalogue ── */}
        <BespokeGiftsCatalogue />

        {/* ── Supporting Craft Values ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-16 mt-16 sm:mt-20 border-t border-[#1A1412]/10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-7 border border-[#1A1412]/8 hover:border-[#D95D1E]/30 transition-all duration-300 hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#D95D1E]/10 text-[#D95D1E] flex items-center justify-center mb-5">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl text-[#1A1412] font-semibold mb-1 leading-snug">
                    {pillar.title}
                  </h3>
                  <span className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#D95D1E] font-bold block mb-3">
                    {pillar.subtitle}
                  </span>
                  <p className="font-body text-xs sm:text-[13px] text-[#665D59] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
