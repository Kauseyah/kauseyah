"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
  Sparkles,
  Quote,
} from "lucide-react";

export interface FeaturedItem {
  id: string;
  name: string;
  category: string;
  logo: string;
  url: string;
  description: string;
  quote?: string;
}

export const FEATURED_IN: FeaturedItem[] = [
  {
    id: "f1",
    name: "Humans of Chattisgarh",
    category: "Sustainable Handloom",
    logo: "/images/featured/f1.jpeg",
    url: "#",
    description: "Featured for sustainable handloom collection & tribal craft revival",
    quote:
      "Kauseyah celebrates the untamed beauty of wild Kosa silk and the generational genius of Chhattisgarh's tribal weavers.",
  },
  {
    id: "f2",
    name: "200 Million Artisans",
    category: "Artisan Empowerment",
    logo: "/images/featured/f2.jpeg",
    url: "#",
    description: "Recognized for empowering tribal artisan communities and fair trade",
    quote:
      "A pioneering social enterprise transforming craft heritage into dignified, sustainable livelihoods for rural indigenous creators.",
  },
  {
    id: "f3",
    name: "Women's Web",
    category: "Living Heritage",
    logo: "/images/featured/f3.jpeg",
    url: "#",
    description: "Documentary on traditional weaving techniques & natural vegetable dyeing",
    quote:
      "Revitalizing indigenous looms while empowering women weavers with financial self-reliance and artistic pride.",
  },
  {
    id: "f4",
    name: "Wonder Women Wednesday",
    category: "Leadership Spotlight",
    logo: "/images/featured/f4.jpeg",
    url: "#",
    description: "Spotlight on women artisans steering indigenous textile preservation",
    quote:
      "Inspiring stories of women masters preserving cultural motifs through timeless handloom artistry.",
  },
  {
    id: "f5",
    name: "Dainik Navin Kadam",
    category: "Editorial Press",
    logo: "/images/featured/f5.jpeg",
    url: "#",
    description: "Extensive regional press coverage for preserving endangered tribal craft",
    quote:
      "Honored for dedicated preservation of Chhattisgarh's cultural textile heritage and traditional looms.",
  },
  {
    id: "f6",
    name: "Amazon Karigar",
    category: "Flagship Partner",
    logo: "/images/featured/f6.jpeg",
    url: "#",
    description: "Featured flagship partner for authentic modern tribal fashion and crafts",
    quote:
      "Connecting remote artisan clusters directly to global conscious consumers through authentic ethical luxury.",
  },
];

