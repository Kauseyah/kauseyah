"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, HeartHandshake, Sparkles, Feather } from "lucide-react";

export interface BrandStoryProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  leadParagraph?: string;
  bodyParagraph?: string;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  pillars?: Array<{
    title: string;
    description: string;
  }>;
  primaryImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  originBadge?: {
    title: string;
    subtitle: string;
  };
  ctaText?: string;
  ctaLink?: string;
}

const DEFAULT_BRAND_STORY: BrandStoryProps = {
  eyebrow: "The Kauseyah Philosophy",
  title: "Rooted in Tribes,",
  highlight: "Crafted by Hand",
  leadParagraph:
    "Kauseyah is a conscious design initiative born out of the dense forests, red soil, and sacred handloom clusters of Chhattisgarh.",
  bodyParagraph:
    "Founded by fashion designer and craft researcher Shweta Rao, we collaborate directly with rural handloom weavers, women artisan collectives, and tribal craftspeople. By reviving wild Kosa silk rearing, natural fibres, and zero-waste fabric upcycling into contemporary silhouettes, we ensure centuries-old knowledge thrives in everyday living.",
  quote: {
    text: "“Every thread carries a living memory, every motif a sacred prayer.”",
    author: "Shweta Rao",
    role: "Founder & Craft Researcher",
  },
  pillars: [
    {
      title: "Grassroot Partnerships",
      description:
        "Direct collaboration with rural weaver families and artisan collectives, honoring the dignity of handmade craft.",
    },
    {
      title: "Indigenous Knowledge",
      description:
        "Preserving traditional wooden pit-looms, wild tussar silks, and the living heritage of tribal arts.",
    },
    {
      title: "Conscious Creation",
      description:
        "Mindful production in small artisanal batches, transforming textile remnants into zero-waste keepsakes.",
    },
  ],
  primaryImage: {
    src: "/images/artesian/image12.jpg",
    alt: "Women artisans in authentic handloom workshop in Chhattisgarh",
  },
  secondaryImage: {
    src: "/images/artesian/image2.jpg",
    alt: "Artisan hand weaving vivid red ikat cloth on traditional loom",
  },
  originBadge: {
    title: "Grassroot · Local · Indigenous",
    subtitle: "Chhattisgarh Heritage",
  },
  ctaText: "Discover Our Story",
  ctaLink: "/about",
};

export default function WhoWeAre(props: BrandStoryProps) {
  const content = { ...DEFAULT_BRAND_STORY, ...props };
  const pillars = content.pillars || DEFAULT_BRAND_STORY.pillars!;

  return (
    <section
      aria-label="Brand Story and Artisan Philosophy"
      className="w-full bg-[#FFF9F4] py-16 sm:py-20 lg:py-28 overflow-hidden border-b border-[#1A1412]/8"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ── Top Editorial Eyebrow & Philosophy Pull-Quote ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-20 items-end">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 sm:mb-4 shadow-sm">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span className="font-body text-[10.5px] sm:text-xs font-bold tracking-[0.22em] uppercase">
                {content.eyebrow}
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#1A1412] leading-[1.04] tracking-tight">
              {content.title} <br className="hidden sm:inline" />
              <span className="text-[#D95D1E] italic font-light font-display">
                {content.highlight}
              </span>
            </h2>
          </div>

          {/* Pull-Quote Column */}
          {content.quote && (
            <div className="lg:col-span-5 pl-4 sm:pl-6 lg:pl-8 border-l-2 border-[#D95D1E]/30">
              <p className="font-display text-xl sm:text-2xl lg:text-3xl italic text-[#1A1412] leading-snug">
                {content.quote.text}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#D95D1E]" />
                <p className="font-body text-xs tracking-[0.18em] text-[#665D59] uppercase font-medium">
                  {content.quote.author} &mdash; <span className="text-[#1A1412] font-semibold">{content.quote.role}</span>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* ── Main Editorial Split: Visual Storytelling + Brand Narrative ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left: Authentic Artisan Workshop Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] w-full overflow-hidden rounded-2xl bg-[#F7EFE8] border border-[#1A1412]/8 shadow-[0_16px_40px_rgba(26,20,18,0.08)]">
              {content.primaryImage && (
                <Image
                  src={content.primaryImage.src}
                  alt={content.primaryImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-103"
                  priority={false}
                />
              )}
              {/* Natural gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle textile texture detail label */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 text-white pointer-events-none">
                <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">
                  Living Handloom Traditions
                </p>
                <p className="font-display text-lg sm:text-xl font-normal text-white">
                  Artisan Cluster · Chhattisgarh
                </p>
              </div>
            </div>

            {/* Overlapping Detail Crop (Hand on Loom) */}
            {content.secondaryImage && (
              <div className="hidden sm:block absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 w-44 md:w-56 h-44 md:h-56 rounded-xl overflow-hidden border-4 border-[#FFF9F4] shadow-2xl bg-[#F7EFE8] z-20">
                <Image
                  src={content.secondaryImage.src}
                  alt={content.secondaryImage.alt}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            )}

            {/* Grassroots Origin Badge */}
            {content.originBadge && (
              <div className="absolute top-4 left-4 sm:-top-5 sm:-left-5 bg-[#851A36] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl shadow-lg border border-white/20 z-20">
                <p className="font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A359]">
                  {content.originBadge.title}
                </p>
                <p className="font-display text-base sm:text-lg text-white font-medium">
                  {content.originBadge.subtitle}
                </p>
              </div>
            )}
          </div>

          {/* Right: Editorial Narrative & Brand Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Lead Story Paragraph */}
            <p className="font-body text-base sm:text-lg text-[#1A1412] leading-relaxed mb-4 font-normal">
              {content.leadParagraph}
            </p>

            {/* Supporting Story Paragraph */}
            <p className="font-body text-sm sm:text-base text-[#665D59] leading-relaxed mb-8 font-light">
              {content.bodyParagraph}
            </p>

            {/* Authentic Brand Pillars */}
            <div className="space-y-4 pt-4 pb-6 mb-8 border-y border-[#1A1412]/10">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[#D95D1E]/10 text-[#D95D1E] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D95D1E]" />
                  </div>
                  <div>
                    <h4 className="font-body text-xs sm:text-sm font-bold tracking-[0.1em] uppercase text-[#1A1412]">
                      {pillar.title}
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed mt-0.5">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Story CTA Link */}
            <div>
              <Link
                href={content.ctaLink || "/about"}
                className="inline-flex items-center justify-center gap-3 bg-[#1A1412] hover:bg-[#D95D1E] text-white px-7 py-4 rounded-sm font-body text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:-translate-y-0.5 min-h-[48px]"
              >
                <span>{content.ctaText || "Discover Our Story"}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
