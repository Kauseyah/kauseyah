/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const REELS = [
  { id: "r1", url: "/videos/reel1.mp4", caption: "Handloom Heritage" },
  { id: "r2", url: "/videos/reel2.mp4", caption: "Artisan Stories" },
  { id: "r3", url: "/videos/reel3.mp4", caption: "Behind the Loom" },
  { id: "r4", url: "/videos/reel4.mp4", caption: "The Master Weaver" },
];

function ReelCard({
  reel,
  index,
  featured,
  onEnter,
  onLeave,
  registerRef,
}: {
  reel: (typeof REELS)[0];
  index: number;
  featured?: boolean;
  onEnter: () => void;
  onLeave: () => void;
  registerRef: (el: HTMLVideoElement | null) => void;
}) {
  const width = featured ? 280 : 240;
  const height = featured ? 500 : 426;

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, perspective: 1000 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.2, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4"
      style={{ alignSelf: featured ? "flex-start" : "flex-end" }}
    >
      {/* Card */}
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          width,
          height,
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          background: "#111",
          boxShadow: featured
            ? "0 20px 60px rgba(27,31,16,0.22), 0 4px 16px rgba(107,112,92,0.12)"
            : "0 8px 30px rgba(27,31,16,0.14)",
          border: featured
            ? "1.5px solid rgba(107,112,92,0.35)"
            : "1px solid rgba(27,31,16,0.1)",
          transition: "box-shadow 0.4s ease",
          cursor: "pointer",
        }}
      >
        <video
          ref={registerRef}
          src={reel.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Caption */}
      <span
        className="font-body text-[10px] tracking-[0.22em] uppercase"
        style={{ color: "#FF8100" }}
      >
        {reel.caption}
      </span>
    </motion.div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export default function InstagramReels() {
  // Store refs to all video elements
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // On hover: unmute & play hovered, pause others
  const handleEnter = (id: string) => {
    Object.entries(videoRefs.current).forEach(([rId, v]) => {
      if (!v) return;
      if (rId === id) {
        v.muted = false;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  };

  // On leave: mute & resume all
  const handleLeave = () => {
    Object.values(videoRefs.current).forEach((v) => {
      if (!v) return;
      v.muted = true;
      v.play().catch(() => {});
    });
  };

  return (
    <section className="w-full py-12 lg:py-16 overflow-hidden text-[#111111]" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F3 100%)' }}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12 max-w-4xl mx-auto">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            The <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Stories</span>
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
             From the tribal looms of Odisha to the silk villages of Varanasi. Catch real-time updates from our artisan households.
          </p>
        </div>

        {/* ── 4-Column Narrative Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="flex flex-col"
            >
              {/* Video Container */}
              <div 
                onMouseEnter={() => handleEnter(reel.id)}
                onMouseLeave={handleLeave}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#111] mb-8 group cursor-pointer shadow-xl shadow-black/5"
              >
                <video
                  ref={(el) => { videoRefs.current[reel.id] = el; }}
                  src={reel.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Narrative Content */}
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-2xl text-[#111111] font-bold">{reel.caption}</h3>
                <div className="w-8 h-px bg-[#FF6B00]" />
                <p className="font-body text-sm text-[#111111] font-medium leading-relaxed">
                  {i === 0 && "Experience the rhythmic clicking of the loom as ancestral motifs arrive in gold."}
                  {i === 1 && "Documenting the master weavers as they translate ancient symbols into silk."}
                  {i === 2 && "A raw journey through the dye vats where organic colors find their soul."}
                  {i === 3 && "Celebrating the final touch as a masterpiece leaves the artisan household."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Footer CTAs ── */}
        <div className="mt-24 flex flex-col items-center gap-16">
            <Link
              href="/contact"
              className="group relative inline-block text-center"
            >
              <span className="block font-display text-3xl md:text-4xl text-[#111111] tracking-tighter transition-all duration-500 group-hover:text-[#FF6B00] group-hover:drop-shadow-[0_4px_12px_rgba(255,107,0,0.5)]">
                Let's <span className="text-[#FF6B00] italic font-light drop-shadow-sm">work together</span>
              </span>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#FF6B00] transition-all duration-500 group-hover:w-[120%] shadow-[0_0_15px_#FF6B00]" />
            </Link>

            <a
              href="https://www.instagram.com/kauseyah.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6"
            >
              <div className="w-12 lg:w-24 h-px bg-[#111111]/20 transition-all duration-500 group-hover:w-32 group-hover:bg-[#FF6B00]" />
              <span className="font-body text-[11px] font-black tracking-[0.4em] text-[#111111] uppercase group-hover:text-[#FF6B00] transition-colors">
                Follow us on Instagram for more
              </span>
              <div className="w-12 lg:w-24 h-px bg-[#111111]/20 transition-all duration-500 group-hover:w-32 group-hover:bg-[#FF6B00]" />
            </a>
        </div>

      </div>
    </section>
  );
}
