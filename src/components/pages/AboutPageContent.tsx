"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Target, Eye } from "lucide-react";
import Achievements from "@/components/sections/Achievements";
import { FOUNDER, ABOUT_KAUSEYAH, BRAND_TAGLINE } from "@/constants";

const BRAND_PILLARS = BRAND_TAGLINE.split("|").map((item) => item.trim());

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const MISSION_VISION = [
  {
    id: "mission",
    label: "Our Mission",
    num: "01",
    icon: Target,
    text: "To provide a global platform for indigenous craft — ensuring fair wages, direct artisan partnerships, and global recognition for traditional weavers and tribal artists.",
    highlights: [
      "Fair wages that sustain artisan families.",
      "Craft preserved and celebrated worldwide.",
    ],
  },
  {
    id: "vision",
    label: "Our Vision",
    num: "02",
    icon: Eye,
    text: "A world where heritage crafts are not confined to museums, but thriving in contemporary lifestyles — empowering the communities who create them.",
    highlights: [
      "Heritage woven into everyday living.",
      "Communities empowered through their art.",
    ],
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Tribal Heritage",
    text: "Honouring the wisdom, artistry, and traditions of India's tribal communities.",
  },
  {
    icon: Heart,
    title: "Handcrafted Excellence",
    text: "Celebrating timeless craftsmanship through skilled hands, thoughtful design, and exceptional attention to detail.",
  },
  {
    icon: Leaf,
    title: "Conscious Design",
    text: "Creating responsibly with sustainable practices, ethical craftsmanship, and enduring quality.",
  },
];

