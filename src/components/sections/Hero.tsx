"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden">
      {/* Background Video — full bleed */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-white">
        <video
          src="/videos/hvideo1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Content — anchored to bottom left */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-20 pb-8 sm:pb-10 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-[#FFFFFF] mb-8 tracking-tighter drop-shadow-2xl">
            Woven by <span className="text-[#FF6B00] italic font-light">hands</span><br />
            Rooted in <span className="text-[#FF6B00] italic font-light">heritage</span>
          </h1>

          <div className="w-10 h-[1.5px] bg-[#FF6B00] mb-6" />

          {/* Short description */}
          <p className="font-body text-base lg:text-lg font-light tracking-wide text-[#FFFFFF]/90 mb-10 leading-relaxed max-w-md drop-shadow-md">
            Handlooms, tribal crafts and conscious design- created with tribal communities to preserve India&apos;s living
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-4">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center bg-[#FF6B00] text-[#FFFFFF] border-none px-8 py-4 text-[12px] font-bold tracking-[0.25em] hover:bg-[#FFFFFF] hover:text-[#111111] hover:-translate-y-1 transition-all duration-300 shadow-[0_5px_20px_rgba(128,0,0,0.25)] uppercase rounded-sm"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center bg-[#FFFFFF]/10 border border-[#FFFFFF]/40 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#111111] px-8 py-4 text-[12px] font-bold tracking-[0.25em] hover:-translate-y-1 transition-all duration-300 uppercase backdrop-blur-md rounded-sm shadow-xl"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
