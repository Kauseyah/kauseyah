"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";

export interface Testimonial {
  id?: string;
  name: string;
  location: string;
  text: string;
  productName?: string;
}

const DEFAULT_GENUINE_TESTIMONIALS: Testimonial[] = [
  {
    name: "Snigdha Goswami",
    location: "Raipur, Chhattisgarh",
    text: "You are doing great work Shweta.. our Chhattisgarh is still hidden from many people. I am very glad you are globalizing our local textile to international platform. Keep doing the good work. All the very best.",
  },
  {
    name: "Apeksha Sethi",
    location: "London, UK",
    text: "Hey Shweta! Trust all is well! I want to confirm — I'll go with the kosa silk saree, orange Banarasi and the toys. Will select and update you shortly! Also, I'm totally okay with paying the courier charges. Let me know the total please? Address you already have — the London one.",
  },
  {
    name: "Ritika Reddy",
    location: "Bangalore, Karnataka",
    text: "The drape, the feel, the comfort.. Have never experienced such with any other saree I've owned. You are creating absolute fabulous pieces and the art is simply outstanding. Received compliments for its uniqueness. Thank you very much for these masterpieces! Wishing your business expands across an even broader spectrum and reaches every woman who loves draping sarees.",
  },
  {
    name: "Rahul Shukla",
    location: "Lucknow, Uttar Pradesh",
    text: "Received the package. As usual it was all perfectly made. Loved all of them. Thank you so much for the special note and the gift. Your items will never go out of trend.",
  },
  {
    name: "Priyanka Tadipatri",
    location: "Bangalore, Karnataka",
    text: "Hi Shweta! Received the saree. It's lovely! Thanks so much for the great work :) Bought this one as a gift, I'm sure they'll love it too!",
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export default function Testimonials({ testimonials = DEFAULT_GENUINE_TESTIMONIALS }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = testimonials.length;

  const next = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (isPaused || count <= 1) return;
    timerRef.current = setInterval(() => {
      next();
    }, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, isPaused, count]);

  return (
    <section
      aria-label="Customer Testimonials and Stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#FFF9F4] border-t border-[#1A1412]/8 overflow-hidden"
    >
      {/* Background Watermark Index */}
      {count > 0 && (
        <div
          aria-hidden="true"
          className="absolute top-12 right-6 lg:right-32 pointer-events-none select-none"
        >
          <span className="font-display text-[160px] sm:text-[240px] lg:text-[340px] text-[#D95D1E]/5 leading-none font-bold">
            0{activeIndex + 1}
          </span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-24 items-center">

          {/* ── Left Column: Section Editorial Title ── */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] w-fit mb-4 shadow-sm">
              <Heart size={12} className="text-[#D95D1E] fill-[#D95D1E]/20" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Customer Voices
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.1] tracking-tight">
              Stories Woven <br />
              <span className="text-[#851A36] italic font-light">with Love</span>
            </h2>

            <div className="w-12 h-[1.5px] bg-[#D95D1E] my-4" />

            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed max-w-md">
              Every Kauseyah creation carries a story. Discover the experiences of customers who have welcomed handcrafted pieces into their lives.
            </p>

            {/* Desktop Navigation & Dots (only when multiple items exist) */}
            {count > 1 && (
              <div className="hidden lg:flex items-center gap-6 mt-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous customer story"
                    className="w-10 h-10 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next customer story"
                    className="w-10 h-10 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Jump to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === i ? "w-6 bg-[#D95D1E]" : "w-1.5 bg-[#1A1412]/20 hover:bg-[#1A1412]/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Testimonial Narrative ── */}
          <div className="relative bg-white/80 backdrop-blur-sm p-6 sm:p-10 lg:p-12 rounded-3xl border border-[#1A1412]/8 shadow-sm">
            <Quote size={32} className="text-[#D95D1E]/40 mb-6" />

            {count === 0 ? (
              /* Graceful Empty State: No manufactured reviews */
              <div className="py-8 text-center sm:text-left">
                <h3 className="font-display text-xl text-[#1A1412] font-semibold mb-2">
                  We are gathering stories from our community.
                </h3>
                <p className="font-body text-sm text-[#665D59] font-light leading-relaxed">
                  Have you recently received a Kauseyah handcrafted piece? We would love to hear how it feels in your home.
                </p>
              </div>
            ) : (
              <div className="min-h-[180px] sm:min-h-[160px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col"
                  >
                    <p className="font-display text-lg sm:text-xl lg:text-2xl text-[#1A1412] leading-[1.65] mb-8 italic font-normal">
                      &ldquo;{testimonials[activeIndex].text}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-[#1A1412]/8">
                      <div className="w-9 h-9 rounded-full bg-[#D95D1E]/10 flex items-center justify-center text-[#D95D1E] font-display font-bold text-base">
                        {testimonials[activeIndex].name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-lg sm:text-xl text-[#1A1412] font-semibold">
                          {testimonials[activeIndex].name}
                        </span>
                        <span className="font-body text-[11px] uppercase font-bold tracking-[0.16em] text-[#D95D1E]">
                          {testimonials[activeIndex].location}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Navigation Controls */}
            {count > 1 && (
              <div className="flex lg:hidden items-center justify-between mt-8 pt-6 border-t border-[#1A1412]/8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous customer story"
                    className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next customer story"
                    className="w-9 h-9 rounded-full border border-[#1A1412]/15 hover:border-[#D95D1E] hover:text-[#D95D1E] flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Jump to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeIndex === i ? "w-5 bg-[#D95D1E]" : "w-1.5 bg-[#1A1412]/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}