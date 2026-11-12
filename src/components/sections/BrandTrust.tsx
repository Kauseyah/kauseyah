"use client";

import { Sparkles, Feather, Gift, Recycle } from "lucide-react";

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
      aria-label="Kauseyah Core Craft Values"
      className="w-full py-14 sm:py-16 lg:py-20 bg-[#F7EFE8] border-b border-[#1A1412]/8"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-sm mb-3">
            Our Living Promise
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1A1412] tracking-tight">
            Rooted in <span className="text-[#851A36] italic font-light">Integrity & Tradition</span>
          </h2>
          <div className="w-12 h-0.5 bg-[#D95D1E] mx-auto mt-3" />
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
