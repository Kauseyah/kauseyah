"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-end">
      {/* Background Video — full bleed */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#1A1410]">
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
      <div className="relative z-10 w-full px-10 lg:px-20 pb-10 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          {/* Eyebrow */}
          <span className="font-body text-[11px] tracking-[0.3em] text-[#E7D6B8]/80 block mb-5 uppercase">
            The Artisan Collective
          </span>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-white mb-5 tracking-tight drop-shadow-2xl">
            Woven by Hands.<br />
            <span className="text-[#E7D6B8] italic font-light">Born from Tribes.</span>
          </h1>

          {/* Divider */}
          <div className="w-10 h-[1.5px] bg-[#C8892A] mb-6" />

          {/* Short description */}
          <p className="font-body text-[15px] font-light tracking-wide text-white/70 mb-10 leading-relaxed max-w-md">
            India's heritage, ethically woven — handlooms, textiles &amp; tribal artistry.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/collections"
              className="btn bg-[#E7D6B8] text-[#1A1410] border-none px-8 py-3 text-[11px] font-bold tracking-[0.2em] hover:bg-white transition-all shadow-lg uppercase"
            >
              Shop Collections
            </Link>
            <Link
              href="/about"
              className="btn bg-transparent border border-white/40 text-white hover:bg-white/10 px-8 py-3 text-[11px] font-bold tracking-[0.2em] transition-all uppercase backdrop-blur-sm"
            >
              Our Story
            </Link>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
