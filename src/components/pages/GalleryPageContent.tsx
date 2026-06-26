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
      className="flex h-full flex-col bg-[#F9F5EE] ring-1 ring-[#6B3A2A]/10 transition-shadow duration-500 hover:shadow-[0_14px_36px_rgba(26,20,16,0.08)]"
    >
      <div
        className={`${CARD_IMAGE_HEIGHT} flex shrink-0 items-center justify-center overflow-hidden bg-[#EDE6DA] p-4`}
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

      <div className="flex flex-1 flex-col px-5 py-5 lg:px-6 lg:py-6 min-h-[148px]">
        <h3 className="font-display text-xl text-[#0D0603] mb-3 leading-snug">
          {item.title}
        </h3>
        <div className="w-8 h-px bg-[#C8892A] mb-3" />
        <p className="font-body text-[14px] text-[#2C1810]/75 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}

export default function GalleryPageContent() {
  return (
    <main className="bg-[#F9F5EE]">
      <div className="h-[4.25rem] lg:h-[4.5rem]" aria-hidden />

      {/* ── Page Hero ── */}
      <section className="w-full bg-[#E5C18D] pt-10 lg:pt-12 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-[#6B3A2A]" />
                <span className="font-body text-[11px] tracking-[0.35em] text-[#6B3A2A] uppercase font-semibold">
                  {GALLERY_HERO.eyebrow}
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0D0603] mb-5 leading-[1.05]">
                {GALLERY_HERO.title}
              </h1>
              <div className="w-12 h-[2px] bg-[#6B3A2A] mb-6" />
              <p className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed max-w-xl">
                {GALLERY_HERO.intro}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:ml-auto lg:max-w-xs xl:max-w-sm lg:pl-16 xl:pl-24 lg:border-l lg:border-[#6B3A2A]/20 lg:pt-2"
            >
              <p className="font-display text-xl md:text-2xl italic text-[#1A1410]/85 leading-snug mb-5">
                &ldquo;{GALLERY_HERO.quote}&rdquo;
              </p>
              <div className="w-8 h-px bg-[#6B3A2A] mb-4" />
              <p className="font-body text-[14px] tracking-[0.08em] text-[#6B3A2A] uppercase font-semibold">
                {GALLERY_HERO.note}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="pt-14 lg:pt-20 pb-10 lg:pb-14">
        <div className="max-w-[780px] mx-auto px-10 lg:px-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-display text-2xl md:text-3xl italic text-[#1A1410]/90 leading-snug mb-6"
          >
            {GALLERY_INTRO.lead}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-10 h-px bg-[#C8892A] mx-auto mb-6 origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/75 leading-relaxed"
          >
            {GALLERY_INTRO.body}
          </motion.p>
        </div>
      </section>

      {/* ── Featured Video ── */}
      <section className="pb-14 lg:pb-20">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 xl:gap-16 items-center"
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="overflow-hidden bg-[#1A1410] ring-1 ring-[#6B3A2A]/10 flex items-center justify-center"
            >
              <video
                src={GALLERY_VIDEO.src}
                controls
                playsInline
                preload="metadata"
                className="w-full h-auto block max-h-[75vh] object-contain mx-auto"
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="lg:py-4">
              <span className="font-body text-[11px] font-bold tracking-[0.3em] text-[#C8892A] uppercase block mb-4">
                Watch
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-[#0D0603] mb-5 leading-tight">
                {GALLERY_VIDEO.title}
              </h2>
              <div className="w-10 h-px bg-[#6B3A2A] mb-6" />
              <p className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed">
                {GALLERY_VIDEO.description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {GALLERY_ITEMS.map((item, index) => (
              <GalleryCard key={item.src} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing note ── */}
      <section className="bg-white border-t border-[#E8E0D4] py-16 lg:py-24">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <span className="font-body text-[11px] tracking-[0.3em] text-[#6B3A2A] uppercase font-semibold block mb-5">
                Carry It Forward
              </span>
              <p className="font-display text-3xl md:text-4xl lg:text-[2.65rem] text-[#0D0603] leading-[1.18]">
                When you wear Kauseyah, you carry forward a story woven by real hands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:pl-12 xl:pl-16 lg:border-l lg:border-[#6B3A2A]/12 lg:pt-1"
            >
              <p className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/75 leading-relaxed mb-6">
                Every image here is a reminder that craft is living — heritage you can wear, and a choice that keeps traditions alive for the next generation.
              </p>
              <div className="w-10 h-px bg-[#C8892A]" />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
