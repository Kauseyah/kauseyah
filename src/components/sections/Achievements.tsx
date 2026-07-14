 
 
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * 21 JOURNEY MILESTONES
 */
const CATEGORIES = [
  {
    id: "media",
    label: "Media & Press",
    images: [
      { url: "/images/achivements/Paper media.jpeg", title: "National Press Feature" },
      { url: "/images/achivements/Screenshot_2019_0527_213802.png", title: "Digital Recognition" },
      { url: "/images/achivements/final walk.png", title: "Fashion Week Finale" },
      { url: "/images/achivements/Featured on amazon blog page.jpg", title: "Amazon Spotlight" },
      { url: "/images/achivements/IPL.jpeg", title: "IPL Craft Partnership" },
      { url: "/images/achivements/IPL 3.jpeg", title: "Stadium Reveal" },
      { url: "/images/achivements/IPL (2).jpeg", title: "Sporting Heritage" }
    ]
  },
  {
    id: "features",
    label: "Global Impact",
    images: [
      { url: "/images/achivements/Featured by Smriti Irani Ji on her social account.jpeg", title: "Smriti Irani Feature" },
      { url: "/images/achivements/Story feature by humans of Chhattisgarh.jpg", title: "Humans of Chhattisgarh" },
      { url: "/images/achivements/award.jpeg", title: "Excellence Award" },
      { url: "/images/achivements/Screenshot_20210902-102634_Instagram.jpg", title: "Global Instagram Feature" },
      { url: "/images/achivements/Screenshot_20221017-211643_Chrome.jpg", title: "Digital Heritage Story" },
      { url: "/images/achivements/Screenshot_20230213_123121_Instagram.jpg", title: "Artisan Advocacy" }
    ]
  },
  {
    id: "artisans",
    label: "Artisan Clusters",
    images: [
      { url: "/images/achivements/20231012_111946.jpg", title: "Cluster Documentation" },
      { url: "/images/achivements/IMG_20190209_205744.JPG", title: "Weaver Workshop" },
      { url: "/images/achivements/IMG_20190427_230812.jpg", title: "Heritage Loom" },
      { url: "/images/achivements/IMG_20190427_234805.jpg", title: "Community Craft" },
      { url: "/images/achivements/IMG_20190428_021339.JPG", title: "Village Portrait" },
      { url: "/images/achivements/IMG_20190428_022253.JPG", title: "Master Weaver" },
      { url: "/images/achivements/IMG_20190724_112733.JPG", title: "Silk Production" },
      { url: "/images/achivements/IMG_20231029_142007_030 (1).jpg", title: "Modern Weave" }
    ]
  }
];

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("media");
  const [selectedImg, setSelectedImg] = useState<any>(null);

  const activeCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[0];

  return (
    <section className="w-full py-12 lg:py-16 bg-[#FFFDFB] relative">
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-[#111111]">
        
        {/* ── Heading ── */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-12">

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-10 leading-[0.85] text-[#111111]"
          >
            Heritage <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Archive</span>
          </motion.h2>
          <p className="font-body text-base lg:text-xl text-[#111111]/70 max-w-xl leading-relaxed font-medium">
            Ten years of bridging ancient tribal looms with modern global recognition.
          </p>
        </div>

        {/* ── Clean Typography Filter ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-14 mb-10 lg:mb-12">
          {CATEGORIES.map((cat, i) => (
            <React.Fragment key={cat.id}>
              <button
                onClick={() => setActiveTab(cat.id)}
                className="group relative py-2 transition-all duration-300"
              >
                <span className={`font-body text-[10px] sm:text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] transition-colors duration-500 ${
                  activeTab === cat.id ? "text-[#111111]" : "text-[#111111]/40 hover:text-[#111111]"
                }`}>
                  {cat.label}
                </span>

                <motion.div
                  initial={false}
                  animate={{
                    width: activeTab === cat.id ? "100%" : "0%",
                    opacity: activeTab === cat.id ? 1 : 0
                  }}
                  className="absolute bottom-0 left-0 h-0.5 bg-[#111111]"
                />
              </button>
              {i < CATEGORIES.length - 1 && (
                <div key={`sep-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#111111]/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Grid: Direct Images (No Frames) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-12"
          >
            {activeCategory.images.map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                onClick={() => setSelectedImg(img)}
                className="relative break-inside-avoid group cursor-zoom-in"
              >
                <div className="relative overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-auto object-contain transition-transform duration-[1500ms] group-hover:scale-105" 
                  />
                </div>
                
                {/* Clean caption below (Primary title) */}
                <div className="mt-4">
                   <h3 className="font-display text-2xl lg:text-3xl text-[#111111] leading-none group-hover:text-[#FF6B00] transition-colors">
                     {img.title}
                   </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* ── Lightbox (Pop-up) ── */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/98 backdrop-blur-2xl p-4 sm:p-8 lg:p-16"
          >
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 lg:top-12 lg:right-12 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[110]"
            >
              <X size={28} />
            </button>

            <div className="w-full h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-20 max-w-[1700px]">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full lg:w-3/5 h-[65vh] lg:h-full">
                 <img src={selectedImg.url} alt={selectedImg.title} className="w-full h-full object-contain" />
               </motion.div>
               <div className="w-full lg:w-2/5 text-left">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <span className="font-body text-[11px] font-black tracking-[0.6em] text-[#FF6B00] uppercase block mb-10">Archive Milestone</span>
                    <h3 className="font-display text-3xl sm:text-5xl lg:text-[7.5rem] leading-[0.8] text-[#111111] mb-8 lg:mb-12 tracking-tighter">{selectedImg.title}</h3>
                    <div className="w-20 h-px bg-black mb-12" />
                    <p className="font-body text-xl lg:text-2xl text-[#111111]/70 leading-relaxed font-medium mb-16 italic font-serif">
                       "Bridging the legacy of tribal loom artistry with modern global recognition through a decade of slow craft."
                    </p>
                    <button onClick={() => setSelectedImg(null)} className="font-body text-[11px] font-black tracking-[0.4em] uppercase text-[#111111] border-b-2 border-[#111111] pb-2 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">← Back to Anthology</button>
                  </motion.div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
