 
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useRef } from "react";

const COLLECTION_CATEGORIES = [
  {
    title: "Explore our Shadi collection",
    src: "/images/shadi_collection.png",
    subtitle: "Heritage Bridal",
    gridClass: "lg:col-span-8 lg:row-span-1",
    position: "center 15%",
    href: "/collections/handlooms?subcategory=Sarees"
  },
  {
    title: "Contemporary Menswear",
    src: "/images/menswear.png",
    subtitle: "Modern Heritage",
    gridClass: "lg:col-span-4 lg:row-span-1",
    position: "center 10%",
    href: "/collections/kosa-jackets"
  },
  {
    title: "Get your custom outfit done",
    src: "/images/custom_outfit.png",
    subtitle: "Artisan Bespoke",
    gridClass: "lg:col-span-4 lg:row-span-1",
    position: "center 20%",
    href: "/collections/handlooms?subcategory=Easy+Cotton+Kurtis"
  },
  {
    title: "Shop our seasonal edit",
    src: "/images/seasonal_edit.png",
    subtitle: "Curated Handloom",
    gridClass: "lg:col-span-8 lg:row-span-1",
    position: "center 15%",
    href: "/collections/jewellery"
  }
];

function BentoCard({ cat, i }: { cat: typeof COLLECTION_CATEGORIES[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // ── Hover Tilt Logic ──
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={cat.href} className={`block ${cat.gridClass} h-[260px] sm:h-[340px] lg:h-[420px] xl:h-[520px]`}>
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative cursor-pointer w-full h-full rounded-2xl overflow-hidden perspective-1000"
    >
      {/* ── Image with Deep Parallax ── */}
      <motion.div 
        style={{ transformStyle: "preserve-3d", translateZ: -20 }}
        className="absolute inset-0"
      >
        <Image 
          src={cat.src} 
          alt={cat.title} 
          fill 
          style={{ objectPosition: cat.position }}
          className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700" />
      </motion.div>

      {/* ── Floating Content (Parallax Forward) ── */}
      <div 
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white pointer-events-none"
      >

        
        <div className="flex items-end justify-between gap-6 overflow-visible">
           <div className="max-w-[80%]">
              <motion.span className="font-body text-xs font-semibold text-[#FF6B00] block mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform -translate-y-2 group-hover:translate-y-0">
                {cat.subtitle}
              </motion.span>
              <h3 className="font-display text-4xl lg:text-6xl leading-[0.9] tracking-tighter drop-shadow-2xl group-hover:text-[#FF6B00] transition-colors duration-500">
                {cat.title}
              </h3>
           </div>
           
           <motion.div 
             style={{ translateZ: 80 }}
             className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-xl bg-white/10 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500"
           >
              <ArrowUpRight size={28} />
           </motion.div>
        </div>
      </div>

      {/* ── Shine Effect ── */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000" />
    </motion.div>
    </Link>
  );
}

export default function LifestyleGallery() {
  return (
    <section className="w-full py-12 lg:py-16 overflow-hidden relative bg-[#FFFDFB]">
      
      {/* ── Background Detail ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dotPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
             <circle cx="20" cy="20" r="1.5" fill="#FF6B00" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12 max-w-4xl mx-auto">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            Curated <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Craft</span> Universes
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
             Go beyond the product and discover the people, places, and traditions behind every Kauseyah creation. From weaving villages and tribal communities to the hands that preserve India's living heritage, our journey is woven into everything we make
          </p>
        </div>

        {/* ── 3D Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {COLLECTION_CATEGORIES.map((cat, i) => (
            <BentoCard key={cat.title} cat={cat} i={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
