"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1A1410]"
        >
          <motion.div
            className="text-center"
          >
            {/* Hindi text with smooth reveal */}
            <motion.h1
              initial={{ 
                opacity: 0,
                y: 30,
              }}
              animate={{ 
                opacity: 1,
                y: 0,
              }}
              transition={{ 
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-display text-7xl md:text-9xl lg:text-[10rem] text-[#C8892A] tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              कौसेयाह
            </motion.h1>

            {/* Elegant divider */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100px", opacity: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#C8892A] to-transparent mx-auto mt-6"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-body text-[10px] tracking-[0.35em] text-[#FAF8F5]/50 uppercase mt-6"
            >
              Grassroot | Local | Indigenous
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
