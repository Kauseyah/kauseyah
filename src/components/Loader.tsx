"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 4 seconds for maximum cinematic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111]"
        >
          <motion.div
            className="flex flex-col items-center justify-center relative"
          >
            {/* Top Text (English) Kinetic 3D Assembly */}
            <div className="pb-1 lg:pb-3 flex items-center perspective-[1000px]">
              <h1 className="font-display text-5xl md:text-7xl lg:text-[7.5rem] text-[#FFFFFF] tracking-widest uppercase leading-none flex" style={{ fontFamily: 'var(--font-display)' }}>
                {"KAUSEYAH".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ 
                      opacity: 0, 
                      y: index % 2 === 0 ? -150 : 150, 
                      x: index % 2 === 0 ? -100 : 100,
                      rotateZ: index % 2 === 0 ? -45 : 45,
                      rotateY: 90,
                      filter: "blur(20px)",
                      scale: 3
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      x: 0,
                      rotateZ: 0,
                      rotateY: 0,
                      filter: "blur(0px)",
                      scale: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      damping: 12, 
                      stiffness: 60, 
                      delay: index * 0.08 
                    }}
                    className="inline-block origin-center"
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Elastic Neon Divider Line */}
            <motion.div
              initial={{ width: "0%", opacity: 0, filter: "blur(5px)" }}
              animate={{ 
                width: ["0%", "120%", "100%"], 
                opacity: [0, 1, 1],
                filter: ["blur(5px)", "blur(0px)", "blur(0px)"]
              }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 1.0 }}
              className="h-px bg-[#FF6B00] shadow-[0_0_20px_#FF6B00] mt-2 mb-2 w-full max-w-[200px]"
            />

            {/* Bottom Text (Hindi 3D Trapdoor Flips) */}
            <div className="pt-2 lg:pt-4 text-center perspective-[1000px]">
              <div className="font-display text-2xl lg:text-4xl text-[#FF6B00] flex items-center justify-center leading-none">
                <motion.span 
                  initial={{ rotateX: 90, y: 20, opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    damping: 10, 
                    stiffness: 90, 
                    delay: 1.4
                  }}
                  className="inline-block origin-bottom"
                >
                  कौसेया
                </motion.span>
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-1">
                {"Grassroot | Local | Indigenous".split("").map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 2.0 + (i * 0.03) 
                    }}
                    className="font-body text-[9px] lg:text-[11px] tracking-[0.4em] text-[#F1F3E0]/60 uppercase"
                  >
                    {c === " " ? "\u00A0" : c}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
