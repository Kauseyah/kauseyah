"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Verified Patron",
    location: "Chhattisgarh",
    text: "You are doing great work Shweta.. our Chhattisgarh is still hidden from many people. I am very glad you are globalizing our local textile to international platform. Keep doing the good work. All the very best.",
  },
  {
    name: "International Patron",
    location: "London, UK",
    text: "Hey Shweta! Trust all is well! I want to confirm — I'll go with the kosa silk saree, orange Banarasi and the toys. Will select and update you shortly! Also, I'm totally okay with paying the courier charges. Let me know the total please? Address you already have — the London one.",
  },
  {
    name: "Saree Lover",
    location: "India",
    text: "The drape, the feel, the comfort.. Have never experienced such with any other saree I've owned. You are creating absolute fabulous pieces and the art is simply outstanding. Received compliments for its uniqueness. Thank you very much for these masterpieces! Wishing your business expands across an even broader spectrum and reaches every woman who loves draping sarees.",
  },
  {
    name: "Returning Customer",
    location: "India",
    text: "Received the package. As usual it was all perfectly made. Loved all of them. Thank you so much for the special note and the gift. Your items will never go out of trend.",
  },
  {
    name: "Gift Buyer",
    location: "India",
    text: "Hi Shweta! Received the saree. It's lovely! Thanks so much for the great work :) Bought this one as a gift, I'm sure they'll love it too!",
  },
];

type Testimonial = (typeof TESTIMONIALS)[number];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000); // 6 seconds per story
    return () => clearInterval(timer);
  }, [next]);

  return (
    // Switching back to the site's light sage theme, ensuring text is dark
    <section className="relative w-full py-12 lg:py-16 bg-white overflow-hidden">
      {/* Background Large Number */}
      <div className="absolute top-20 right-10 lg:right-40 pointer-events-none select-none">
        <span className="font-display text-[200px] lg:text-[400px] text-[#FF6B00]/5 leading-none">
          0{activeIndex + 1}
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-32">
          
          {/* ── Standardized Header ── */}
          <div className="flex flex-col pt-10">

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
            >
              Loved by Our <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Clients</span>
            </motion.h2>
            <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium mb-12">
               Hear from those who cherish the silent rhythmic clicking of our ancestral looms.
            </p>

            {/* Navigation Controls below header for layout balance */}
            <div className="hidden lg:flex items-center gap-8 mt-6 md:mt-20">
              <button 
                onClick={prev}
                className="group flex items-center gap-3 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#FF6B00] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="transition-transform group-hover:-translate-x-1">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Prev
              </button>
              <div className="w-12 h-px bg-[#FF6B00]/20" />
              <button 
                onClick={next}
                className="group flex items-center gap-3 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#FF6B00] transition-colors"
              >
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="rotate-180 transition-transform group-hover:translate-x-1">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Right Column: Testimonial Narrative ── */}
          <div className="relative pt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                {/* 5 Stars Accent */}
                <div className="flex gap-1.5 text-[#FF6B00] mb-6">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>

                { }
                <p className="font-display text-xl md:text-2xl lg:text-[28px] text-[#111111] leading-[1.7] mb-10 italic tracking-tight font-medium">
                  &ldquo;{TESTIMONIALS[activeIndex].text}&rdquo;
                </p>

                <div className="flex items-center gap-6">
                  <div className="w-6 h-px bg-[#FF6B00]/30" />
                  <div className="flex flex-col">
                    <span className="font-display text-xl lg:text-2xl text-[#111111]">
                      {TESTIMONIALS[activeIndex].name}
                    </span>
                    <span className="font-body text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF6B00]/60 mt-1">
                       {TESTIMONIALS[activeIndex].location}
                    </span>
                    { }
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation Controls */}
            <div className="flex lg:hidden items-center gap-8 mt-12 pt-8 border-t border-[#FF6B00]/10">
              <button 
                onClick={prev}
                className="group flex items-center gap-3 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#FF6B00] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="transition-transform group-hover:-translate-x-1">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Prev
              </button>
              <div className="w-12 h-px bg-[#FF6B00]/20" />
              <button 
                onClick={next}
                className="group flex items-center gap-3 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#FF6B00] transition-colors"
              >
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="rotate-180 transition-transform group-hover:translate-x-1">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