const slideIn = {
  hidden: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "right" ? 36 : -36,
  }),
  show: (dir: "left" | "right") => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      delay: dir === "right" ? 0 : 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function MissionVisionBlock({
  item,
  align,
}: {
  item: (typeof MISSION_VISION)[number];
  align: "left" | "right";
}) {
  const Icon = item.icon;
  const isRight = align === "right";
  const dir = isRight ? "right" : "left";

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={dir}
      variants={slideIn}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group text-center ${isRight ? "lg:text-right" : "lg:text-left"}`}
    >
      <div className={`flex items-center justify-center gap-2.5 mb-3 ${isRight ? "lg:justify-end" : "lg:justify-start"}`}>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
          className="text-[#111111] flex-shrink-0"
        >
          <Icon size={18} strokeWidth={1.75} />
        </motion.div>
        <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#111111]/80 group-hover:text-black transition-colors duration-300">
          {item.num} — {item.id}
        </span>
      </div>

      <motion.h3
        className="font-display text-2xl lg:text-3xl text-[#111111] mb-3 leading-tight group-hover:text-black transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformOrigin: isRight ? "right center" : "left center" }}
      >
        {item.label}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: isRight ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-[15px] lg:text-[16px] text-[#111111]/85 leading-[1.65] mb-4"
      >
        {item.text}
      </motion.p>

      <div className={`space-y-1 flex flex-col items-center ${isRight ? "lg:items-end" : "lg:items-start"}`}>
        {item.highlights.map((line, j) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25 + j * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              x: isRight ? -8 : 8,
              color: "#111111",
            }}
            className="font-body text-[14px] text-[#111111]/80 leading-snug cursor-default transition-colors duration-300"
          >
            — {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function MissionVisionSection() {
  return (
    <section className="bg-[#FFF8F3] py-14 lg:py-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="font-body text-[11px] font-bold tracking-[0.3em] text-[#FF6B00] uppercase block mb-3">
            What Drives Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Mission &amp; <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Vision</span>
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-10 items-start">
          <MissionVisionBlock item={MISSION_VISION[0]} align="right" />

          {/* Center divider — desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col items-center pt-4"
          >
            <motion.div
              className="w-px h-14 bg-[#111111]/30 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="font-display text-2xl text-[#111111]/60 my-3 cursor-default"
              whileHover={{ scale: 1.2, color: "#111111" }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            >
              &amp;
            </motion.span>
            <motion.div
              className="w-px h-14 bg-[#111111]/30 origin-bottom"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* Center divider — mobile */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden flex items-center gap-4 origin-center"
          >
            <div className="flex-1 h-px bg-[#111111]/30" />
            <motion.span
              className="font-display text-2xl text-[#111111]/60"
              whileHover={{ scale: 1.15 }}
            >
              &amp;
            </motion.span>
            <div className="flex-1 h-px bg-[#111111]/30" />
          </motion.div>

          <MissionVisionBlock item={MISSION_VISION[1]} align="left" />
        </div>
      </div>
    </section>
  );
}

export default function AboutPageContent() {
  return (
    <main className="bg-white">
      {/* ── Page Hero ── */}
      <section className="w-full min-h-[50svh] lg:min-h-[100svh] pt-20 pb-10 lg:pb-0 flex flex-col justify-center overflow-hidden relative border-b border-[#FF6B00]/10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/about-hero.webp" alt="About Kauseyah" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-[#0D0400]/60" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#FF6B00]" />
              <span className="font-body text-[11px] tracking-[0.35em] text-[#FF6B00] uppercase font-bold">
                Our Heritage
              </span>
              <span className="w-8 h-px bg-[#FF6B00]" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter text-white mb-4 leading-[0.9] drop-shadow-lg">
              Our <span className="text-[#FF6B00] italic font-light drop-shadow-[0_2px_8px_rgba(255,107,0,0.25)]">Story</span>
            </h1>

            <div className="w-16 h-[2px] bg-[#FF6B00] mb-6" />

            <p className="font-body text-base md:text-lg lg:text-xl text-[#FFF8F3]/90 leading-relaxed max-w-2xl mb-8 font-light drop-shadow-md">
              Born from a love of indigenous art — a living bridge between India&apos;s master artisans
              and the world.
            </p>

            {/* Brand pillars */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {BRAND_PILLARS.map((pillar, index) => (
                <span key={pillar} className="flex items-center gap-6">
                  <span className="font-body text-[11px] tracking-[0.3em] text-[#FFF8F3]/90 uppercase font-semibold hover:text-[#FF6B00] transition-colors duration-300 drop-shadow-md">
                    {pillar}
                  </span>
                  {index < BRAND_PILLARS.length - 1 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]/70 animate-pulse" aria-hidden />
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="bg-white pt-14 lg:pt-20 pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">
          
          {/* Two-column layout for Story + Image */}
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-12 xl:gap-20 items-center mb-16 lg:mb-24">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
              >
                The Kauseyah <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Story</span>
              </motion.h2>
              <motion.div variants={fadeUp} custom={1} className="w-12 h-[2px] bg-[#FF6B00] mb-6" />
              <div className="space-y-5">
                {ABOUT_KAUSEYAH.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={paragraph.slice(0, 40)}
                    variants={fadeUp}
                    custom={index + 2}
                    className="font-body text-[16px] lg:text-[17px] text-[#111111]/80 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Artisan Workshop Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/3] md:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/11] overflow-hidden rounded-2xl border border-[#FF6B00]/10 shadow-[0_15px_50px_rgba(0,0,0,0.05)] bg-white/50"
            >
              <Image
                src="/images/artisan_workshop_portrait_1782640198563.png"
                alt="Artisan weaving at the handloom in Chhattisgarh workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 550px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0400]/10 to-transparent" />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="relative h-[360px] md:h-[480px] overflow-hidden rounded-2xl order-2 lg:order-1"
            >
              <Image
                src="/images/about/about.jpeg"
                alt="Founder journey among master artisans at the loom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/25 to-transparent" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="order-1 lg:order-2"
            >
              <motion.span variants={fadeUp} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#FF6B00] uppercase block mb-4">
                The Founder
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4 leading-[0.85] text-[#111111]">
                Meet The <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Founder</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="font-body text-[13px] font-semibold tracking-[0.12em] text-[#FF6B00] uppercase mb-6">
                {FOUNDER.title}
              </motion.p>
              <div className="space-y-5 mb-8">
                {FOUNDER.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={paragraph.slice(0, 40)}
                    variants={fadeUp}
                    custom={index + 3}
                    className="font-body text-[16px] text-[#111111]/80 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <motion.p variants={fadeUp} custom={5} className="font-display text-lg text-[#FF6B00]">
                — {FOUNDER.role}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <MissionVisionSection />

      {/* ── Core Values ── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-14 lg:mb-16 text-center md:text-left"
          >
            <motion.span variants={fadeUp} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#FF6B00] uppercase block mb-4">
              What We Stand For
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]">
              Core <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Values</span>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-0">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className={`group flex flex-col items-center text-center md:items-start md:text-left ${i > 0 ? "md:border-l md:border-[#FF6B00]/25 md:pl-10" : "md:pr-10"} ${i === 1 ? "md:px-10" : ""}`}
              >
                <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="text-[#FF6B00] flex-shrink-0"
                  >
                    <value.icon size={22} strokeWidth={1.75} />
                  </motion.div>
                  <span className="font-body text-[11px] font-bold tracking-[0.25em] uppercase text-[#FF6B00] group-hover:text-[#111111] transition-colors duration-300">
                    0{i + 1}
                  </span>
                </div>

                <motion.h3
                  className="font-display text-2xl lg:text-[1.75rem] text-[#111111] mb-3 group-hover:text-[#FF6B00] transition-colors duration-300"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {value.title}
                </motion.h3>

                <div className="h-px w-10 bg-[#FF6B00] mb-4 group-hover:w-16 transition-all duration-500 ease-out" />

                <p className="font-body text-[15px] lg:text-[16px] text-[#111111] leading-[1.75] group-hover:text-[#111111] transition-colors duration-300">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Heritage Archive (Achievements) ── */}
      <Achievements />
    </main>
  );
}
