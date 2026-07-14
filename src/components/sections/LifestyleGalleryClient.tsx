"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useRef } from "react";

function BentoCard({ cat, i }: { cat: any; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // ── Hover Tilt Logic ──
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
    <Link
      href={cat.href}
      className={`block w-full h-full perspective-1000 ${cat.gridClass}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full h-[400px] lg:h-[500px] xl:h-[600px] rounded-xl lg:rounded-2xl overflow-hidden bg-sand shadow-lg"
      >
        {/* Parallax Image */}
        <div 
          className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        >
          <Image
            src={cat.src}
            alt={cat.title}
            fill
            className="object-cover"
            style={{ objectPosition: cat.position || "center" }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
          />
        </div>

        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Subtle Light Reflection (Glassmorphism hint) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 transition-opacity duration-700 pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end transform-gpu translate-z-10">
          <div className="overflow-hidden mb-3">
            <motion.span 
              className="font-body text-[11px] lg:text-[13px] font-bold tracking-[0.2em] text-[#FF6B00] uppercase block translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]"
            >
              {cat.subtitle}
            </motion.span>
          </div>
          
          <div className="flex items-end justify-between">
            <h3 className="font-display text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight leading-[1.1] max-w-[80%] drop-shadow-sm group-hover:text-[#FF6B00] transition-colors duration-500">
              {cat.title}
            </h3>
            
            {/* Animated Button */}
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-[#FF6B00] group-hover:border-[#FF6B00] transition-all duration-500 overflow-hidden relative">
              <ArrowUpRight strokeWidth={1.5} size={24} className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function LifestyleGalleryClient({ categories }: { categories: any[] }) {
  return (
    <section className="w-full py-12 lg:py-16 overflow-hidden relative bg-[#FFFDFB]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4 text-[#111111]"
            >
              Curated for <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Your Lifestyle</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-base lg:text-lg text-[#111111]/70 leading-relaxed max-w-xl"
            >
              From the weavers' looms to your contemporary wardrobe. Explore collections that seamlessly blend heritage with modern aesthetics.
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 grid-rows-none lg:grid-rows-2 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <BentoCard key={i} cat={cat} i={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
