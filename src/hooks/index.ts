"use client";

import { useState, useEffect } from "react";

/**
 * Hook to track scroll position
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return scrollY;
}

/**
 * Hook that returns true once the component has mounted on the client
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Simple media query hook
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Hook for wishlist persisted in localStorage
 */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kauseyah_wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const toggle = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("kauseyah_wishlist", JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return { wishlist, toggle, isWishlisted };
}
