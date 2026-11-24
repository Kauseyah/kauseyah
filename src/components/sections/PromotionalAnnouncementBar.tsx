"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, X, ExternalLink } from "lucide-react";
import { AnnouncementBarItem, getEligibleAnnouncements } from "@/app/actions/campaign-actions";

export interface AnnouncementNotice {
  id: string;
  text: string;
  cta: string;
  href: string;
}

const DEFAULT_NOTICES: AnnouncementNotice[] = [
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
const DISMISSED_STORAGE_KEY = "kauseyah_dismissed_announcements";

interface Props {
  initialAnnouncements?: AnnouncementBarItem[] | null;
}

export default function PromotionalAnnouncementBar({ initialAnnouncements }: Props) {
  const [announcements, setAnnouncements] = useState<AnnouncementBarItem[]>(initialAnnouncements || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  // Fetch announcements on mount if not provided via props
  useEffect(() => {
    setIsMounted(true);
    startTimeRef.current = Date.now();

    async function loadData() {
      try {
        const items = await getEligibleAnnouncements();
        if (items && items.length > 0) {
          // Check dismissed from localStorage
          let dismissed: string[] = [];
          try {
            dismissed = JSON.parse(localStorage.getItem(DISMISSED_STORAGE_KEY) || "[]");
          } catch {
            dismissed = [];
          }
          const eligible = items.filter((a: AnnouncementBarItem) => !dismissed.includes(a.id));
          if (eligible.length > 0) {
            setAnnouncements(eligible);
          }
        }
      } catch {
        // Silently preserve default notices
      }
    }

    if (!initialAnnouncements || initialAnnouncements.length === 0) {
      loadData();
    }
  }, [initialAnnouncements]);

  const hasDynamic = announcements.length > 0;
  const itemCount = hasDynamic ? announcements.length : DEFAULT_NOTICES.length;

  // Smooth circular countdown timer loop
  useEffect(() => {
    if (!isPlaying || itemCount <= 1) {
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
        setCurrentIndex((prev) => (prev + 1) % itemCount);
        startTimeRef.current = Date.now();
        setProgress(0);
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentIndex, itemCount, progress]);

  // Handle dismissal
  const handleDismiss = (id: string) => {
    try {
      const dismissed: string[] = JSON.parse(localStorage.getItem(DISMISSED_STORAGE_KEY) || "[]");
      if (!dismissed.includes(id)) {
        dismissed.push(id);
        localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(dismissed));
      }
    } catch {
      // Storage error ignored
    }

    const remaining = announcements.filter(a => a.id !== id);
    setAnnouncements(remaining);
    if (currentIndex >= remaining.length) {
      setCurrentIndex(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const currentDynamic = hasDynamic ? announcements[currentIndex % announcements.length] : null;
  const currentDefault = !hasDynamic ? DEFAULT_NOTICES[currentIndex % DEFAULT_NOTICES.length] : null;

  const bgColor = currentDynamic?.background_color || "#851A36";
  const textColor = currentDynamic?.text_color || "#FFFFFF";

  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div
      data-announcement-bar="true"
      role="region"
      aria-label="Shipping and Store Announcements"
      className="relative z-50 w-full select-none border-b border-black/15 overflow-hidden font-body transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "38px",
      }}
    >
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-[13px]">
        {/* Left: Pause/Play with animated circular countdown ring */}
        <div className="flex-shrink-0 flex items-center pr-2">
          {itemCount > 1 ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause announcement rotation" : "Play announcement rotation"}
              title={isPlaying ? "Pause" : "Play"}
              className="relative w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/60 hover:opacity-90"
              style={{ color: textColor }}
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
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.75"
                />
                {/* Active animated stroke */}
                <circle
                  cx="12"
                  cy="12"
                  r={RADIUS}
                  fill="none"
                  stroke={textColor}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={isPlaying ? strokeDashoffset : CIRCUMFERENCE}
                  className="transition-all"
                />
              </svg>

              {/* Play/Pause Icon */}
              {isPlaying ? (
                <Pause size={9} style={{ fill: textColor, color: textColor }} strokeWidth={0} />
              ) : (
                <Play size={9} style={{ fill: textColor, color: textColor }} className="translate-x-[0.5px]" strokeWidth={0} />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" aria-hidden="true" />
          )}
        </div>

        {/* Center: Notice text + Action CTA link */}
        <div className="flex-1 flex justify-center items-center text-center px-1 sm:px-2 min-h-[22px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {currentDynamic ? (
              <motion.div
                key={currentDynamic.id}
                initial={isMounted ? { opacity: 0, y: 7 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 leading-tight"
              >
                <span
                  className="font-medium text-[11px] sm:text-[13px] tracking-wide"
                  style={{ color: textColor }}
                >
                  {currentDynamic.message}
                </span>
                {currentDynamic.cta_text && currentDynamic.cta_url && (
                  <Link
                    href={currentDynamic.cta_url}
                    className="font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-[11px] sm:text-[13px] whitespace-nowrap inline-flex items-center gap-1"
                    style={{ color: textColor }}
                  >
                    <span>{currentDynamic.cta_text}</span>
                    <ExternalLink size={11} />
                  </Link>
                )}
              </motion.div>
            ) : currentDefault ? (
              <motion.div
                key={currentDefault.id}
                initial={isMounted ? { opacity: 0, y: 7 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 leading-tight"
              >
                <span
                  className="font-medium text-[11px] sm:text-[13px] tracking-wide"
                  style={{ color: textColor }}
                >
                  {currentDefault.text}
                </span>
                <Link
                  href={currentDefault.href}
                  className="font-semibold underline underline-offset-4 decoration-white/90 hover:decoration-white hover:text-amber-200 transition-colors text-[11px] sm:text-[13px] whitespace-nowrap"
                  style={{ color: textColor }}
                >
                  {currentDefault.cta}
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right: Dismiss button or optical counterweight spacer */}
        <div className="flex-shrink-0 flex items-center justify-end w-6">
          {currentDynamic && currentDynamic.is_dismissible ? (
            <button
              type="button"
              onClick={() => handleDismiss(currentDynamic.id)}
              aria-label="Dismiss announcement"
              title="Dismiss"
              className="p-1 rounded opacity-75 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
              style={{ color: textColor }}
            >
              <X size={14} />
            </button>
          ) : (
            <div className="w-6" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
