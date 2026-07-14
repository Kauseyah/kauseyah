 
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useScrollY } from "@/hooks";
import { useCart } from "@/store/CartContext";
import { NAV_LINKS, SITE_NAME, BRAND_TAGLINE, SHOP_CATEGORY_GROUPS } from "@/constants";
import { PRODUCTS } from "@/data";
import { cn } from "@/utils";
import { Heart, ShoppingBag, Menu, X, User, ChevronDown, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface DynamicCategoryGroup {
  id: string;
  label: string;
  href: string;
  icon?: string;
  description?: string;
  items: { label: string; href: string; }[];
}

export default function Navbar({ dynamicCategories }: { dynamicCategories?: DynamicCategoryGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const scrollY = useScrollY();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  const groupsToUse = dynamicCategories && dynamicCategories.length > 0 ? dynamicCategories : SHOP_CATEGORY_GROUPS;



  // Live suggestions derived from product catalog
  const suggestions = searchQuery.trim().length >= 1
    ? PRODUCTS.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const handleSearchSubmit = useCallback((slug?: string) => {
    if (slug) {
      router.push(`/products/${slug}`);
    } else if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  }, [searchQuery, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSearchSubmit(suggestions[highlightedIndex].slug);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  };

  // Reset highlight when suggestions change
   
  useEffect(() => { setHighlightedIndex(-1); }, [searchQuery]);

  const isSolidHeaderPage = pathname !== "/";
  const isScrolled = scrollY > 20;
  
   // Auth pages have a full-width solid black background
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/account"].some((p) => pathname === p || pathname?.startsWith(p + "/"));

  // Only these pages have a DARK hero image behind the navbar (need white text before scroll)
  const hasDarkHero = ["/", "/contact", "/about"].some(
    (p) => pathname === p || (p !== "/" && pathname?.startsWith(p))
  ) || pathname === "/blog";

  // On all other pages (cart, account, checkout, collections, products etc.) force dark pill nav
  // Except for auth pages which use a full-width solid black nav
  const forceScrolledStyle = !hasDarkHero && !isAuthPage && !isScrolled;

  // Use light text (white) if:
  // - It's scrolled (pill nav is dark)
  // - We're forcing the scrolled style (pill nav is dark)
  // - It's a page with a dark hero
  // - Or it's an auth page (solid black background)
  const useLightNavText = isScrolled || forceScrolledStyle || hasDarkHero || isAuthPage;

  const handleShopEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaMenuOpen(true);
  };

  const handleShopLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        data-nav-transparent={(isScrolled || forceScrolledStyle) ? "false" : "true"}
        data-light-text={useLightNavText ? "true" : "false"}
        className={cn(
          "fixed z-50 transition-all duration-700",
          isScrolled || forceScrolledStyle
            ? "top-0 left-0 right-0 bg-[#111111] border-b border-white/5"
            : isAuthPage
              ? "top-0 left-0 right-0 bg-[#111111]"
              : isSolidHeaderPage
                ? "top-0 left-0 right-0 bg-transparent backdrop-blur-[2px]"
                : "top-0 left-0 right-0 bg-gradient-to-b from-black/75 via-black/40 to-transparent"
        )}
      >
        <nav
          className={cn(
            "w-full transition-all duration-700",
            isScrolled || forceScrolledStyle
              ? "max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-3"
              : isSolidHeaderPage
                ? "max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-2.5 lg:py-3"
                : "max-w-[1500px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-1"
          )}
        >
          <div className="flex items-center justify-between w-full">

            {/* LEFT: Logo + Brand Tagline */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className={cn(
                  "relative block transition-all duration-500"
                )}
              >
                <Image
                  src="/images/logo1.png"
                  alt={SITE_NAME}
                  width={isScrolled ? 180 : isSolidHeaderPage ? 170 : 200}
                  height={isScrolled ? 60 : isSolidHeaderPage ? 56 : 70}
                  className={cn(
                    "object-contain max-w-[180px] sm:max-w-none transition-all duration-300",
                    isScrolled ? "h-10 sm:h-12 w-auto" : isSolidHeaderPage ? "h-10 sm:h-12 lg:h-14 w-auto" : "h-12 sm:h-14 lg:h-16 w-auto"
                  )}
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Nav Links or Search Input */}
            {searchOpen ? (
              <div className="flex-1 max-w-2xl mx-8 hidden lg:flex flex-col items-center relative">
                {/* Input Bar */}
                <div className={cn(
                  "flex items-center gap-3 rounded-full px-5 py-2.5 w-full transition-all duration-300 shadow-lg",
                  isScrolled
                    ? "bg-white/15 border border-white/20 backdrop-blur-xl text-white ring-1 ring-[#FF6B00]/40"
                    : "bg-white border border-[#FF6B00]/30 text-[#111111] ring-1 ring-[#FF6B00]/20 shadow-[0_4px_24px_rgba(255,107,0,0.10)]"
                )}>
                  <Search size={16} className="text-[#FF6B00] shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search sarees, crafts, artisans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "bg-transparent border-none text-sm outline-none w-full font-body font-medium tracking-wide",
                      isScrolled ? "placeholder-white/40 text-white" : "placeholder-stone-400 text-[#111111]"
                    )}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); setHighlightedIndex(-1); inputRef.current?.focus(); }}
                      className="text-stone-400 hover:text-[#FF6B00] transition-colors cursor-pointer shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <div className="w-px h-4 bg-stone-300/40 shrink-0" />
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="shrink-0 bg-[#FF6B00] hover:bg-[#e55f00] text-white rounded-full px-3 py-1 text-xs font-body font-semibold tracking-wider transition-colors duration-200"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); setHighlightedIndex(-1); }}
                    className="text-stone-400 hover:text-[#FF6B00] transition-colors cursor-pointer shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-[calc(100%+10px)] left-0 right-0 z-[200] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-white/10 bg-white backdrop-blur-2xl"
                    >
                      {/* Suggestion header */}
                      <div className="px-4 pt-3 pb-2 border-b border-stone-100 flex items-center justify-between">
                        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-400 font-semibold">
                          {suggestions.length} result{suggestions.length !== 1 ? "s" : ""}
                        </span>
                        <span className="font-body text-[10px] text-stone-300">↑↓ navigate · Enter to open</span>
                      </div>

                      {/* Suggestion Items */}
                      <ul className="py-1">
                        {suggestions.map((product, idx) => {
                          const primaryImg = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;
                          const isHighlighted = idx === highlightedIndex;
                          return (
                            <li key={product.id}>
                              <button
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onMouseLeave={() => setHighlightedIndex(-1)}
                                onClick={() => handleSearchSubmit(product.slug)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left group",
                                  isHighlighted ? "bg-[#FFF5EE]" : "hover:bg-stone-50"
                                )}
                              >
                                {/* Thumbnail */}
                                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-100">
                                  <Image
                                    src={primaryImg}
                                    alt={product.name}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "font-body text-sm font-semibold leading-tight truncate transition-colors",
                                    isHighlighted ? "text-[#FF6B00]" : "text-[#111111] group-hover:text-[#FF6B00]"
                                  )}>
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-body text-[10px] font-bold tracking-[0.12em] uppercase text-[#FF6B00]/70 bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
                                      {product.subcategory ?? product.category}
                                    </span>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex-shrink-0 text-right">
                                  <p className="font-body text-sm font-bold text-[#111111]">
                                    ₹{product.price.toLocaleString("en-IN")}
                                  </p>
                                  <ArrowUpRight size={13} className={cn("ml-auto transition-opacity", isHighlighted ? "opacity-100 text-[#FF6B00]" : "opacity-0")} />
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {/* View all footer */}
                      <div className="border-t border-stone-100 px-4 py-2.5">
                        <button
                          onClick={() => handleSearchSubmit()}
                          className="w-full flex items-center justify-center gap-2 font-body text-xs font-semibold tracking-[0.15em] uppercase text-[#FF6B00] hover:text-[#e55f00] transition-colors py-0.5"
                        >
                          View all results for "{searchQuery}"
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* No results state */}
                  {searchQuery.trim().length >= 2 && suggestions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-[calc(100%+10px)] left-0 right-0 z-[200] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-stone-100 px-6 py-6 text-center"
                    >
                      <p className="font-body text-sm text-stone-400">No products found for <span className="font-semibold text-[#111111]">"{searchQuery}"</span></p>
                      <p className="font-body text-xs text-stone-300 mt-1">Try searching for sarees, crafts, or artisan names</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className={cn(
                "hidden lg:flex flex-1 justify-center items-center gap-10 lg:gap-12 xl:gap-16"
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
                          <span
                            className="font-body text-[12px] tracking-[0.18em] font-bold uppercase transition-colors duration-300"
                            style={{ color: useLightNavText ? (isScrolled ? '#FFFFFF' : '#FFFFFF') : '#111111' }}
                          >
                            {link.label}
                          </span>
                          <ChevronDown
                            size={12}
                            strokeWidth={2}
                            className="transition-all duration-300"
                            style={{
                              transform: megaMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              color: useLightNavText ? (isScrolled ? '#FFFFFF' : '#FFFFFF') : '#111111'
                            }}
                          />
                        </button>
                        {/* Underline */}
                        <span className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                          <span className={cn(
                            "h-px w-0 group-hover:w-full transition-all duration-500 ease-out block",
                            useLightNavText
                              ? isScrolled ? "bg-white" : "bg-white/80"
                              : "bg-[#FF6B00]"
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
                      <span
                          className="font-body text-[12px] tracking-[0.18em] font-bold uppercase transition-colors duration-300"
                          style={{ color: useLightNavText ? (isScrolled ? '#FFFFFF' : '#FFFFFF') : '#111111' }}
                        >
                          {link.label}
                        </span>
                      <span className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                        <span className={cn(
                          "h-px w-0 group-hover:w-full transition-all duration-500 ease-out block",
                          useLightNavText
                            ? isScrolled ? "bg-white" : "bg-white/80"
                            : "bg-[#FF6B00]"
                        )} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* RIGHT: Icons */}
            <div
              className="flex flex-shrink-0 items-center justify-end gap-3 sm:gap-6 lg:gap-8 transition-colors duration-500"
              style={{ color: useLightNavText ? '#FFFFFF' : '#111111' }}
            >
              {!searchOpen && (
                <button
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className={cn("hidden sm:block transition-all duration-300 hover:-translate-y-0.5 cursor-pointer", useLightNavText && isScrolled ? "hover:text-[#FF6B00]" : "hover:text-[#FF6B00]")}
                >
                  <Search strokeWidth={1.5} size={19} />
                </button>
              )}
              <Link href={user ? "/account" : "/login"} className={cn("hidden sm:block transition-all duration-300 hover:-translate-y-0.5", useLightNavText && isScrolled ? "hover:text-[#FF6B00]" : "hover:text-[#FF6B00]")}>
                <User strokeWidth={1.5} size={19} />
              </Link>
              <Link href="/wishlist" className={cn("hidden sm:block transition-all duration-300 hover:-translate-y-0.5", useLightNavText && isScrolled ? "hover:text-[#FF6B00]" : "hover:text-[#FF6B00]")}>
                <Heart strokeWidth={1.5} size={19} />
              </Link>
              <Link href="/cart" className={cn("relative transition-all duration-300 hover:-translate-y-0.5 flex items-center", useLightNavText && isScrolled ? "hover:text-[#FF6B00]" : "hover:text-[#FF6B00]")}>
                <ShoppingBag strokeWidth={1.5} size={19} />
                {itemCount > 0 && (
                  <span className={cn(
                    "absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold",
                    isScrolled ? "bg-[#111111] text-[#FFFFFF]" : (isScrolled || isSolidHeaderPage) ? "bg-[#FF8100] text-[#FFFFFF]" : "bg-[#FFFFFF] text-[#111111]"
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
              "rounded-2xl bg-white border border-stone-100",
              "shadow-[0_12px_48px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden",
              isScrolled ? "top-[6.25rem]" : "top-[7rem]"
            )}
            onMouseEnter={handleShopEnter}
            onMouseLeave={handleShopLeave}
          >
            <div className="px-8 lg:px-12 py-8">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-6 xl:gap-x-8">
                {groupsToUse.map((group) => (
                  <div key={group.id} className="flex flex-col gap-3.5 min-w-0">
                    <Link
                      href={group.href}
                      className="group inline-flex items-start"
                    >
                      <span className="font-body text-[11px] xl:text-xs font-bold tracking-[0.1em] uppercase text-[#111111] group-hover:text-[#FF6B00] transition-colors duration-200 leading-normal">
                        {group.label}
                      </span>
                    </Link>
                    <ul className="flex flex-col gap-2.5 pl-3 border-l border-[#FF6B00]/35">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block font-body text-[13px] text-[#111111] hover:text-[#FF6B00] transition-colors duration-200 leading-[1.65]"
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

            <div className="flex items-center justify-end px-8 lg:px-12 py-4 border-t border-stone-100 bg-white">
              <Link
                href="/collections"
                className="flex items-center gap-2 font-body text-xs font-medium tracking-[0.18em] uppercase text-[#111111] hover:text-[#FF6B00] transition-colors duration-200"
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
            className="fixed inset-0 z-[100] bg-[#111111]/97 backdrop-blur-2xl text-[#F1F3E0] lg:hidden flex flex-col overflow-y-auto"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#111111]/97 backdrop-blur-2xl z-10">
              <div>
                <span className="font-display text-2xl text-[#FF6B00] block">{SITE_NAME}</span>
                <span className="font-body text-[9px] tracking-[0.3em] text-[#FF6B00]/60 uppercase">{BRAND_TAGLINE}</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-[#F1F3E0]/80 hover:text-white transition-transform hover:rotate-90 duration-300 mr-4">
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
                        <span className="font-display text-3xl text-[#F1F3E0]">{link.label}</span>
                        <ChevronDown
                          size={20}
                          className={cn("transition-transform duration-300 text-[#FF6B00]", mobileShopOpen ? "rotate-180" : "")}
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
                              {groupsToUse.map((group) => (
                                <div key={group.id}>
                                  <Link
                                    href={group.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <span className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-[#FF6B00]">
                                      {group.label}
                                    </span>
                                  </Link>
                                  <ul className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                                    {group.items.map((item) => (
                                      <li key={item.href}>
                                        <Link
                                          href={item.href}
                                          onClick={() => setMobileOpen(false)}
                                          className="font-body text-[13px] text-[#F1F3E0]/60 hover:text-[#F1F3E0] transition-colors"
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
                      className="block font-display text-3xl text-[#F1F3E0] hover:text-[#FF6B00] transition-colors py-4"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              
              {/* Manual Mobile Account Link */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.08 }}
                className="border-b border-white/5"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block font-display text-3xl text-[#F1F3E0] hover:text-[#FF6B00] transition-colors py-4 flex items-center justify-between"
                >
                  Account <User size={24} className="text-[#FF6B00]" />
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
