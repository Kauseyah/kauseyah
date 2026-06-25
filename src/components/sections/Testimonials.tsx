"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const TESTIMONIALS = [
  {
    name: "Aanya Sharma",
    location: "Mumbai",
    text: "The Ikat feels like wearing a breathing piece of history. You simply can't find this richness in fast fashion. Every detail is exquisite.",
  },
  {
    name: "Priyanka Desai",
    location: "New York",
    text: "The authenticity of Kauseyah's work shines through. I wore this to a gala, and it sparked endless conversations.",
  },
  {
    name: "Kriti Rao",
    location: "Bangalore",
    text: "Knowing my purchase supports artisan families makes this so meaningful. The detail is breathtaking.",
  },
  {
    name: "Neha Gupta",
    location: "Delhi",
    text: "Finally, a brand that practices what it preaches. The transparency gives me absolute trust in Kauseyah.",
  },
  {
    name: "Meghna Iyer",
    location: "Chennai",
    text: "Incredibly soft against the skin, and the heritage makes it a masterpiece. It's an absolute privilege to own.",
  }
];

export default function Testimonials() {
  return (
    // Switching back to the site's light sand theme, ensuring text is dark
    <section 
      className="w-full relative py-16 lg:py-28 overflow-hidden text-[#1A1410]"
      style={{
        backgroundColor: "#F9F5EE",
        borderTop: "1px solid #EAE6D9"
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* ── Header ── 
            Removed motion trigger from header entirely to guarantee visibility if intersection observer was failing. */}
        <div className="text-center mb-20 flex flex-col items-center">
          <span className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
            Words From Our Patrons
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410] mb-6">
            The Kauseyah Experience
          </h2>
          <p className="font-body text-lg lg:text-xl text-[#1A1410]/70 max-w-2xl mx-auto leading-relaxed">
            Discover how our handwoven textiles have touched lives. Our patrons share their stories of authenticity, elegance, and the timeless art of Kauseyah.
          </p>
        </div>

        {/* ── Full Width Moving Carousel ── */}
        <div className="overflow-hidden relative flex items-stretch py-4">
          <motion.div
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 35,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
              <div key={index} className="w-[320px] md:w-[400px] flex-shrink-0 h-full">
                <TestimonialCard item={item} index={index % TESTIMONIALS.length} className="h-full" />
              </div>
            ))}
          </motion.div>

          {/* Light gradient overlays to soften edges of the carousel */}
          <div className="absolute top-0 bottom-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-[#F9F5EE] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-[#F9F5EE] to-transparent z-10 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ item, index, className = "" }: { item: any, index: number, className?: string }) {
  return (
    <div
      className={`group flex flex-col bg-[#F3EFE6] p-8 lg:p-10 border border-[#EAE6D9] rounded-xl hover:bg-white hover:border-[#C8892A]/40 hover:shadow-[0_20px_50px_rgba(200,137,42,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-start mb-6">
        <span className="font-display text-5xl text-[#DAB785] leading-[0.5] block mt-2 opacity-80">
          &ldquo;
        </span>
        <div className="flex gap-[2px] text-[#C8892A]">
          {/* Five tiny stars */}
          {[1,2,3,4,5].map(star => (
            <svg key={star} width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
      </div>
      
      <p className="font-body text-[14px] xl:text-[15px] text-[#2A231C]/90 leading-relaxed mb-6 flex-1">
        {item.text}
      </p>
      
      <div className="flex items-center gap-4 mt-auto border-t border-[#EAE6D9]/80 pt-5">
        <div className="flex flex-col">
          <span className="font-display text-xl font-bold text-[#1A1410] tracking-wide">
            {item.name}
          </span>
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C5E20] mt-1">
            {item.location}
          </span>
        </div>
      </div>
    </div>
  );
}
