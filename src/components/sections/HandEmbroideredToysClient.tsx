"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function HandEmbroideredToysClient({ toys }: { toys: any[] }) {
  return (
    <section className="w-full py-12 lg:py-16 overflow-hidden relative bg-[#FFFDFB]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            Hand Embroidered <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Toys</span>
          </motion.h2>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-2xl lg:text-3xl text-[#111111] mb-6 italic hover:text-[#FF6B00] transition-colors"
          >
            Where Nostalgia Comes Alive
          </motion.h3>

          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
            Thoughtfully hand-embroidered fabric toys inspired by India's cherished childhood memories. Made consciously with no plastic and designed to be safe for infants while bringing joy to all ages.
          </p>
        </div>

        {/* ── 3-Card Grid Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {toys.map((toy, i) => (
            <Link
              key={i}
              href={toy.href}
              className={`block ${toy.span} ${toy.height}`}
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-black/5 w-full h-full"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={toy.src}
                  alt={toy.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-700" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end pointer-events-none">
                <div className="overflow-hidden mb-3">
                  <motion.span className="font-body text-[10px] font-bold tracking-[0.4em] text-[#FF6B00] uppercase block translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    {toy.tag || "Nostalgia"}
                  </motion.span>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <h4 className="font-display text-2xl lg:text-4xl text-white tracking-tighter mb-2 group-hover:text-[#FF6B00] transition-colors duration-500">
                      {toy.title}
                    </h4>
                    <p className="font-body text-xs font-semibold text-white/60 tracking-wider w-full truncate">
                      {toy.subtitle}
                    </p>
                  </div>
                  
                  <div className="shrink-0 ml-4 w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/10 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 text-white group-hover:text-[#FF6B00]">
                    <ArrowUpRight strokeWidth={1.5} size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-12 lg:mt-20 flex justify-center">
          <Link
            href="/collections/upcycled-waste"
            className="group inline-flex items-center gap-4 border-b border-[#111111]/30 pb-2 hover:border-[#FF6B00] transition-colors"
          >
            <span className="font-body text-xs font-black tracking-[0.3em] uppercase text-[#111111] group-hover:text-[#FF6B00] transition-colors">
              Shop our conscious toys
            </span>
            <ArrowUpRight size={16} className="text-[#111111] group-hover:text-[#FF6B00] transition-colors" />
          </Link>
        </div>

      </div>
    </section>
  );
}