export default function PressMentionsCarousel() {
  const [activeItem, setActiveItem] = useState<FeaturedItem | null>(null);
  const [isLockedByClick, setIsLockedByClick] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReduced = useReducedMotion();

  // Clear pending dismiss timer
  const clearDismissTimer = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  // Universal close handler
  const handleClose = useCallback(() => {
    clearDismissTimer();
    setActiveItem(null);
    setIsLockedByClick(false);
  }, [clearDismissTimer]);

  // Card hover entry: activates instantly and clears any pending dismiss timer
  const handleCardMouseEnter = useCallback(
    (item: FeaturedItem) => {
      clearDismissTimer();
      setActiveItem(item);
    },
    [clearDismissTimer]
  );

  // Card hover exit: brief grace period allows moving between adjacent cards without flicker
  const handleCardMouseLeave = useCallback(() => {
    if (isLockedByClick) return;
    clearDismissTimer();
    dismissTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 180);
  }, [isLockedByClick, clearDismissTimer]);

  // Spotlight card mouse enter: keep spotlight open if cursor enters the card itself
  const handleSpotlightMouseEnter = useCallback(() => {
    clearDismissTimer();
  }, [clearDismissTimer]);

  // Spotlight card mouse leave
  const handleSpotlightMouseLeave = useCallback(() => {
    if (isLockedByClick) return;
    clearDismissTimer();
    dismissTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 180);
  }, [isLockedByClick, clearDismissTimer]);

  // Card click / tap: sets active item and locks it open for touch / deliberate inspection
  const handleCardClick = useCallback(
    (item: FeaturedItem) => {
      clearDismissTimer();
      setActiveItem(item);
      setIsLockedByClick(true);
    },
    [clearDismissTimer]
  );

  // Dismiss on page scroll or window resize so the spotlight never interrupts page flow
  useEffect(() => {
    const handleScrollOrResize = () => {
      handleClose();
    };
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [handleClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearDismissTimer();
    };
  }, [clearDismissTimer]);

  // Manual scroll handler for carousel buttons
  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth > 768 ? 360 : 260;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // Keyboard navigation: Escape dismisses, Left/Right arrows scroll track
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft" && !activeItem) {
        scroll("left");
      } else if (e.key === "ArrowRight" && !activeItem) {
        scroll("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, handleClose, scroll]);

  // Triple items for seamless continuous infinite marquee
  const marqueeItems = [...FEATURED_IN, ...FEATURED_IN, ...FEATURED_IN];

  // Motion variants with full support for prefers-reduced-motion
  const spotlightVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.88, y: 16 },
    visible: prefersReduced
      ? { opacity: 1 }
      : { opacity: 1, scale: 1, y: 0 },
    exit: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.92, y: 12 },
  };

  const springTransition = prefersReduced
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 450, damping: 28 };

  return (
    <section
      aria-label="Press and Media Mentions"
      className="w-full py-16 sm:py-20 lg:py-24 border-b border-[#1A1412]/8 overflow-hidden select-none relative"
      style={{ background: "linear-gradient(180deg, #FFF8F3 0%, #FFFFFF 100%)" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 mb-8 sm:mb-12">
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-xs">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Global Recognition
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.05] tracking-tight">
              Press &amp;{" "}
              <span className="text-[#D95D1E] italic font-light drop-shadow-xs">
                Mentions
              </span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />

            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Honored to be recognized by leading publications worldwide for our commitment to
              preserving India&apos;s living tribal heritage. Hover any publication logo to explore our feature.
            </p>
          </div>

          {/* Navigation & Autoplay Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* Pause / Play Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full border border-[#1A1412]/15 bg-white/80 hover:border-[#D95D1E] hover:text-[#D95D1E] text-[#1A1412] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#D95D1E]"
              aria-label={isPlaying ? "Pause automatic press rotation" : "Resume automatic press rotation"}
              title={isPlaying ? "Pause rotation" : "Play rotation"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="translate-x-[0.5px]" />}
            </button>

            {/* Prev Arrow Button */}
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll to previous publication"
              className="w-9 h-9 rounded-full border border-[#1A1412]/15 bg-white/80 hover:border-[#D95D1E] hover:text-[#D95D1E] text-[#1A1412] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#D95D1E]"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll to next publication"
              className="w-9 h-9 rounded-full border border-[#1A1412]/15 bg-white/80 hover:border-[#D95D1E] hover:text-[#D95D1E] text-[#1A1412] flex items-center justify-center transition-colors cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-[#D95D1E]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Carousel Marquee Track */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-x-hidden w-full flex py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Publications carousel"
        onMouseLeave={handleCardMouseLeave}
      >
        <motion.div
          className="flex gap-6 sm:gap-8 items-center whitespace-nowrap px-6 sm:px-12"
          animate={
            prefersReduced || !isPlaying || activeItem !== null
              ? false
              : { x: ["0%", "-33.333%"] }
          }
          transition={{
            x: {
              duration: 36,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((item, idx) => {
            const isCurrentlyActive = activeItem?.id === item.id;

            return (
              <div key={`${item.id}-${idx}`} className="flex-shrink-0 relative group">
                <button
                  type="button"
                  onClick={() => handleCardClick(item)}
                  onMouseEnter={() => handleCardMouseEnter(item)}
                  onMouseLeave={handleCardMouseLeave}
                  className={`relative flex flex-col items-center justify-between w-[240px] sm:w-[270px] lg:w-[290px] h-[210px] sm:h-[230px] p-5 rounded-2xl bg-white border text-left transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/40 overflow-hidden ${
                    isCurrentlyActive
                      ? "border-[#D95D1E] shadow-[0_20px_35px_-8px_rgba(217,93,30,0.3)] -translate-y-2 ring-2 ring-[#D95D1E]/40"
                      : "border-[#1A1412]/8 shadow-xs hover:shadow-[0_20px_35px_-8px_rgba(217,93,30,0.22)] hover:border-[#D95D1E]/60 hover:-translate-y-2"
                  }`}
                  aria-label={`View press feature for ${item.name}`}
                  aria-haspopup="dialog"
                  aria-expanded={isCurrentlyActive}
                >
                  {/* Soft Ambient Radial Warm Glow on Active */}
                  <div
                    className={`absolute inset-0 bg-radial from-[#FFF3EC] via-white to-white transition-opacity duration-300 pointer-events-none ${
                      isCurrentlyActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Top Header: Category Tag & Quick Preview Sparkle */}
                  <div className="relative w-full flex items-center justify-between z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                        isCurrentlyActive
                          ? "bg-[#D95D1E] text-white border-[#D95D1E]"
                          : "bg-[#FFF4EE] text-[#D95D1E] border-[#D95D1E]/20 group-hover:bg-[#D95D1E] group-hover:text-white"
                      }`}
                    >
                      {item.category}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isCurrentlyActive
                          ? "bg-[#D95D1E]/15 text-[#D95D1E]"
                          : "bg-[#1A1412]/4 text-[#1A1412]/40 group-hover:bg-[#D95D1E]/10 group-hover:text-[#D95D1E]"
                      }`}
                    >
                      <Sparkles size={11} />
                    </div>
                  </div>

                  {/* HERO LOGO CONTAINER */}
                  <div className="relative w-full h-24 sm:h-26 flex items-center justify-center my-auto z-10 px-2">
                    <div
                      className={`relative w-36 sm:w-44 h-16 sm:h-20 transition-transform duration-300 ease-out ${
                        isCurrentlyActive ? "scale-115 -translate-y-0.5" : "group-hover:scale-110"
                      }`}
                    >
                      <Image
                        src={item.logo}
                        alt={`${item.name} publication logo`}
                        fill
                        sizes="200px"
                        className="object-contain filter drop-shadow-xs transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Bottom Content: Publication Name + Story Teaser */}
                  <div
                    className={`relative w-full z-10 pt-2 border-t transition-colors ${
                      isCurrentlyActive
                        ? "border-[#D95D1E]/30"
                        : "border-[#1A1412]/6 group-hover:border-[#D95D1E]/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-body text-[11px] sm:text-xs font-bold tracking-[0.1em] uppercase truncate transition-colors ${
                          isCurrentlyActive ? "text-[#D95D1E]" : "text-[#1A1412] group-hover:text-[#D95D1E]"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold text-[#D95D1E] flex items-center gap-0.5 transition-all duration-300 ${
                          isCurrentlyActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
                        }`}
                      >
                        Story <ChevronRight size={11} />
                      </span>
                    </div>
                    <p
                      className={`font-body text-[11px] font-normal leading-tight line-clamp-1 mt-1 transition-colors ${
                        isCurrentlyActive ? "text-[#1A1412]" : "text-[#665D59] group-hover:text-[#1A1412]"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Terracotta Accent Line on Hover */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D95D1E] transition-transform duration-300 origin-center ${
                      isCurrentlyActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── CENTRALIZED HERO LOGO SPOTLIGHT POPUP (HOVER & TAP) ─── */}
      <AnimatePresence>
        {activeItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="press-spotlight-title"
          >
            {/* Ambient Background Focus Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className={`absolute inset-0 bg-[#1A1412]/40 backdrop-blur-[2.5px] ${
                isLockedByClick ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
              }`}
            />

            {/* Hero Center-Focused Spotlight Card */}
            <motion.div
              key={`spotlight-${activeItem.id}`}
              variants={spotlightVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={springTransition}
              onMouseEnter={handleSpotlightMouseEnter}
              onMouseLeave={handleSpotlightMouseLeave}
              className="relative bg-white/98 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(217,93,30,0.25)] border-t-4 border-[#D95D1E] max-w-lg w-full text-center overflow-hidden z-10 pointer-events-auto"
            >
              {/* Decorative Warm Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-[#D95D1E]/15 to-transparent blur-2xl pointer-events-none" />

              {/* Close Button for touch users, keyboard users, and explicit exit */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full text-[#1A1412]/50 hover:text-[#1A1412] hover:bg-slate-100/80 transition-colors cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-[#D95D1E]"
                aria-label="Close press spotlight"
              >
                <X size={18} />
              </button>

              {/* Category & Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF4EE] border border-[#D95D1E]/25 text-[#D95D1E] text-xs font-bold tracking-wider uppercase mb-5 shadow-xs">
                <Sparkles size={12} className="text-[#D95D1E]" />
                <span>{activeItem.category}</span>
                <span className="text-[#1A1412]/30">•</span>
                <span className="text-[#665D59] font-medium">Global Feature</span>
              </div>

              {/* HERO PROMINENT LOGO SHOWCASE CONTAINER (PRIMARY FOCAL POINT) */}
              <div className="relative w-full h-32 sm:h-40 mx-auto mb-5 rounded-2xl bg-[#FFF9F4] border border-[#D95D1E]/20 flex items-center justify-center p-4 sm:p-6 shadow-xs">
                <div className="relative w-full h-full">
                  <Image
                    src={activeItem.logo}
                    alt={`${activeItem.name} logo - featured publication`}
                    fill
                    sizes="(max-width: 640px) 280px, 400px"
                    className="object-contain filter drop-shadow-sm transition-transform duration-300"
                    priority
                  />
                </div>
              </div>

              {/* Publication Name in Display Serif Typography */}
              <h3
                id="press-spotlight-title"
                className="font-display text-2xl sm:text-3xl text-[#1A1412] font-semibold tracking-tight mb-2"
              >
                {activeItem.name}
              </h3>

              {/* Feature Context Description */}
              <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed max-w-md mx-auto mb-4">
                {activeItem.description}
              </p>

              {/* Authentic Editorial Quote Box */}
              {activeItem.quote && (
                <div className="relative bg-[#FFF9F4] rounded-2xl p-4 border border-[#1A1412]/8 text-left mb-5 shadow-2xs">
                  <div className="flex gap-2.5">
                    <Quote size={16} className="text-[#D95D1E]/70 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-xs sm:text-sm text-[#1A1412]/85 italic leading-relaxed">
                      &ldquo;{activeItem.quote}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Status Footer and Mobile Dismissal Button */}
              <div className="pt-3 border-t border-[#1A1412]/8 flex items-center justify-between text-[11px] text-[#665D59]">
                <span className="text-[#D95D1E] font-medium flex items-center gap-1">
                  <Sparkles size={11} /> Live Press Spotlight
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 rounded-full bg-[#1A1412]/5 hover:bg-[#D95D1E] hover:text-white transition-colors cursor-pointer text-[#1A1412] font-medium"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
