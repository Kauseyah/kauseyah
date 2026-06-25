import type { NavLink } from "@/types";

// ─── Site Metadata ────────────────────────────────────────────────────────────

export const SITE_NAME = "Kauseyah";
export const SITE_TAGLINE = "Woven by Hands. Born from Tribes.";
export const BRAND_TAGLINE = "Grassroot | Local | Indigenous";
export const SITE_DESCRIPTION =
  "Kauseyah is a curated clothing brand celebrating India's handloom heritage and tribal artistry. Discover ethically made garments, hand-woven textiles, and authentic tribal gifts.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kauseyah.com";
export const CONTACT_EMAIL = "hello@kauseyah.com";
export const WHATSAPP_NUMBER = "+91 98765 43210";

export const FOUNDER = {
  name: "Our Founder",
  role: "Founder, Kauseyah",
  headline: "Rooted in Heritage.",
  headlineAccent: "Built with Purpose.",
  intro:
    "Kauseyah was born from years spent travelling through India's tribal heartlands — sitting beside weavers at their looms, listening to stories woven into every thread, and witnessing firsthand how ancient crafts were fading from everyday life.",
  story:
    "What began as a personal pilgrimage became a purpose: to build a bridge between master artisans and the world, ensuring fair recognition, fair wages, and a future where indigenous art is not just preserved, but celebrated. Every collection at Kauseyah carries that promise.",
};

export const ABOUT_STORY_BRIDGE = {
  lead: "Every thread tells a story. Every motif carries generations of wisdom.",
  body:
    "Kauseyah was created to honour that truth — to bring the quiet brilliance of India's tribal and handloom traditions into contemporary life, without stripping away the soul of the craft. We work directly with artisan communities, ensuring their art is seen, valued, and passed on.",
};

