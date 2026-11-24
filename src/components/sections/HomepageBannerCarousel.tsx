"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HomepageBanner } from "@/app/actions/campaign-actions";
import Hero from "@/components/sections/Hero";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Pause, 
  Play, 
  Tag 
} from "lucide-react";

interface Props {
  banners?: HomepageBanner[] | null;
  autoPlayInterval?: number;
}

export default function HomepageBannerCarousel({ 
  banners, 
  autoPlayInterval = 5500 
}: Props) {
  // If no banners provided or empty array, fall back cleanly to default Hero
  if (!banners || banners.length === 0) {
    return <Hero />;
  }

  return <ActiveBannerCarousel banners={banners} autoPlayInterval={autoPlayInterval} />;
}

function ActiveBannerCarousel({
  banners,
  autoPlayInterval,
}: {
  banners: HomepageBanner[];
  autoPlayInterval: number;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  
  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const bannerCount = banners.length;
  const currentBanner = banners[currentIdx];

  const handleNext = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % bannerCount);
  }, [bannerCount]);

  const handlePrev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + bannerCount) % bannerCount);
  }, [bannerCount]);

  // Autoplay loop with tab visibility awareness
  useEffect(() => {
    if (!isPlaying || isHovered || bannerCount <= 1 || prefersReduced) return;

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        handleNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, bannerCount, autoPlayInterval, prefersReduced, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // Swiped left -> next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      data-banner-carousel="true"
      aria-label="Promotional Campaign Banners"
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[760px] bg-[#111111] overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Desktop Image */}
          <div className="hidden sm:block absolute inset-0 w-full h-full">
            <Image
              src={currentBanner.desktop_image_url}
              alt={currentBanner.image_alt || currentBanner.heading || "Kauseyah Campaign Banner"}
              fill
              priority={currentIdx === 0}
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Mobile Image (falls back to desktop if not separately set) */}
          <div className="block sm:hidden absolute inset-0 w-full h-full">
            <Image
              src={currentBanner.mobile_image_url || currentBanner.desktop_image_url}
              alt={currentBanner.image_alt || currentBanner.heading || "Kauseyah Campaign Banner"}
              fill
              priority={currentIdx === 0}
              quality={88}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Luxury Atmospheric Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Layer */}
      <div className="relative z-10 max-w-[1500px] h-full mx-auto px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          {/* Badge / Tag */}
          <motion.div
            key={`badge-${currentBanner.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
          >
            {currentBanner.discount_label ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D95D1E] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                <Tag size={12} />
                {currentBanner.discount_label}
              </span>
            ) : null}

            {currentBanner.offer_text ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#851A36]/80 backdrop-blur-xs border border-white/20 text-[#FFF9F4] text-xs font-semibold tracking-wide shadow-xs">
                <Sparkles size={12} className="text-[#FFD700]" />
                {currentBanner.offer_text}
              </span>
            ) : null}

            {!currentBanner.discount_label && !currentBanner.offer_text && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-[#FFF9F4] text-xs font-medium tracking-wider uppercase">
                <Sparkles size={12} className="text-[#D4A359]" />
                Kauseyah Exclusive
              </span>
            )}
          </motion.div>

          {/* Heading */}
          <motion.h1
            key={`heading-${currentBanner.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light text-[#FFF9F4] leading-[1.12] tracking-tight text-balance"
          >
            {currentBanner.heading}
          </motion.h1>

          {/* Subtitle / Description */}
          {(currentBanner.subtitle || currentBanner.description) && (
            <motion.p
              key={`sub-${currentBanner.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg text-[#FFF9F4]/85 font-light leading-relaxed max-w-xl text-pretty"
            >
              {currentBanner.subtitle || currentBanner.description}
            </motion.p>
          )}

          {/* Call to Action Button */}
          {currentBanner.cta_url && currentBanner.cta_text && (
            <motion.div
              key={`cta-${currentBanner.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 flex items-center gap-4"
            >
              <Link
                href={currentBanner.cta_url}
                className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 bg-[#D95D1E] hover:bg-[#c24e16] text-[#FFF9F4] rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-orange-900/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{currentBanner.cta_text}</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Carousel Bottom Controls */}
        {bannerCount > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-12 lg:right-20 flex items-center gap-3 sm:gap-4 z-20">
            {/* Slide Indicators / Dots */}
            <div
              role="tablist"
              aria-label="Banner slide indicators"
              className="flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/15"
            >
              {banners.map((b, idx) => {
                const isActive = idx === currentIdx;
                return (
                  <button
                    key={b.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to slide ${idx + 1}: ${b.heading || b.campaign_name}`}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "w-6 bg-[#D95D1E]" 
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                );
              })}

              {/* Pause/Play Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pause banner auto-rotation" : "Resume banner auto-rotation"}
                title={isPlaying ? "Pause" : "Resume"}
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} className="translate-x-[0.5px]" />}
              </button>
            </div>

            {/* Prev / Next Chevrons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous campaign slide"
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next campaign slide"
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
