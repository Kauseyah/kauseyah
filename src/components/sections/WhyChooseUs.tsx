"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Fingerprint, HandHeart, Clock, Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: (i = 0) => ({
    opacity: 1, x: 0, transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  }),
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show: (i = 0) => ({
    opacity: 1, x: 0, transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  }),
};

const zoomRotate = {
  hidden: { opacity: 0, scale: 0.7, rotate: -15 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const scaleUpPop = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i = 0) => ({
    opacity: 1, scale: 1, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function WhyChooseUs() {
  return (
    // Rich Golden Amber Background
    <section className="w-full bg-[#E5C18D] py-20 lg:py-28 overflow-hidden text-[#1A1410]">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        
        <motion.div 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }} 
          className="text-center mb-20 flex flex-col items-center"
        >
          <motion.span variants={scaleUpPop} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
            The Kauseyah Standard
          </motion.span>
          <motion.h2 variants={scaleUpPop} custom={1} className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410] mb-6">
            Why Choose Us
          </motion.h2>
          <motion.p variants={scaleUpPop} custom={2} className="font-body text-lg lg:text-xl text-[#1A1410]/70 max-w-2xl mx-auto leading-relaxed">
            We operate beyond standard fashion. Every thread is a deliberate act of preserving indigenous art and empowering the brilliant hands that weave it. 
          </motion.p>
        </motion.div>

        {/* ── Central Hub Infographic Layout ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">

          {/* Left Column (2 Points) */}
          <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3 lg:text-right order-2 lg:order-1">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slideInLeft} custom={1} className="flex flex-col lg:items-end">
              <div className="w-12 h-12 bg-[#1A1410] rounded-full flex items-center justify-center text-[#E5C18D] mb-4 lg:ml-auto">
                <Fingerprint size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl mb-2 text-[#1A1410]">Ancestral Heritage</h3>
              <p className="font-body text-[15px] text-[#1A1410]/70 leading-relaxed max-w-[280px] lg:ml-auto">
                Preserving ancient tribal handlooms and indigenous art forms passing down centuries of wisdom.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slideInLeft} custom={2} className="flex flex-col lg:items-end">
              <div className="w-12 h-12 bg-[#1A1410] rounded-full flex items-center justify-center text-[#E5C18D] mb-4 lg:ml-auto">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl mb-2 text-[#1A1410]">Slow Mindful Craft</h3>
              <p className="font-body text-[15px] text-[#1A1410]/70 leading-relaxed max-w-[280px] lg:ml-auto">
                Woven strictly by hand over days. Never compromised by machines or mass production.
              </p>
            </motion.div>
          </div>

          {/* Center Image Hub */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }} 
            variants={zoomRotate} 
            className="w-full lg:w-1/3 px-4 order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[200px] overflow-hidden shadow-2xl border-[8px] border-[#E5C18D] outline outline-1 outline-[#1A1410]/20">
              <Image
                src="/images/artisan-detail.png"
                alt="Kauseyah Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>

          {/* Right Column (2 Points) */}
          <div className="flex flex-col gap-12 lg:gap-24 w-full lg:w-1/3 text-left order-3">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slideInRight} custom={1} className="flex flex-col items-start">
              <div className="w-12 h-12 bg-[#1A1410] rounded-full flex items-center justify-center text-[#E5C18D] mb-4">
                <HandHeart size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl mb-2 text-[#1A1410]">Ethical Impact</h3>
              <p className="font-body text-[15px] text-[#1A1410]/70 leading-relaxed max-w-[280px]">
                Fair wages and direct support for over 50+ artisan families, ensuring zero middlemen.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={slideInRight} custom={2} className="flex flex-col items-start">
              <div className="w-12 h-12 bg-[#1A1410] rounded-full flex items-center justify-center text-[#E5C18D] mb-4">
                <Leaf size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl mb-2 text-[#1A1410]">Earth Harmony</h3>
              <p className="font-body text-[15px] text-[#1A1410]/70 leading-relaxed max-w-[280px]">
                Crafted exclusively with organic fibers and raw vegetable dyes. Zero footprint.
              </p>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
