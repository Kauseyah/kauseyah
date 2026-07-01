"use client";

import { motion, useInView } from "framer-motion";
import { Fingerprint, HandHeart, Clock, Leaf, Shield, Award } from "lucide-react";
import { useRef } from "react";

const ETHOS_ITEMS = [
  {
    icon: Fingerprint,
    number: "01",
    title: "Ancestral Tribal Art",
    desc: "Reviving Gond & Bhil motifs.",
    tag: "Heritage",
  },
  {
    icon: HandHeart,
    number: "02",
    title: "Artisan Patronage",
    desc: "Direct rewards for 50+ families.",
    tag: "Ethics",
  },
  {
    icon: Clock,
    number: "03",
    title: "Slow Craft Luxury",
    desc: "15 to 45 days of meditation.",
    tag: "Process",
  },
  {
    icon: Leaf,
    number: "04",
    title: "Earth Harmony",
    desc: "Organic cotton & wild silk.",
    tag: "Nature",
  },
  {
    icon: Shield,
    number: "05",
    title: "Cultural Sovereignty",
    desc: "Protecting indigenous IP.",
    tag: "Legacy",
  },
  {
    icon: Award,
    number: "06",
    title: "Timeless Heirlooms",
    desc: "Built to outlive trends.",
    tag: "Quality",
  },
];

function FlowNode({ item, index }: { item: typeof ETHOS_ITEMS[0]; index: number }) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex flex-col items-center text-center px-4 py-8 z-20 group"
    >
      {/* Node Circle */}
      <div className="relative mb-6">
        <div className={`w-16 h-16 rounded-full bg-white border-2 border-[#FF6B00] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-[#FF6B00] group-hover:text-white transition-all duration-500`}>
          <span className="font-display text-xl italic font-black transition-colors duration-500">
            {item.number}
          </span>
        </div>
        {/* Pulsing Ring */}
        <div className="absolute inset-0 w-full h-full rounded-full border border-[#FF6B00]/30 animate-ping group-hover:animate-none opacity-20" />
      </div>

      {/* Text Content */}
      <div className="max-w-[160px]">
        <h3 className="font-display text-lg font-bold text-[#111111] mb-2 leading-tight uppercase tracking-wide group-hover:text-[#FF6B00] transition-colors duration-300">
          {item.title}
        </h3>
        <p className="font-body text-[11px] text-[#333333]/70 font-medium leading-relaxed">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="relative w-full py-20 lg:py-28 bg-[#FFF8F3] overflow-hidden">
      
      {/* ── Background: Complex Textile Pattern ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.2]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="kauseyahPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Diamond Grid */}
              <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#FF6B00" strokeWidth="0.5" />
              {/* Inner Motifs */}
              <circle cx="40" cy="40" r="3" fill="#FF6B00" fillOpacity="0.2" />
              <circle cx="40" cy="40" r="1" fill="#FF6B00" />
              {/* Horizontal Weft Lines */}
              <line x1="0" y1="20" x2="80" y2="20" stroke="#FF6B00" strokeWidth="0.25" strokeDasharray="2 4" />
              <line x1="0" y1="60" x2="80" y2="60" stroke="#FF6B00" strokeWidth="0.25" strokeDasharray="2 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kauseyahPattern)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* ── Standardized Header ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12 max-w-4xl mx-auto">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            The <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Kauseyah</span> Ethos
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 leading-relaxed font-medium">
             A commitment to slow craft, tribal autonomy, and the preservation of ancestral wisdom.
          </p>
        </div>

        {/* ── Flow Chart Container (Desktop: Horizontal, Mobile: Vertical) ── */}
        <div className="relative">
          
          {/* Connecting Thread Path (Desktop) */}
          <div className="hidden lg:block absolute top-[32px] left-[8%] right-[8%] h-px z-0">
             <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="overflow-visible">
               <motion.path
                 d="M 0 10 H 100"
                 fill="none"
                 stroke="#FF6B00"
                 strokeWidth="0.5"
                 strokeDasharray="1 2"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 3, ease: "easeInOut" }}
               />
               {/* Animated Thread Tip (The Needle) */}
               <motion.circle
                 r="1"
                 fill="#FF6B00"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1, cx: [0, 100] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 cy="10"
               />
             </svg>
          </div>

          {/* Simple Grid Flow */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 lg:gap-0 relative">
             {ETHOS_ITEMS.map((item, index) => (
                <FlowNode key={item.number} item={item} index={index} />
             ))}
          </div>

        </div>



      </div>
    </section>
  );
}


