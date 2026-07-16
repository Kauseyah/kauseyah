"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

interface FeaturedItem {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

const FEATURED_IN: FeaturedItem[] = [
  {
    id: "f1",
    name: "Humans of Chattisgarh",
    logo: "/images/featured/f1.jpeg",
    url: "#",
    description: "Featured for sustainable handloom collection",
  },
  {
    id: "f2",
    name: "200 Million Artisans",
    logo: "/images/featured/f2.jpeg",
    url: "#",
    description: "Recognized for empowering tribal artisans",
  },
  {
    id: "f3",
    name: "Women's Web",
    logo: "/images/featured/f3.jpeg",
    url: "#",
    description: "Documentary on traditional weaving techniques",
  },
  {
    id: "f4",
    name: "Wonder Women Wednesday",
    logo: "/images/featured/f4.jpeg",
    url: "#",
    description: "Spotlight on indigenous textile art",
  },
  {
    id: "f5",
    name: "Dainik Navin Kadam",
    logo: "/images/featured/f5.jpeg",
    url: "#",
    description: "Covered for preserving heritage crafts",
  },
  {
    id: "f6",
    name: "Amazon Karigar",
    logo: "/images/featured/f6.jpeg",
    url: "#",
    description: "Featured for modern tribal fashion",
  },
];

export default function FeaturedIn() {
  const [hoveredItem, setHoveredItem] = useState<FeaturedItem | null>(null);
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...FEATURED_IN, ...FEATURED_IN, ...FEATURED_IN];

  return (
    <section className="w-full pt-8 pb-12 lg:pt-8 lg:pb-16 overflow-hidden border-b border-[#FFD4A8]" style={{ background: 'linear-gradient(180deg, #FFF8F3 0%, #FFFFFF 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12 max-w-4xl mx-auto">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            Press & <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Mentions</span>
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
             Honored to be recognized by leading publications worldwide for our commitment to preserving artisan legacy.
          </p>
        </div>
      </div>

      {/* Auto-scrolling carousel - bigger & clearer */}
      <div className="relative overflow-hidden w-full flex">
        <motion.div
          className="flex gap-20 md:gap-40 items-center whitespace-nowrap px-10"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
              duration: 35,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
          }}
        >
            {[...FEATURED_IN, ...FEATURED_IN, ...FEATURED_IN, ...FEATURED_IN].map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="flex-shrink-0 flex flex-col items-center gap-6 group cursor-pointer"
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative w-40 h-24 md:w-60 md:h-32 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-body text-[13px] font-bold tracking-[0.1em] text-[#111111]/60 uppercase transition-colors group-hover:text-[#FF6B00]">
                  {item.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Centered popup on hover */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full border-2 border-[#E5E5E5] bg-[#FFFFFF] flex items-center justify-center p-3">
                  <Image
                    src={hoveredItem.logo}
                    alt={hoveredItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-display text-2xl text-[#111111] mb-2">{hoveredItem.name}</h3>
                <p className="font-body text-sm text-[#111111] font-medium leading-relaxed">{hoveredItem.description}</p>
                <div className="w-12 h-0.5 bg-[#FF6B00] mx-auto mt-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </section>
  );
}
