"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, ExternalLink, Sparkles, Newspaper } from "lucide-react";

export interface EditorialArticle {
  id: string;
  publication: string;
  publicationType: string;
  articleTitle: string;
  displayTitle: string;
  publicationDate?: string;
  summary: string;
  url: string;
  ctaText: string;
  image?: string;
  category: "press" | "editorial" | "spotlight";
}

export interface NationalRecognitionAward {
  awardTitle: string;
  initiative: string;
  venue: string;
  location: string;
  date: string;
  presentedBy: {
    name: string;
    designation: string;
  };
  dignitaries: {
    name: string;
    designation: string;
  }[];
  description: string;
  image: string;
}

export interface BrandFeature {
  id: string;
  source: string;
  title: string;
  context: string;
  date?: string;
  image?: string;
  url?: string;
  badge: string;
}

const DEFAULT_AWARD: NationalRecognitionAward = {
  awardTitle: "Certificate of Excellence for Crafts & Tribal Empowerment",
  initiative: "National Traders & Artisans Convention (Naari Vandan)",
  venue: "Bharat Mandapam",
  location: "Pragati Maidan, New Delhi",
  date: "August 2023",
  presentedBy: {
    name: "Smt. Smriti Zubin Irani",
    designation: "Union Cabinet Minister & Senior National Leader",
  },
  dignitaries: [
    {
      name: "Shri Praveen Khandelwal",
      designation: "Hon’ble Member of Parliament & Secretary General, CAIT",
    },
    {
      name: "Shri B.C. Bhartia",
      designation: "National President, Confederation of All India Traders (CAIT)",
    },
  ],
  description:
    "Presented at Bharat Mandapam, New Delhi, in formal recognition of Kauseyah's dedicated grassroots initiative in reviving Chhattisgarh's indigenous Kosa silk, empowering rural women master weavers, and preserving traditional pit-loom weaving heritage.",
  image: "/images/winner.jpeg",
};

const DEFAULT_ARTICLES: EditorialArticle[] = [
  {
    id: "amazon-karigar-2022",
    publication: "About Amazon India",
    publicationType: "Small Business Spotlight",
    articleTitle: "Karigar: Empowering weavers and artisans for selling online",
    displayTitle: "Bringing Chhattisgarh's Handloom Heritage to a Wider Audience",
    publicationDate: "17 October 2022",
    summary:
      "Amazon India's spotlight featured founder Shweta Rao and Kauseyah for reviving traditional handloom Kosa silk from Chhattisgarh, utilizing leftover fabric remnants, and opening direct digital pathways for rural artisans.",
    url: "https://www.aboutamazon.in/news/small-business/karigar-empowering-weavers-and-artisans-for-selling-online",
    ctaText: "Read the Story",
    image: "/images/achivements/Featured on amazon blog page.jpg",
    category: "editorial",
  },
  {
    id: "brown-living-story",
    publication: "Brown Living",
    publicationType: "Unstoppable Changemakers",
    articleTitle: "A Zero-Waste Dream United with the Artistry of Indian Handlooms: The Kauseyah Story",
    displayTitle: "A Zero-Waste Vision Rooted in Indian Handlooms",
    publicationDate: "Changemakers Feature",
    summary:
      "An in-depth editorial chronicling Shweta Rao's journey in marrying zero-waste sustainable philosophy with authentic handloom craft, working alongside rural weaving communities to transform fabric remnants into conscious treasures.",
    url: "https://brownliving.in/blogs/unstoppable-changemakers/the-kauseyah-story-when-shwetas-zero-waste-dream-united-with-the-artistry-of-indian-handlooms",
    ctaText: "Read the Story",
    image: "/images/artesian/image3.png",
    category: "editorial",
  },
];

const DEFAULT_BRAND_FEATURES: BrandFeature[] = [
  {
    id: "smriti-irani-narisekharidari",
    source: "Official Social Feature by Smt. Smriti Irani",
    badge: "Government & National Spotlight",
    title: "Advocating for Indigenous Women Artisans (#narisekharidari)",
    context:
      "Officially featured on Smt. Smriti Irani's verified social channels under the #narisekharidari campaign, spotlighting Kauseyah's handcrafted potli bags and celebrating authentic woman-led grassroots enterprise.",
    date: "National Handloom Advocacy",
    image: "/images/achivements/Featured by Smriti Irani Ji on her social account.jpeg",
  },
  {
    id: "cluster-storytelling",
    source: "Grassroots Craft Advocacy",
    badge: "Artisan Partnership Story",
    title: "Documenting Living Pit-Loom Traditions in Bastar",
    context:
      "Featured across cultural platforms for documenting the slow, meditative craft of pit-loom weaving, wild tussar cocoon boiling, and direct community partnerships with traditional weaver families.",
    date: "Living Heritage",
    image: "/images/artesian/image2.jpg",
  },
];

interface FeaturedInProps {
  award?: NationalRecognitionAward;
  articles?: EditorialArticle[];
  brandFeatures?: BrandFeature[];
}