export const CONTACT_HERO = {
  eyebrow: "Get in Touch",
  title: "Contact Us",
  intro:
    "Have a question about an order, a custom piece, or partnering with our artisans? We'd love to hear from you.",
  quote:
    "Whether it's an order, a custom piece, or a partnership — we're here to listen.",
  note: "Our team typically responds within 24 hours.",
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop Now",
    href: "/collections",
    children: [
      // ── Handlooms ──
      { label: "Sarees", href: "/collections/sarees" },
      { label: "Easy Cotton Kurtis", href: "/collections/kurtis" },
      { label: "Dupattas", href: "/collections/dupattas" },
      { label: "Stoles", href: "/collections/stoles" },
      { label: "Fabric Yardages", href: "/collections/fabric-yardages" },
      { label: "Men Kosa Jackets", href: "/collections/kosa-jackets" },
      // ── Jewellery ──
      { label: "Handcrafted Earrings", href: "/collections/earrings" },
      // ── Home & Living ──
      { label: "Baskets", href: "/collections/baskets" },
      { label: "Wall Plates", href: "/collections/wall-plates" },
      { label: "Cow Dung Diyas", href: "/collections/diyas" },
      { label: "Hand Painted Fridge Magnets", href: "/collections/fridge-magnets" },
      { label: "Hand Painted Incense Stick Holders", href: "/collections/incense-holders" },
      { label: "Eco Seed Paper Toran", href: "/collections/toran" },
      // ── Conscious Gifting ──
      { label: "Gift Hampers", href: "/collections/gift-hampers" },
      { label: "Rakhi Collection", href: "/collections/rakhi" },
      { label: "Sunglass Pouch", href: "/collections/sunglass-pouch" },
      { label: "Brass Plates", href: "/collections/brass-plates" },
      // ── Tribal & Artisan Crafts ──
      { label: "Gond Art", href: "/collections/gond-art" },
      { label: "Dhokra Craft", href: "/collections/dhokra-craft" },
      // ── Upcycled & Zero Waste ──
      { label: "Textile Toys", href: "/collections/textile-toys" },
      { label: "Faabr", href: "/collections/faabr" },
    ],
  },
  { label: "Artisans", href: "/about#artisans" },
  { label: "Our Story", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ─── Shop Category Groups (for mega-menu and homepage) ───────────────────────

export const SHOP_CATEGORY_GROUPS = [
  {
    id: "handlooms",
    label: "Handlooms",
    href: "/collections/handlooms",
    icon: "🧵",
    description: "Authentic hand-woven textiles from master weavers",
    items: [
      { label: "Sarees", href: "/collections/sarees" },
      { label: "Easy Cotton Kurtis", href: "/collections/kurtis" },
      { label: "Dupattas", href: "/collections/dupattas" },
      { label: "Stoles", href: "/collections/stoles" },
      { label: "Fabric Yardages", href: "/collections/fabric-yardages" },
      { label: "Men Kosa Jackets", href: "/collections/kosa-jackets" },
    ],
  },
  {
    id: "jewellery",
    label: "Jewellery",
    href: "/collections/jewellery",
    icon: "📿",
    description: "Handcrafted adornments rooted in tradition",
    items: [
      { label: "Handcrafted Earrings", href: "/collections/earrings" },
    ],
  },
  {
    id: "home-living",
    label: "Home & Living",
    href: "/collections/home-living",
    icon: "🏺",
    description: "Earth-conscious decor for mindful living",
    items: [
      { label: "Baskets", href: "/collections/baskets" },
      { label: "Wall Plates", href: "/collections/wall-plates" },
      { label: "Cow Dung Diyas", href: "/collections/diyas" },
      { label: "Hand Painted Fridge Magnets", href: "/collections/fridge-magnets" },
      { label: "Hand Painted Incense Stick Holders", href: "/collections/incense-holders" },
      { label: "Eco Seed Paper Toran", href: "/collections/toran" },
    ],
  },
  {
    id: "conscious-gifting",
    label: "Conscious Gifting",
    href: "/collections/conscious-gifting",
    icon: "🎁",
    description: "Thoughtful gifts with stories behind them",
    items: [
      { label: "Gift Hampers", href: "/collections/gift-hampers" },
      { label: "Rakhi Collection", href: "/collections/rakhi" },
      { label: "Sunglass Pouch", href: "/collections/sunglass-pouch" },
      { label: "Brass Plates", href: "/collections/brass-plates" },
    ],
  },
  {
    id: "tribal-crafts",
    label: "Tribal & Artisan Crafts",
    href: "/collections/tribal-crafts",
    icon: "🖌️",
    description: "Living traditions from indigenous communities",
    items: [
      { label: "Gond Art", href: "/collections/gond-art" },
      { label: "Dhokra Craft", href: "/collections/dhokra-craft" },
    ],
  },
  {
    id: "upcycled",
    label: "Upcycled & Zero Waste",
    href: "/collections/upcycled",
    icon: "♻️",
    description: "Conscious creativity — waste reimagined beautifully",
    items: [
      { label: "Textile Toys", href: "/collections/textile-toys" },
      { label: "Faabr", href: "/collections/faabr" },
    ],
  },
];

// ─── Product Categories (simplified for filters) ─────────────────────────────

export const CATEGORIES = [
  {
    id: "handlooms",
    label: "Handlooms",
    slug: "handlooms",
    description: "Authentic hand-woven textiles from master weavers",
    icon: "🧵",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    slug: "jewellery",
    description: "Handcrafted adornments rooted in tradition",
    icon: "📿",
  },
  {
    id: "home-living",
    label: "Home & Living",
    slug: "home-living",
    description: "Earth-conscious decor for mindful living",
    icon: "🏺",
  },
  {
    id: "conscious-gifting",
    label: "Conscious Gifting",
    slug: "conscious-gifting",
    description: "Thoughtful gifts with stories behind them",
    icon: "🎁",
  },
  {
    id: "tribal-crafts",
    label: "Tribal & Artisan Crafts",
    slug: "tribal-crafts",
    description: "Living traditions from indigenous communities",
    icon: "🖌️",
  },
  {
    id: "upcycled",
    label: "Upcycled & Zero Waste",
    slug: "upcycled",
    description: "Conscious creativity — waste reimagined",
    icon: "♻️",
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
