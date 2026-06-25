"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

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
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Simple media query hook
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

const WISHLIST_KEY = "kauseyah_wishlist";
const wishlistListeners = new Set<() => void>();

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function setWishlistStorage(next: string[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  wishlistListeners.forEach((listener) => listener());
}

function subscribeWishlist(listener: () => void) {
  wishlistListeners.add(listener);
  return () => wishlistListeners.delete(listener);
}

/**
 * Hook for wishlist persisted in localStorage
 */
export function useWishlist() {
  const wishlist = useSyncExternalStore(subscribeWishlist, getWishlist, () => []);

  const toggle = (productId: string) => {
    const prev = getWishlist();
    const next = prev.includes(productId)
      ? prev.filter((id) => id !== productId)
      : [...prev, productId];
    setWishlistStorage(next);
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return { wishlist, toggle, isWishlisted };
}
