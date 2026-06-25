"use client";

import Link from "next/link";
import { useState } from "react";
import { useScrollY } from "@/hooks";
import { useCart } from "@/store/CartContext";
import { NAV_LINKS, SITE_NAME } from "@/constants";
import { cn } from "@/utils";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const scrollY = useScrollY();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isScrolled = scrollY > 20;

  return (
    <>
      <header
        className={cn(
          "fixed z-50 transition-all duration-700",
          isScrolled 
            ? "top-5 left-[7%] right-[7%] rounded-full bg-[#C4A882]/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(80,45,15,0.25)] border border-[#8B6340]/25" 
            : "top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
        <nav className={cn(
          "w-full transition-all duration-700",
          isScrolled ? "px-6 lg:px-8 py-3" : "max-w-[1500px] mx-auto px-10 lg:px-20 py-8"
        )}>
          
          {/* SINGLE LAYOUT — All elements always visible, visual style changes on scroll */}
          <div className="flex items-center justify-between w-full py-1">

            {/* LEFT: Logo */}
            <div className="flex-shrink-0 flex flex-col items-start">
              <Link
                href="/"
                className={cn(
                  "font-display leading-none tracking-wider transition-all duration-500",
                  isScrolled ? "text-2xl text-[#0D0603]" : "text-4xl text-white"
                )}
              >
                {SITE_NAME}
              </Link>
              {/* Gold underline accent — only on scroll */}
              <div className={cn(
                "h-px bg-gradient-to-r from-[#C8892A] to-transparent transition-all duration-500 mt-1",
                isScrolled ? "w-full opacity-100" : "w-0 opacity-0"
              )} />
            </div>

            {/* CENTER: All Nav Links */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-3 whitespace-nowrap"
                >
                  {/* Label */}
                  <span className={cn(
                    "font-body text-[12px] tracking-[0.18em] font-normal uppercase",
                    "transition-colors duration-400 ease-out",
                    isScrolled
                      ? "text-[#0D0603] group-hover:text-[#6B2D0A]"
                      : "text-white/75 group-hover:text-white"
                  )}>
                    {link.label}
                  </span>

                  {/* Underline — grows from center outward */}
                  <span className={cn(
                    "absolute bottom-1.5 left-0 right-0 flex justify-center"
                  )}>
                    <span className={cn(
                      "h-px w-0 group-hover:w-full transition-all duration-500 ease-out block",
                      isScrolled ? "bg-[#6B2D0A]" : "bg-white/80"
                    )} />
                  </span>
                </Link>
              ))}
            </div>

            {/* RIGHT: Icons */}
            <div className={cn(
              "flex flex-shrink-0 items-center justify-end gap-8 transition-colors duration-500",
              isScrolled ? "text-[#0D0603]" : "text-white"
            )}>
              <button aria-label="Search" className="hidden sm:block transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C8892A]">
                <Search strokeWidth={1.5} size={19} />
              </button>
              <Link href="/account" className="hidden sm:block transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C8892A]">
                <User strokeWidth={1.5} size={19} />
              </Link>
              <Link href="/wishlist" className="hidden sm:block transition-all duration-300 hover:-translate-y-0.5 hover:text-[#C8892A]">
                <Heart strokeWidth={1.5} size={19} />
              </Link>
              <Link href="/cart" className="relative transition-all duration-300 hover:-translate-y-0.5 flex items-center hover:text-[#C8892A]">
                <ShoppingBag strokeWidth={1.5} size={19} />
                {itemCount > 0 && (
                  <span className={cn(
                    "absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold",
                    isScrolled ? "bg-[#C8892A] text-white" : "bg-white text-black"
                  )}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu strokeWidth={1.5} size={24} />
              </button>
            </div>
          </div>

        </nav>
      </header>

      {/* Luxury Full-Screen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#1A1410]/95 backdrop-blur-2xl text-[#F5ECD7] lg:hidden flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <span className="font-display text-2xl text-[#C8892A]">{SITE_NAME}</span>
              <button onClick={() => setMobileOpen(false)} className="text-[#F5ECD7]/80 hover:text-white transition-transform hover:rotate-90 duration-300">
                <X strokeWidth={1.5} size={28} />
              </button>
            </div>
            <ul className="flex-1 flex flex-col items-center justify-center space-y-8">
              {NAV_LINKS.map((link, i) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl md:text-5xl text-[#F5ECD7] hover:text-[#C8892A] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
