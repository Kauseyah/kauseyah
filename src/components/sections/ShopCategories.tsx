"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SHOP_CATEGORY_GROUPS, BRAND_TAGLINE } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const CATEGORY_ACCENTS: Record<string, string> = {
  handlooms: "#FF6B00",
  jewellery: "#FF8100",
  "home-living": "#111111",
  "conscious-gifting": "#111111",
  "tribal-crafts": "#FF6B00",
  upcycled: "#FFB347",
};

export default function ShopCategories() {
  return (
    <section className="w-full pt-12 lg:pt-16 pb-12 lg:pb-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF8F3 0%, #FFFFFF 50%, #FFF8F3 100%)' }}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">

        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12 max-w-4xl mx-auto">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            Shop the <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Anthology</span>
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
             From the loom to your doorstep — ethically made, indigenously crafted treasures.
          </p>
        </div>

        {/* ── Category Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_CATEGORY_GROUPS.map((group, i) => {
             
            const accent = CATEGORY_ACCENTS[group.id] ?? "#FF6B00";
            return (
              <motion.div
                key={group.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i}
                variants={fadeUp}
              >
                <Link
                  href={group.href}
                  className="group relative flex flex-col rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#FF6B00]/40 hover:shadow-[0_12px_40px_rgba(107,112,92,0.08)] transition-all duration-400 p-8 min-h-[260px] overflow-hidden"
                >
                  {/* Top accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: accent }}
                  />

                  {/* Arrow */}
                  <div className="flex items-start justify-end mb-6">
                    <span className="w-9 h-9 rounded-full border border-[#E5E5E5] flex items-center justify-center group-hover:border-[#FF6B00]/50 group-hover:bg-[#FF6B00]/5 transition-all duration-300">
                      <ArrowRight
                        size={16}
                        className="text-[#111111]/30 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all duration-300"
                      />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-auto">
                    <h3 className="font-display text-2xl lg:text-3xl text-[#111111] mb-2.5 group-hover:text-[#FF6B00] transition-colors duration-300">
                      {group.label}
                    </h3>
                    <p className="font-body text-[14px] text-[#111111]/65 mb-6 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Sub-item pills */}
                    <div className="flex flex-wrap gap-2">
                      {group.items.slice(0, 4).map((item) => (
                        <span
                          key={item.href}
                          className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-white border border-[#E5E5E5] text-[#111111]/60 group-hover:border-[#111111]/30 group-hover:text-[#111111] transition-all duration-300"
                        >
                          {item.label}
                        </span>
                      ))}
                      {group.items.length > 4 && (
                        <span
                          className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border transition-all duration-300"
                          style={{
                            borderColor: `${accent}35`,
                            color: accent,
                            backgroundColor: `${accent}08`,
                          }}
                        >
                          +{group.items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── View All CTA ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={7}
          className="flex justify-center mt-14"
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 rounded-full bg-[#111111] text-white px-10 py-4 font-body text-[11px] tracking-[0.25em] uppercase hover:bg-[#FF8100] transition-all duration-300 shadow-[0_4px_20px_rgba(31,33,26,0.15)]"
          >
            Explore All Collections
            <ArrowRight size={14} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
