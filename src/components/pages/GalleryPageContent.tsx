"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GALLERY_HERO,
  GALLERY_INTRO,
  GALLERY_VIDEO,
  GALLERY_ITEMS,
} from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const CARD_IMAGE_HEIGHT = "h-[300px] sm:h-[320px] lg:h-[340px]";

function GalleryCard({
  item,
  index,
}: {
  item: (typeof GALLERY_ITEMS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      custom={index}
      className="flex h-full flex-col bg-white ring-1 ring-[#111111]/10 transition-shadow duration-500 hover:shadow-[0_14px_36px_rgba(26,20,16,0.08)]"
    >
      <div
        className={`${CARD_IMAGE_HEIGHT} flex shrink-0 items-center justify-center overflow-hidden bg-white p-4`}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="max-h-full max-w-full h-auto w-auto object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col min-h-[148px]">
        <h3 className="font-display text-xl text-[#111111] mb-3 leading-snug px-5 lg:px-6 pt-5 lg:pt-6">
          {item.title}
        </h3>
        <div className="w-8 h-px bg-[#111111]/30 mb-3 mx-5 lg:mx-6" />
        <p className="font-body text-[14px] text-[#111111]/80 leading-relaxed px-5 lg:px-6 pb-5 lg:pb-6">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}

export default function GalleryPageContent() {
  return (
    <main className="bg-[#FEF9F9] text-[#111111]">
      {/* ── Page Hero ── */}
      <section className="w-full bg-[#0D0400] pt-32 lg:pt-36 pb-20 lg:pb-28 overflow-hidden relative">
        {/* Decorative gradient glowing orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-[#FF6B00]/8 to-transparent blur-[80px]" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#FF6B00]" />
              <span className="font-body text-[11px] tracking-[0.35em] text-[#FF6B00] uppercase font-bold">
                {GALLERY_HERO.eyebrow}
              </span>
              <span className="w-8 h-px bg-[#FF6B00]" />
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white mb-8 leading-[0.9]">
              Our <span className="text-[#FF6B00] italic font-light drop-shadow-[0_2px_8px_rgba(255,107,0,0.15)]">Gallery</span>
            </h1>

            <div className="w-16 h-[2px] bg-[#FF6B00] mb-8" />

            <p className="font-body text-lg md:text-xl lg:text-2xl text-[#FFF8F3]/90 leading-relaxed max-w-2xl mb-8 font-light">
              {GALLERY_HERO.intro}
            </p>

            <div className="flex flex-col items-center max-w-md mx-auto pt-6 border-t border-[#FF6B00]/15">
              <p className="font-display text-lg md:text-xl italic text-white/95 leading-relaxed mb-4">
                &ldquo;{GALLERY_HERO.quote}&rdquo;
              </p>
              <p className="font-body text-[11px] tracking-[0.2em] text-[#FF6B00] uppercase font-bold">
                — {GALLERY_HERO.note}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="pt-14 lg:pt-20 pb-10 lg:pb-14">
        <div className="max-w-[780px] mx-auto px-4 sm:px-8 lg:px-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-display text-2xl md:text-3xl italic text-[#111111]/90 leading-snug mb-6"
          >
            {GALLERY_INTRO.lead}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-10 h-px bg-[#FF6B00] mx-auto mb-6 origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-body text-[16px] lg:text-[17px] text-[#111111]/75 leading-relaxed"
          >
            {GALLERY_INTRO.body}
          </motion.p>
        </div>
      </section>

      {/* ── Featured Video ── */}
      <section className="pb-14 lg:pb-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 xl:gap-16 items-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="overflow-hidden bg-[#111111] ring-1 ring-[#FF6B00]/10 flex items-center justify-center p-4 rounded-xl"
            >
              <video
                src={GALLERY_VIDEO.src}
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto block max-h-[75vh] object-contain mx-auto rounded-lg shadow-2xl"
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="lg:py-4">
              <span className="font-body text-[11px] font-bold tracking-[0.3em] text-[#FF6B00] uppercase block mb-4">
                Watch
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#111111] mb-10 leading-[0.85]">
                Featured <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Stories</span>
              </h2>
              <div className="w-10 h-px bg-[#FF6B00] mb-6" />
              <p className="font-body text-[16px] lg:text-[17px] text-[#111111]/80 leading-relaxed">
                {GALLERY_VIDEO.description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {GALLERY_ITEMS.map((item, index) => (
              <GalleryCard key={item.src} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing note ── */}
      <section className="bg-white border-t border-[#E5E5E5] py-16 lg:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <span className="font-body text-[11px] tracking-[0.3em] text-[#FF6B00] uppercase font-semibold block mb-5">
                Carry It Forward
              </span>
              <p className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#111111] leading-[0.85]">
                Carry It <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Forward</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:pl-12 xl:pl-16 lg:border-l lg:border-[#FF6B00]/12 lg:pt-1"
            >
              <p className="font-body text-[16px] lg:text-[17px] text-[#111111]/75 leading-relaxed mb-6">
                Every image here is a reminder that craft is living — heritage you can wear, and a choice that keeps traditions alive for the next generation.
              </p>
              <div className="w-10 h-px bg-[#FF6B00]" />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
