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
    name: "Forbes",
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
    <section className="w-full bg-white py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-10 lg:px-20">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.span
            variants={fadeIn}
            custom={0}
            className="font-body text-[11px] font-bold tracking-[0.3em] text-[#C8892A] uppercase block mb-3"
          >
            Global Recognition
          </motion.span>
          <motion.h2
            variants={fadeIn}
            custom={1}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410]"
          >
            Featured In
          </motion.h2>
          <motion.p
            variants={fadeIn}
            custom={2}
            className="font-body text-base text-[#3D2B1F]/80 mt-4 max-w-2xl mx-auto"
          >
            Honored to be recognized by leading publications worldwide for our commitment to preserving India&apos;s tribal heritage
          </motion.p>
        </motion.div>
      </div>

      {/* Auto-scrolling carousel - full width */}
      <div className="relative overflow-hidden w-full">
        <motion.div
          className="flex gap-8"
          animate={{
            x: -((FEATURED_IN.length * 128) + (FEATURED_IN.length - 1) * 32),
          }}
          transition={{
            x: {
              duration: 25,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
        >
            {duplicatedItems.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              >
                {/* Instagram-style circular logo with gradient ring */}
                <Link 
                  href={item.url} 
                  className="relative" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Logo container */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#EAE6D9] bg-[#F2EFEA] flex items-center justify-center p-2">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Name */}
                <div className="mt-4 text-center">
                  <p className="font-body text-sm font-semibold text-[#1A1410] group-hover:text-[#C8892A] transition-colors">
                    {item.name}
                  </p>
                </div>
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
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full border-2 border-[#EAE6D9] bg-[#F2EFEA] flex items-center justify-center p-3">
                  <Image
                    src={hoveredItem.logo}
                    alt={hoveredItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-display text-2xl text-[#1A1410] mb-2">{hoveredItem.name}</h3>
                <p className="font-body text-sm text-[#1A1410] font-medium leading-relaxed">{hoveredItem.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </section>
  );
}
