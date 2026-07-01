"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CountUp } from "@/components/CountUp";

const WHO_WE_ARE_STATS = [
  { value: 100, suffix: "%", label: "Ethically Sourced" },
  { value: 12, suffix: "+", label: "Indigenous Crafts" },
  { value: 1000, suffix: "+", label: "Customers" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  show: (i = 0) => ({
    opacity: 1, x: 0, transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  show: (i = 0) => ({
    opacity: 1, x: 0, transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function WhoWeAre() {
  return (
    <section className="w-full bg-[#FFF8F3] py-12 lg:py-16 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">

        {/* ── Top row: Eyebrow + Heading + Pull-quote ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-10 items-end">

          {/* Heading column */}
          <div className="max-w-4xl">

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
            >
              Who <span className="text-[#FF6B00] italic font-light drop-shadow-sm">We Are</span>
            </motion.h2>
          </div>

          {/* Pull-quote column */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            className="pl-4 lg:pl-8 border-l-2 border-[#FF6B00]/30"
          >
            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="font-display text-3xl md:text-4xl italic text-[#111111] leading-[1.5]"
            >
              &ldquo;Every thread carries a story,<br />every pattern a prayer.&rdquo;
            </motion.p>
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="mt-6"
            >
              <div className="w-8 h-px bg-[#FF6B00] mb-2" />
              <p className="font-body text-[11px] tracking-[0.25em] text-[#FF6B00] font-medium uppercase">The Kauseyah Philosophy</p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Main content: Image collage left + text right ── */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 xl:gap-20 items-start">

          {/* LEFT — Asymmetric image collage */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={imageReveal}
            className="relative"
          >
            {/* Main tall image */}
            <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
              <Image
                src="/images/who-we-are.png"
                alt="Artisan weaving handloom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/30 to-transparent" />
            </div>

            {/* Overlapping detail image — bottom right */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-44 md:w-56 h-44 md:h-56 overflow-hidden border-4 border-white shadow-2xl">
              <Image
                src="/images/artisan-detail.png"
                alt="Textile weave detail"
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>

            {/* Floating brand stat card — top left */}
            <div className="hidden sm:block absolute -top-5 -left-5 bg-[#FF6B00] px-6 py-5 shadow-xl">
              <p className="font-display text-3xl text-white">50+</p>
              <p className="font-body text-[9px] tracking-[0.22em] text-white/70 uppercase mt-1">Artisan Families</p>
            </div>
          </motion.div>

          {/* RIGHT — Text content */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            className="pt-4 lg:pt-10"
          >
            <motion.p variants={fadeUp} custom={0}
              className="font-body text-lg text-[#111111]/90 leading-relaxed mb-6">
              Kauseyah is more than a brand — it is a living archive of India&apos;s most sacred textile traditions.
              Born from a deep reverence for the hands that weave, dye, and embroider these masterpieces,
              we work directly with artisan families across tribal belts of India.
            </motion.p>
            <motion.p variants={fadeUp} custom={1}
              className="font-body text-lg text-[#111111]/90 leading-relaxed mb-10">
              We bring their timeless art directly to you — untouched, uncompromised, and forever authentic.
              Every purchase sustains a family, preserves a craft, and keeps a tradition alive.
            </motion.p>

            {/* Stats row */}
            <motion.div variants={fadeUp} custom={2}
              className="grid grid-cols-3 gap-3 md:gap-6 pb-10 mb-10 border-b border-[#FF6B00]/15">
              {WHO_WE_ARE_STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-[#FF6B00] mb-1">
                    <CountUp value={s.value} suffix={s.suffix} duration={2} className="inline-block" />
                  </p>
                  <p className="font-body text-[11px] font-medium tracking-[0.15em] text-[#111111]/80 uppercase leading-snug">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/about"
                className="inline-flex items-center gap-4 group"
              >
                <span className="w-10 h-px bg-[#FF6B00] transition-all duration-300 group-hover:w-16" />
                <span className="font-body text-[11px] tracking-[0.28em] uppercase text-[#111111] group-hover:text-[#FF6B00] transition-colors duration-300">
                  Discover Our Story
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
