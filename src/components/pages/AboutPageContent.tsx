"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Target, Eye } from "lucide-react";
import { FOUNDER, ABOUT_KAUSEYAH, BRAND_TAGLINE, SITE_TAGLINE } from "@/constants";

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
    title: "Authenticity",
    text: "Sourcing directly from genuine artisans — every piece traceable to the hands that made it.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    text: "Eco-friendly materials, slow fashion, and zero-waste practices woven into everything we do.",
  },
  {
    icon: Heart,
    title: "Empowerment",
    text: "Uplifting tribal and indigenous communities through fair wages and long-term partnerships.",
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
      className={`group ${isRight ? "lg:text-right" : ""}`}
    >
      <div className={`flex items-center gap-2.5 mb-3 ${isRight ? "lg:justify-end" : ""}`}>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
          className="text-[#6B3A2A] flex-shrink-0"
        >
          <Icon size={18} strokeWidth={1.75} />
        </motion.div>
        <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#6B3A2A] group-hover:text-[#1A1410] transition-colors duration-300">
          {item.num} — {item.id}
        </span>
      </div>

      <motion.h3
        className="font-display text-2xl lg:text-3xl text-[#1A1410] mb-3 leading-tight group-hover:text-[#6B3A2A] transition-colors duration-300"
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
        className="font-body text-[15px] lg:text-[16px] text-[#1A1410] leading-[1.65] mb-4"
      >
        {item.text}
      </motion.p>

      <div className={`space-y-1 ${isRight ? "lg:flex lg:flex-col lg:items-end" : ""}`}>
        {item.highlights.map((line, j) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25 + j * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              x: isRight ? -8 : 8,
              color: "#1A1410",
            }}
            className="font-body text-[14px] text-[#6B3A2A] leading-snug cursor-default transition-colors duration-300"
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
    <section className="bg-[#E5C18D] py-14 lg:py-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="font-body text-[11px] font-bold tracking-[0.3em] text-[#1A1410] uppercase block mb-3">
            What Drives Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-3xl md:text-4xl lg:text-5xl text-[#1A1410]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Mission &amp; Vision
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
              className="w-px h-14 bg-[#6B3A2A]/25 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              className="font-display text-2xl text-[#6B3A2A]/50 my-3 cursor-default"
              whileHover={{ scale: 1.2, color: "#6B3A2A" }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            >
              &amp;
            </motion.span>
            <motion.div
              className="w-px h-14 bg-[#6B3A2A]/25 origin-bottom"
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
            <div className="flex-1 h-px bg-[#6B3A2A]/25" />
            <motion.span
              className="font-display text-2xl text-[#6B3A2A]/50"
              whileHover={{ scale: 1.15 }}
            >
              &amp;
            </motion.span>
            <div className="flex-1 h-px bg-[#6B3A2A]/25" />
          </motion.div>

          <MissionVisionBlock item={MISSION_VISION[1]} align="left" />
        </div>
      </div>
    </section>
  );
}

export default function AboutPageContent() {
  return (
    <main className="bg-[#F9F5EE]">
      {/* ── Navbar clearance + separation from hero ── */}
      <div className="h-[4.25rem] lg:h-[4.5rem]" aria-hidden />

      {/* ── Page Hero ── */}
      <section className="w-full bg-[#E5C18D] pt-10 lg:pt-12 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-[#6B3A2A]" />
                <span className="font-body text-[11px] tracking-[0.35em] text-[#6B3A2A] uppercase font-semibold">
                  Our Heritage
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0D0603] mb-5 leading-[1.05]">
                Our Story
              </h1>
              <div className="w-12 h-[2px] bg-[#6B3A2A] mb-6" />
              <p className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed max-w-xl">
                Born from a love of indigenous art — a living bridge between India&apos;s master artisans
                and the world.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:ml-auto lg:max-w-xs xl:max-w-sm lg:pl-16 xl:pl-24 lg:border-l lg:border-[#6B3A2A]/20 lg:pt-2"
            >
              <p className="font-display text-xl md:text-2xl italic text-[#1A1410]/85 leading-snug mb-5">
                &ldquo;Every thread carries a story, every pattern a prayer.&rdquo;
              </p>

              <div className="w-8 h-px bg-[#6B3A2A] mb-4" />

              <p className="font-display text-lg md:text-xl text-[#0D0603] leading-snug mb-5">
                {SITE_TAGLINE.split(".")[0]}.{" "}
                <span className="italic text-[#6B2D0A]">{SITE_TAGLINE.split(".")[1]?.trim()}.</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {BRAND_PILLARS.map((pillar, index) => (
                  <span key={pillar} className="flex items-center gap-4">
                    <span className="font-body text-[10px] tracking-[0.24em] text-[#6B3A2A] uppercase font-semibold">
                      {pillar}
                    </span>
                    {index < BRAND_PILLARS.length - 1 && (
                      <span className="hidden sm:block w-px h-3 bg-[#6B3A2A]/35" aria-hidden />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="bg-[#F9F5EE] pt-14 lg:pt-20 pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mb-14 lg:mb-20"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-3xl md:text-4xl lg:text-[2.65rem] text-[#0D0603] leading-snug mb-6"
            >
              {ABOUT_KAUSEYAH.title}
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="w-12 h-[2px] bg-[#C8892A] mb-6" />
            <div className="space-y-5">
              {ABOUT_KAUSEYAH.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 40)}
                  variants={fadeUp}
                  custom={index + 2}
                  className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="relative h-[360px] md:h-[480px] overflow-hidden rounded-2xl"
            >
              <Image
                src="/images/about/about.jpeg"
                alt="Founder journey among master artisans at the loom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0603]/25 to-transparent" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.span variants={fadeUp} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
                The Founder
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl text-[#0D0603] mb-2">
                {FOUNDER.name}
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="font-body text-[13px] font-semibold tracking-[0.12em] text-[#6B2D0A] uppercase mb-6">
                {FOUNDER.title}
              </motion.p>
              <div className="space-y-5 mb-8">
                {FOUNDER.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={paragraph.slice(0, 40)}
                    variants={fadeUp}
                    custom={index + 3}
                    className="font-body text-[16px] text-[#2C1810]/80 leading-relaxed"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <motion.p variants={fadeUp} custom={5} className="font-display text-lg text-[#6B2D0A]">
                — {FOUNDER.role}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <MissionVisionSection />

      {/* ── Core Values ── */}
      <section className="bg-[#F9F5EE] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-10 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-14 lg:mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
              What We Stand For
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl text-[#0D0603]">
              Core Values
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
                className={`group ${i > 0 ? "md:border-l md:border-[#C8892A]/25 md:pl-10" : "md:pr-10"} ${i === 1 ? "md:px-10" : ""}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 14 }}
                    className="text-[#C8892A] flex-shrink-0"
                  >
                    <value.icon size={22} strokeWidth={1.75} />
                  </motion.div>
                  <span className="font-body text-[11px] font-bold tracking-[0.25em] uppercase text-[#6B3A2A] group-hover:text-[#1A1410] transition-colors duration-300">
                    0{i + 1}
                  </span>
                </div>

                <motion.h3
                  className="font-display text-2xl lg:text-[1.75rem] text-[#0D0603] mb-3 group-hover:text-[#6B2D0A] transition-colors duration-300"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {value.title}
                </motion.h3>

                <div className="h-px w-10 bg-[#C8892A] mb-4 group-hover:w-16 transition-all duration-500 ease-out" />

                <p className="font-body text-[15px] lg:text-[16px] text-[#1A1410] leading-[1.75] group-hover:text-[#2C1810] transition-colors duration-300">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
