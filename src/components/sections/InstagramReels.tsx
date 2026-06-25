"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

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
            ? "0 20px 60px rgba(26,20,16,0.22), 0 4px 16px rgba(200,137,42,0.12)"
            : "0 8px 30px rgba(26,20,16,0.14)",
          border: featured
            ? "1.5px solid rgba(200,137,42,0.35)"
            : "1px solid rgba(26,20,16,0.1)",
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
        style={{ color: "#6B3A2A", opacity: 0.7 }}
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
    <section className="w-full bg-[#E5C18D] py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <span className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
            Instagram Highlights
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410] mb-6">
            As Seen On Instagram
          </h2>
          <p className="font-body text-lg lg:text-xl text-[#1A1410]/70 max-w-2xl mx-auto leading-relaxed">
            Follow our journey — from the tribal looms of Odisha to the silk villages of Varanasi.
            Real artisans, real craft, captured as it happens. We believe the story behind every thread matters.
          </p>
        </motion.div>

        {/* ── Reels row ── */}
        <div
          className="flex items-center justify-center gap-5 md:gap-6"
          style={{ alignItems: "flex-end" }}
        >
          {REELS.map((reel, i) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              index={i}
              featured={i % 2 !== 0}
              onEnter={() => handleEnter(reel.id)}
              onLeave={handleLeave}
              registerRef={(el) => { videoRefs.current[reel.id] = el; }}
            />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mt-10"
        >
          <a
            href="https://www.instagram.com/kauseyah.official/"
            target="_blank"
            rel="noopener noreferrer"
            id="instagram-follow-cta"
            className="group inline-flex items-center gap-3"
          >
            <span className="w-8 h-px bg-[#C8892A] transition-all duration-300 group-hover:w-12" />
            <span className="font-body text-[11px] tracking-[0.28em] uppercase text-[#1A1410] transition-colors duration-300 group-hover:text-[#C8892A]">
              @kauseyah.official — Follow Us
            </span>
            <span className="w-8 h-px bg-[#C8892A] transition-all duration-300 group-hover:w-12" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
