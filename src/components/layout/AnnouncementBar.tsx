"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    id: "shipping",
    text: "Free shipping for all orders above ₹6,000 within India.",
    cta: "Shop Now",
    href: "/products",
  },
  {
    id: "craft",
    text: "India's tribal handloom heritage, ethically woven by hands.",
    cta: "Explore Collections",
    href: "/collections/handlooms",
  },
  {
    id: "conscious",
    text: "Conscious upcycled textiles & sustainable artisan gifts.",
    cta: "Discover More",
    href: "/collections/upcycled-waste",
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside 
      aria-label="Store Announcements"
      className="relative z-50 w-full bg-[#851A36] text-white py-2 px-3 sm:px-6 select-none border-b border-black/10 overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto flex items-center justify-between text-xs sm:text-[13px] font-body">
        
        {/* Left: Pause/Play toggle (matching the reference UI) */}
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause announcement carousel" : "Play announcement carousel"}
            title={isPlaying ? "Pause" : "Play"}
            className="w-6 h-6 rounded-full border border-white/40 hover:border-white flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={10} className="fill-current" />
            ) : (
              <Play size={10} className="fill-current translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Center: Animated Announcement Text */}
        <div className="flex-1 flex justify-center items-center text-center px-2 min-h-[22px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 leading-tight"
            >
              <span className="font-normal text-white/95 tracking-wide text-[11px] sm:text-xs">
                {current.text}
              </span>
              <Link
                href={current.href}
                className="font-semibold underline underline-offset-4 decoration-white/70 hover:decoration-white hover:text-[#FFD4A8] transition-colors text-[11px] sm:text-xs whitespace-nowrap"
              >
                {current.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Balance spacer to keep center perfectly centered */}
        <div className="flex-shrink-0 w-6 hidden sm:block" aria-hidden="true" />
      </div>
    </aside>
  );
}

