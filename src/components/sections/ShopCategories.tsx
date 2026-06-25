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
  handlooms: "#C8892A",
  jewellery: "#8B5E7A",
  "home-living": "#5A7A5A",
  "conscious-gifting": "#C85A2A",
  "tribal-crafts": "#2A5A8B",
  upcycled: "#6B7A3A",
};

export default function ShopCategories() {
  return (
    <section className="w-full bg-[#FAF8F5] pt-36 lg:pt-44 pb-24 lg:pb-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-10 lg:px-20">

        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 border-b border-[#E8E0D4] pb-12"
        >
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-4 mb-5">
            <span className="w-8 h-px bg-[#C8892A]" />
            <span className="font-body text-[11px] tracking-[0.35em] text-[#C8892A] uppercase font-semibold">
              {BRAND_TAGLINE}
            </span>
          </motion.div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0D0603]"
            >
              Shop Now
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-body text-[15px] text-[#2C1810]/70 max-w-sm leading-relaxed lg:text-right"
            >
              From the loom to your doorstep — ethically made, indigenously crafted, consciously chosen.
            </motion.p>
          </div>
        </motion.div>

        {/* ── Category Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_CATEGORY_GROUPS.map((group, i) => {
            const accent = CATEGORY_ACCENTS[group.id] ?? "#C8892A";
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
                  className="group relative flex flex-col rounded-2xl bg-white border border-[#E8E0D4] hover:border-[#C8892A]/40 hover:shadow-[0_12px_40px_rgba(80,45,15,0.08)] transition-all duration-400 p-8 min-h-[260px] overflow-hidden"
                >
                  {/* Top accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: accent }}
                  />

                  {/* Arrow */}
                  <div className="flex items-start justify-end mb-6">
                    <span className="w-9 h-9 rounded-full border border-[#E8E0D4] flex items-center justify-center group-hover:border-[#C8892A]/50 group-hover:bg-[#C8892A]/5 transition-all duration-300">
                      <ArrowRight
                        size={16}
                        className="text-[#0D0603]/30 group-hover:text-[#C8892A] group-hover:translate-x-0.5 transition-all duration-300"
                      />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-auto">
                    <h3 className="font-display text-2xl lg:text-3xl text-[#0D0603] mb-2.5 group-hover:text-[#6B2D0A] transition-colors duration-300">
                      {group.label}
                    </h3>
                    <p className="font-body text-[14px] text-[#2C1810]/65 mb-6 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Sub-item pills */}
                    <div className="flex flex-wrap gap-2">
                      {group.items.slice(0, 4).map((item) => (
                        <span
                          key={item.href}
                          className="font-body text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E0D4] text-[#2C1810]/60 group-hover:border-[#C8892A]/25 group-hover:text-[#2C1810]/80 transition-all duration-300"
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
            className="inline-flex items-center gap-3 rounded-full bg-[#0D0603] text-white px-10 py-4 font-body text-[11px] tracking-[0.25em] uppercase hover:bg-[#6B2D0A] transition-all duration-300 shadow-[0_4px_20px_rgba(13,6,3,0.15)]"
          >
            Explore All Collections
            <ArrowRight size={14} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
