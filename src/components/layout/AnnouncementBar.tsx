"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";

export interface AnnouncementNotice {
  id: string;
  text: string;
  cta: string;
  href: string;
}

const NOTICES: AnnouncementNotice[] = [
  {
    id: "free-shipping",
    text: "Free shipping for all orders above ₹6,000 within India.",
    cta: "Shop Now",
    href: "/products",
  },
  {
    id: "gifting",
    text: "Conscious handcrafted gift packaging available for ₹100.",
    cta: "Shop Hampers",
    href: "/collections/gift-hampers",
  },
  {
    id: "handloom-heritage",
    text: "India's tribal handloom heritage, ethically woven by hands.",
    cta: "Explore Handlooms",
    href: "/collections/apparels",
  },
];

const CYCLE_DURATION_MS = 5000;
const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    startTimeRef.current = Date.now();
  }, []);

  // Smooth circular countdown timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const initialStart = startTimeRef.current ?? Date.now();
    startTimeRef.current = initialStart - (progress / 100) * CYCLE_DURATION_MS;

    const tick = () => {
      const start = startTimeRef.current ?? Date.now();
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / CYCLE_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= CYCLE_DURATION_MS) {
        setCurrentIndex((prev) => (prev + 1) % NOTICES.length);
        startTimeRef.current = Date.now();
        setProgress(0);
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentIndex]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const current = NOTICES[currentIndex];
  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div
      data-announcement-bar="true"
      role="region"
      aria-label="Shipping and Store Announcements"
      className="relative z-50 w-full select-none border-b border-black/15 overflow-hidden text-white font-body"
      style={{
        backgroundColor: "#851A36",
        color: "#FFFFFF",
        minHeight: "38px",
      }}
    >
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-[13px]">
        
        {/* Left: Pause/Play with animated circular countdown ring */}
        <div className="flex-shrink-0 flex items-center pr-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause announcement rotation" : "Play announcement rotation"}
            title={isPlaying ? "Pause" : "Play"}
            className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/60 hover:opacity-90"
            style={{ color: "#FFFFFF" }}
          >
            {/* SVG Progress Circle */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 24 24"
            >
              {/* Background ring */}
              <circle
                cx="12"
                cy="12"
                r={RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.75"
              />
              {/* Active animated stroke */}
              <circle
                cx="12"
                cy="12"
                r={RADIUS}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={isPlaying ? strokeDashoffset : CIRCUMFERENCE}
                className="transition-all"
              />
            </svg>

            {/* Play/Pause Icon */}
            {isPlaying ? (
              <Pause size={9} className="fill-white text-white" strokeWidth={0} />
            ) : (
              <Play size={9} className="fill-white text-white translate-x-[0.5px]" strokeWidth={0} />
            )}
          </button>
        </div>

        {/* Center: Notice text + Action CTA link */}
        <div className="flex-1 flex justify-center items-center text-center px-1 sm:px-2 min-h-[22px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={isMounted ? { opacity: 0, y: 7 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 leading-tight"
            >
              <span
                className="font-medium text-white text-[11px] sm:text-[13px] tracking-wide"
                style={{ color: "#FFFFFF" }}
              >
                {current.text}
              </span>
              <Link
                href={current.href}
                className="font-semibold text-white underline underline-offset-4 decoration-white/90 hover:decoration-white hover:text-amber-200 transition-colors text-[11px] sm:text-[13px] whitespace-nowrap"
                style={{ color: "#FFFFFF" }}
              >
                {current.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Optical counterweight spacer so text is centered between margins */}
        <div className="flex-shrink-0 w-6" aria-hidden="true" />
      </div>
    </div>
  );
}
