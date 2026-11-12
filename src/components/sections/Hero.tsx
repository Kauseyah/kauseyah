"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

export interface HeroSlide {
  id: string;
  type: "video" | "image";
  src: string;
  mobileSrc?: string;
  poster?: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "brand-film",
    type: "video",
    src: "/videos/hVideoNew.mp4",
    poster: "/images/artisan_workshop_portrait_1782640198563.png",
    badge: "Grassroot · Local · Indigenous",
    title: "Woven by hands, rooted in",
    highlight: "heritage",
    description:
      "Handloom sarees, indigenous tribal crafts, and conscious design — created alongside tribal communities to preserve India's living cultural traditions.",
    primaryCtaText: "Explore Handlooms",
    primaryCtaLink: "/collections/apparels",
    secondaryCtaText: "Our Story",
    secondaryCtaLink: "/about",
  },
  {
    id: "festive-kosa",
    type: "image",
    src: "/images/hero/hero-1.webp",
    mobileSrc: "/images/hero/hero-1.webp",
    badge: "Festive Edit · Chhattisgarh Handlooms",
    title: "The Timeless Splendour of",
    highlight: "Kosa Silk",
    description:
      "Authentic wild tussar silks hand-spun by tribal weavers in limited artisanal batches. Celebrate festive grace with breathable, natural heritage drapes.",
    primaryCtaText: "Shop Festive Edit",
    primaryCtaLink: "/collections/sarees",
    secondaryCtaText: "View All Sarees",
    secondaryCtaLink: "/collections/sarees",
  },
  {
    id: "conscious-gifting",
    type: "image",
    src: "/images/seasonal_edit.png",
    mobileSrc: "/images/seasonal_edit.png",
    badge: "Conscious Gifting · Zero-Waste Artisans",
    title: "Handmade Treasures & Thoughtful",
    highlight: "Gift Sets",
    description:
      "Curated gift boxes, hand-bound diaries, and upcycled textile companions lovingly made by rural craftswomen. Gifts that honor tradition and empower communities.",
    primaryCtaText: "Explore Gift Hampers",
    primaryCtaLink: "/collections/gift-hampers",
    secondaryCtaText: "Textile Toys",
    secondaryCtaLink: "/collections/textile-toys",
  },
];

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides = DEFAULT_SLIDES }: HeroProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const activeSlide = slides[currentIdx] || slides[0];

  // Pause automatically if user prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  // Navigate next / prev
  const handleNext = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Keyboard navigation when focused or hovered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered && document.activeElement !== containerRef.current) return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, handleNext, handlePrev]);

  // Auto rotation: 10s for video brand film, 7s for promotional images
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const duration = activeSlide.type === "video" ? 10000 : 7000;
    timerRef.current = setInterval(() => {
      handleNext();
    }, duration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isPlaying, isHovered, activeSlide.type, handleNext]);

  // Sync video play / pause state
  useEffect(() => {
    if (activeSlide.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented; video handles muted inline
        });
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentIdx, activeSlide.type]);

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Kauseyah Handloom and Craft Collections"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-[92dvh] sm:min-h-[100dvh] w-full flex flex-col justify-end overflow-hidden bg-[#1A1412] focus:outline-none"
    >
      {/* ── Background Media Carousel (Video Mode A / Image Mode B) ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {activeSlide.type === "video" ? (
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                src={activeSlide.src}
                poster={activeSlide.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.9,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Responsive Banner Rendering: Mobile vs Desktop */}
              <div className="relative w-full h-full">
                {activeSlide.mobileSrc && activeSlide.mobileSrc !== activeSlide.src ? (
                  <>
                    {/* Mobile specific image */}
                    <div className="block sm:hidden relative w-full h-full">
                      <Image
                        src={activeSlide.mobileSrc}
                        alt={activeSlide.title}
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>
                    {/* Desktop image */}
                    <div className="hidden sm:block relative w-full h-full">
                      <Image
                        src={activeSlide.src}
                        alt={activeSlide.title}
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </>
                ) : (
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.title}
                    fill
                    priority
                    quality={85}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactile Vignette Overlays for Flawless Readability */}
        {/* Bottom vertical gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/55 to-transparent z-[1]" />

        {/* Left horizontal gradient (desktop reading zone) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1412]/85 via-[#1A1412]/45 to-transparent z-[1] hidden sm:block" />

        {/* Top gradient to blend with AnnouncementBar & Navbar */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#1A1412]/85 via-[#1A1412]/40 to-transparent z-[1]" />
      </div>

      {/* ── Editorial Content Overlay ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pb-12 sm:pb-16 lg:pb-20 pt-40 sm:pt-44">
        <div className="grid lg:grid-cols-12 gap-8 items-end">

          {/* Left Column: Authentic Brand Messaging & Editorial Typography */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -15 }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl text-left"
              >
                {/* Cultural Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1412]/80 backdrop-blur-md border border-[#D95D1E]/45 text-[#FFF9F4] mb-4 sm:mb-6 shadow-sm">
                  <Sparkles size={12} className="text-[#D95D1E] shrink-0" />
                  <span className="font-body text-[10px] sm:text-[11.5px] font-semibold tracking-[0.2em] uppercase">
                    {activeSlide.badge}
                  </span>
                </div>

                {/* Editorial Display Headline (Cormorant Garamond) */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.98] text-[#FFF9F4] tracking-tight mb-4 sm:mb-6 drop-shadow-md">
                  {activeSlide.title}{" "}
                  <span className="text-[#D4A359] italic font-light font-display">
                    {activeSlide.highlight}
                  </span>
                </h1>

                {/* Terracotta craft accent line */}
                <div className="w-14 h-[2px] bg-[#D95D1E] mb-4 sm:mb-6" />

                {/* Editorial Description */}
                <p className="font-body text-sm sm:text-base lg:text-lg text-[#FFF9F4]/90 font-light leading-relaxed mb-8 sm:mb-10 max-w-xl drop-shadow">
                  {activeSlide.description}
                </p>

                {/* Functional CTAs */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href={activeSlide.primaryCtaLink}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#D95D1E] hover:bg-[#BF4E15] text-[#FFF9F4] px-7 sm:px-9 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-[0_8px_24px_rgba(217,93,30,0.35)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#D95D1E]"
                  >
                    <span>{activeSlide.primaryCtaText}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href={activeSlide.secondaryCtaLink}
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white hover:text-[#1A1412] text-[#FFF9F4] border border-white/40 backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span>{activeSlide.secondaryCtaText}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Accessible Slide Switcher Controls */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end gap-3 sm:gap-4 pt-4 lg:pt-0">

            {/* Slide Pill Switcher */}
            <div
              role="tablist"
              aria-label="Carousel slide selectors"
              className="flex items-center gap-1.5 sm:gap-2 bg-[#1A1412]/85 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-lg"
            >
              {slides.map((slide, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <button
                    key={slide.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Switch to slide ${idx + 1}: ${slide.badge}`}
                    onClick={() => setCurrentIdx(idx)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-body transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#D95D1E] text-[#FFF9F4] font-semibold shadow-md"
                        : "text-[#FFF9F4]/70 hover:text-[#FFF9F4] hover:bg-white/10"
                    }`}
                  >
                    {slide.type === "video" ? "01 Film" : `0${idx + 1} Edit`}
                  </button>
                );
              })}

              {/* Pause/Play accessible toggle */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#FFF9F4]/75 hover:text-[#FFF9F4] hover:bg-white/10 transition-colors ml-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50"
                aria-label={isPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
                title={isPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} className="translate-x-[1px]" />}
              </button>
            </div>

            {/* Prev / Next Chevron Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 text-[#FFF9F4] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 text-[#FFF9F4] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
