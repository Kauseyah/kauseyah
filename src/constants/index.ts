import type { NavLink } from "@/types";

// ─── Site Metadata ────────────────────────────────────────────────────────────

export const SITE_NAME = "Kauseyah";
export const SITE_TAGLINE = "Woven by Hands. Born from Tribes.";
export const SITE_DESCRIPTION =
  "Kauseyah is a curated clothing brand celebrating India's handloom heritage and tribal artistry. Discover ethically made garments, hand-woven textiles, and authentic tribal gifts.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kauseyah.com";
export const CONTACT_EMAIL = "hello@kauseyah.com";
export const WHATSAPP_NUMBER = "+91 98765 43210";

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "Clothing", href: "/collections/clothing" },
      { label: "Handlooms", href: "/collections/handlooms" },
      { label: "Tribal Gifts", href: "/collections/tribal-gifts" },
      { label: "Accessories", href: "/collections/accessories" },
    ],
  },
  { label: "Artisans", href: "/about#artisans" },
  { label: "Our Story", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ─── Product Categories ───────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "clothing",
    label: "Clothing",
    slug: "clothing",
    description: "Handcrafted garments with indigenous weaves",
    icon: "👘",
  },
  {
    id: "handloom",
    label: "Handlooms",
    slug: "handlooms",
    description: "Authentic hand-woven textiles from master weavers",
    icon: "🧵",
  },
  {
    id: "tribal-gifts",
    label: "Tribal Gifts",
    slug: "tribal-gifts",
    description: "Unique artifacts and curated gift sets",
    icon: "🏺",
  },
  {
    id: "accessories",
    label: "Accessories",
    slug: "accessories",
    description: "Jewellery and adornments rooted in tradition",
    icon: "📿",
  },
];

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PRODUCTS_PER_PAGE = 12;

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Bestsellers", value: "bestseller" },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/kauseyah",
  facebook: "https://facebook.com/kauseyah",
  pinterest: "https://pinterest.com/kauseyah",
  youtube: "https://youtube.com/@kauseyah",
};

// ─── Shipping ─────────────────────────────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD = 999; // INR
export const STANDARD_SHIPPING_FEE = 99;
