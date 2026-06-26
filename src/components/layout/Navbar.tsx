"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { useScrollY } from "@/hooks";
import { useCart } from "@/store/CartContext";
import { NAV_LINKS, SITE_NAME, BRAND_TAGLINE, SHOP_CATEGORY_GROUPS } from "@/constants";
import { cn } from "@/utils";
import { Search, Heart, ShoppingBag, Menu, X, User, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollY();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSolidHeaderPage =
    pathname === "/about" || pathname === "/contact" || pathname === "/gallery";
  const isScrolled = scrollY > 20;
  const isLightNav = isScrolled || isSolidHeaderPage;

  const handleShopEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaMenuOpen(true);
  };

  const handleShopLeave = () => {
    closeTimerRef.current = setTimeout(() => setMegaMenuOpen(false), 150);
  };

  return (
    <>
      <header
        className={cn(
          "fixed z-50 transition-all duration-700",
          isScrolled
            ? "top-5 left-[7%] right-[7%] rounded-full bg-[#E5C18D]/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(80,45,15,0.25)] border border-[#8B6340]/25"
            : isSolidHeaderPage
              ? "top-0 left-0 right-0 bg-white"
              : "top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
        <nav
          className={cn(
            "w-full transition-all duration-700",
            isScrolled
              ? "px-6 lg:px-8 py-3"
              : isSolidHeaderPage
                ? "max-w-[1500px] mx-auto px-10 lg:px-20 py-2.5 lg:py-3"
                : "max-w-[1500px] mx-auto px-10 lg:px-20 py-5 lg:py-6"
          )}
        >
          <div className="flex items-center justify-between w-full">

            {/* LEFT: Logo + Brand Tagline */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className={cn(
                  "relative block transition-all duration-500",
                  !isScrolled && !isSolidHeaderPage && "mt-2"
                )}
              >
                <Image
                  src="/images/logo1.png"
                  alt={SITE_NAME}
                  width={isScrolled ? 140 : isSolidHeaderPage ? 132 : 180}
                  height={isScrolled ? 48 : isSolidHeaderPage ? 44 : 70}
                  className={cn(
                    "object-contain",
                    isScrolled ? "h-10 w-auto" : isSolidHeaderPage ? "h-9 lg:h-10 w-auto" : "h-auto"
                  )}
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Nav Links */}
            <div className={cn(
              "hidden lg:flex flex-1 justify-center items-center gap-10",
              !isSolidHeaderPage && !isScrolled && "-mt-2"
            )}>
              {NAV_LINKS.map((link) => {
                if (link.label === "Shop Now") {
                  return (
                    <div
                      key={link.href}
                      className="relative py-3"
                      onMouseEnter={handleShopEnter}
                      onMouseLeave={handleShopLeave}
                    >
                      <button className="group flex items-center gap-1">
                        <span className={cn(
                          "font-body text-[12px] tracking-[0.18em] font-normal uppercase transition-colors duration-400 ease-out",
                          isLightNav
                            ? "text-[#0D0603] group-hover:text-[#6B2D0A]"
                            : "text-white/75 group-hover:text-white"
                        )}>
                          {link.label}
                        </span>
                        <ChevronDown
                          size={12}
                          strokeWidth={2}
                          className={cn(
                            "transition-all duration-300",
                            megaMenuOpen ? "rotate-180" : "rotate-0",
                            isLightNav ? "text-[#0D0603]" : "text-white/75"
                          )}
                        />
                      </button>
                      {/* Underline */}
                      <span className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                        <span className={cn(
                          "h-px w-0 group-hover:w-full transition-all duration-500 ease-out block",
                          isLightNav ? "bg-[#6B2D0A]" : "bg-white/80"
                        )} />
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative py-3 whitespace-nowrap"
                  >
                    <span className={cn(
                      "font-body text-[12px] tracking-[0.18em] font-normal uppercase",
                      "transition-colors duration-400 ease-out",
                      isLightNav
                        ? "text-[#1A1410] group-hover:text-[#6B2D0A]"
                        : "text-white/75 group-hover:text-white"
                    )}>
                      {link.label}
                    </span>
                    <span className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                      <span className={cn(
                        "h-px w-0 group-hover:w-full transition-all duration-500 ease-out block",
                        isLightNav ? "bg-[#6B2D0A]" : "bg-white/80"
                      )} />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* RIGHT: Icons */}
            <div className={cn(
              "flex flex-shrink-0 items-center justify-end gap-8 transition-colors duration-500",
              isLightNav ? "text-[#0D0603]" : "text-white"
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
                    isLightNav ? "bg-[#C8892A] text-white" : "bg-white text-black"
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

      {/* ── Mega Menu Overlay ── */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-[39] left-1/2 -translate-x-1/2",
              "w-[min(calc(100vw-2rem),90rem)]",
              "rounded-2xl bg-white border border-[#8B6340]/15",
              "shadow-[0_12px_48px_rgba(80,45,15,0.12)] transition-all duration-700 overflow-hidden",
              isScrolled ? "top-[6.25rem]" : "top-[7rem]"
            )}
            onMouseEnter={handleShopEnter}
            onMouseLeave={handleShopLeave}
          >
            <div className="px-8 lg:px-12 py-8">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-6 xl:gap-x-8">
                {SHOP_CATEGORY_GROUPS.map((group) => (
                  <div key={group.id} className="flex flex-col gap-3.5 min-w-0">
                    <Link
                      href={group.href}
                      className="group inline-flex items-start"
                    >
                      <span className="font-body text-[11px] xl:text-xs font-bold tracking-[0.1em] uppercase text-[#0D0603] group-hover:text-[#6B2D0A] transition-colors duration-200 leading-normal">
                        {group.label}
                      </span>
                    </Link>
                    <ul className="flex flex-col gap-2.5 pl-3 border-l border-[#8B6340]/35">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block font-body text-[13px] text-[#2C1810] hover:text-[#6B2D0A] transition-colors duration-200 leading-[1.65]"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end px-8 lg:px-12 py-4 border-t border-[#8B6340]/12 bg-[#FAF7F2]">
              <Link
                href="/collections"
                className="flex items-center gap-2 font-body text-xs font-medium tracking-[0.18em] uppercase text-[#2C1810] hover:text-[#6B2D0A] transition-colors duration-200"
              >
                View All Collections <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#1A1410]/97 backdrop-blur-2xl text-[#F5ECD7] lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#1A1410]/97 backdrop-blur-2xl z-10">
              <div>
                <span className="font-display text-2xl text-[#C8892A] block">{SITE_NAME}</span>
                <span className="font-body text-[9px] tracking-[0.3em] text-[#C8892A]/60 uppercase">{BRAND_TAGLINE}</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-[#F5ECD7]/80 hover:text-white transition-transform hover:rotate-90 duration-300">
                <X strokeWidth={1.5} size={28} />
              </button>
            </div>

            <ul className="flex flex-col px-8 py-8 space-y-1">
              {NAV_LINKS.map((link, i) => {
                if (link.label === "Shop Now") {
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <button
                        onClick={() => setMobileShopOpen(!mobileShopOpen)}
                        className="w-full flex items-center justify-between py-4 border-b border-white/5"
                      >
                        <span className="font-display text-3xl text-[#F5ECD7]">{link.label}</span>
                        <ChevronDown
                          size={20}
                          className={cn("transition-transform duration-300 text-[#C8892A]", mobileShopOpen ? "rotate-180" : "")}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileShopOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 gap-6 py-6 px-2">
                              {SHOP_CATEGORY_GROUPS.map((group) => (
                                <div key={group.id}>
                                  <Link
                                    href={group.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <span className="text-base">{group.icon}</span>
                                    <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-[#C8892A]">
                                      {group.label}
                                    </span>
                                  </Link>
                                  <ul className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                                    {group.items.map((item) => (
                                      <li key={item.href}>
                                        <Link
                                          href={item.href}
                                          onClick={() => setMobileOpen(false)}
                                          className="font-body text-[13px] text-[#F5ECD7]/60 hover:text-[#F5ECD7] transition-colors"
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                }
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-white/5"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block font-display text-3xl text-[#F5ECD7] hover:text-[#C8892A] transition-colors py-4"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