export default function FeaturedIn({
  award = DEFAULT_AWARD,
  articles = DEFAULT_ARTICLES,
  brandFeatures = DEFAULT_BRAND_FEATURES,
}: FeaturedInProps) {
  return (
    <div className="w-full bg-[#FFF9F4] text-[#1A1412]">

      {/* ══════════════════════════════════════════════════════════════
          1. SECTION B — NATIONAL RECOGNITION (VERIFIED AWARDS)
         ══════════════════════════════════════════════════════════════ */}
      <section
        aria-label="National Recognition and Awards"
        className="w-full py-16 sm:py-20 lg:py-24 bg-[#F7EFE8] border-y border-[#1A1412]/8"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

          {/* Eyebrow & Header */}
          <div className="text-center mb-10 sm:mb-14 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D95D1E] text-white text-[11px] sm:text-xs font-semibold tracking-widest uppercase shadow-sm">
              <Award size={14} className="text-white" />
              <span>National Recognition</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display text-[#1A1412] leading-[1.15] tracking-tight">
              {award.awardTitle}
            </h2>

            <p className="text-xs sm:text-sm font-body tracking-[0.18em] uppercase text-[#851A36] font-semibold">
              {award.initiative} · {award.venue}, {award.location}
            </p>

            <div className="w-14 h-0.5 bg-[#D95D1E] mx-auto mt-4" />
          </div>

          {/* Award Editorial Feature Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">

            {/* Real Award Photograph with Verified Frame */}
            <div className="lg:col-span-7 relative">
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[#1A1412]">
                <Image
                  src={award.image}
                  alt="Kauseyah Founder receiving the Certificate of Excellence at Bharat Mandapam, New Delhi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-top"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 border border-white/30">
                    Official Presentation · {award.date}
                  </span>
                  <p className="font-display text-base sm:text-xl font-light italic">
                    Bharat Mandapam, Pragati Maidan, New Delhi
                  </p>
                </div>
              </div>
            </div>

            {/* Factual Narrative & Dignitaries */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[#1A1412]/8 shadow-sm">
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#D95D1E] block mb-2">
                  Formal Felicitation
                </span>

                <h3 className="font-display text-xl sm:text-2xl text-[#1A1412] font-semibold mb-3 leading-snug">
                  Presented by {award.presentedBy.name}
                </h3>

                <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed mb-6">
                  {award.description}
                </p>

                {/* Dignitaries Present */}
                <div className="pt-4 border-t border-[#1A1412]/8 space-y-3">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#851A36] block">
                    In the Distinguished Presence of:
                  </span>

                  {award.dignitaries.map((dig, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="font-display text-sm sm:text-base text-[#1A1412] font-semibold">
                        {dig.name}
                      </span>
                      <span className="font-body text-[11px] text-[#665D59] font-light">
                        {dig.designation}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. SECTION A — FEATURED IN (EDITORIAL & MEDIA PUBLICATIONS)
         ══════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Editorial Media Coverage and Publications"
        className="w-full py-16 sm:py-20 lg:py-24 border-b border-[#1A1412]/8"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 max-w-5xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-sm">
                <Newspaper size={12} className="text-[#D95D1E]" />
                <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                  Editorial & Press
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.08] tracking-tight">
                Recognised <span className="text-[#851A36] italic font-light">Beyond Our Roots</span>
              </h2>
              <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />

              <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed max-w-2xl">
                Stories of craftsmanship, conscious design, and Chhattisgarh&apos;s living textile heritage — shared through platforms that celebrate meaningful work.
              </p>
            </div>
          </div>

          {/* Editorial Articles Grid (Verified URLs Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {articles.map((art) => (
              <article
                key={art.id}
                className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1412]/8 hover:border-[#D95D1E]/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Publication Tag & Date */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1A1412]/8">
                    <span className="font-body text-xs font-bold uppercase tracking-[0.16em] text-[#D95D1E]">
                      {art.publication}
                    </span>
                    {art.publicationDate && (
                      <span className="font-body text-[11px] text-[#665D59] font-light">
                        {art.publicationDate}
                      </span>
                    )}
                  </div>

                  {/* Original Article Reference */}
                  <span className="font-body text-[11px] text-[#851A36] font-medium block mb-2 italic">
                    Original Feature: &ldquo;{art.articleTitle}&rdquo;
                  </span>

                  {/* Display Card Headline */}
                  <h3 className="font-display text-2xl sm:text-3xl text-[#1A1412] font-semibold mb-3 leading-snug group-hover:text-[#D95D1E] transition-colors">
                    {art.displayTitle}
                  </h3>

                  {/* Factual Summary */}
                  <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed mb-6">
                    {art.summary}
                  </p>
                </div>

                {/* Direct Verified CTA Link */}
                <div className="pt-4 border-t border-[#1A1412]/8">
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors cursor-pointer group/link"
                    aria-label={`${art.ctaText} on ${art.publication} (opens in a new tab)`}
                  >
                    <span>{art.ctaText}</span>
                    <ExternalLink size={13} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. SECTION C — BRAND FEATURES & SOCIAL ADVOCACY
         ══════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Brand Features and Social Advocacy"
        className="w-full py-16 sm:py-20 lg:py-24 bg-[#FFFDFB] border-b border-[#1A1412]/8"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">

          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-sm mb-3">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span>Advocacy & Features</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] tracking-tight">
              Voices Celebrating <span className="text-[#851A36] italic font-light">The Craft</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mx-auto mt-3" />
          </div>

          {/* 2-Card Editorial Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch">
            {brandFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1412]/8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {feat.image && (
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-[#1A1412]/8 bg-[#F7EFE8]">
                      <Image
                        src={feat.image}
                        alt={feat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-[#D95D1E]">
                      {feat.badge}
                    </span>
                    {feat.date && (
                      <span className="font-body text-[11px] text-[#665D59] font-light">
                        {feat.date}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl text-[#1A1412] font-semibold mb-2 leading-snug">
                    {feat.title}
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed">
                    {feat.context}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1A1412]/8 flex items-center justify-between">
                  <span className="font-body text-[11px] text-[#851A36] font-medium">
                    {feat.source}
                  </span>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-[#1A1412] hover:text-[#D95D1E] transition-colors"
                  >
                    <span>Our Journey</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}