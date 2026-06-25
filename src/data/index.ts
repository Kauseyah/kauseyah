import type { Product, Collection, BlogPost, Artisan } from "@/types";

// ─── Mock Artisans ────────────────────────────────────────────────────────────

export const ARTISANS: Artisan[] = [
  {
    id: "a1",
    name: "Meera Devi",
    bio: "Third-generation weaver from Odisha, Meera has spent over 30 years mastering the Sambalpuri Ikat technique, a slow and meditative art form.",
    region: "Odisha",
    tribe: "Bhulia",
    avatar: "/images/about/artisan-meera.jpg",
    craft: "Sambalpuri Ikat",
  },
  {
    id: "a2",
    name: "Ramu Bhil",
    bio: "Known across Rajasthan for his intricate Bhil tribal paintings translated onto fabric, Ramu infuses ancient mythology into wearable art.",
    region: "Rajasthan",
    tribe: "Bhil",
    avatar: "/images/about/artisan-ramu.jpg",
    craft: "Bhil Textile Art",
  },
  {
    id: "a3",
    name: "Sushila Gond",
    bio: "Sushila is a celebrated Gond artist from Madhya Pradesh whose vibrant dot-work patterns are globally recognized symbols of tribal identity.",
    region: "Madhya Pradesh",
    tribe: "Gond",
    avatar: "/images/about/artisan-sushila.jpg",
    craft: "Gond Dot Art",
  },
];

// ─── Mock Collections ─────────────────────────────────────────────────────────

export const COLLECTIONS: Collection[] = [
  {
    id: "c1",
    slug: "forest-spirits",
    name: "Forest Spirits",
    description:
      "Inspired by the sacred forests of Jharkhand, this collection draws on earthy tones and tribal motifs to create pieces that feel ancient yet alive.",
    theme: "Tribal Forest",
    coverImage: { url: "/images/collections/forest-spirits.jpg", alt: "Forest Spirits Collection" },
  },
  {
    id: "c2",
    slug: "river-songs",
    name: "River Songs",
    description:
      "Woven along the banks of the Mahanadi, this handloom collection narrates stories through the rhythm of the loom.",
    theme: "Handloom Heritage",
    coverImage: { url: "/images/collections/river-songs.jpg", alt: "River Songs Collection" },
  },
  {
    id: "c3",
    slug: "festive-earth",
    name: "Festive Earth",
    description:
      "A celebration of India's tribal festivals — bold, vibrant, and deeply rooted in the joy of community.",
    theme: "Festival",
    coverImage: { url: "/images/collections/festive-earth.jpg", alt: "Festive Earth Collection" },
  },
];

// ─── Mock Products ────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "sambalpuri-ikat-saree",
    name: "Sambalpuri Ikat Saree",
    shortDescription: "Hand-woven ikat saree with traditional motifs",
    description:
      "Each Sambalpuri Ikat saree takes 7–10 days to weave. The resist-dyeing technique creates intricate patterns that are woven, not printed, making each piece uniquely imperfect and deeply personal.",
    category: "handloom",
    price: 4599,
    compareAtPrice: 6000,
    images: [
      { url: "/images/products/sambalpuri-ikat-1.jpg", alt: "Sambalpuri Ikat Saree Front", isPrimary: true },
    ],
    variants: [
      { id: "v1", color: "Crimson Red", colorHex: "#9B2335", stock: 5, price: 4599 },
      { id: "v2", color: "Indigo Blue", colorHex: "#3C4F76", stock: 3, price: 4599 },
    ],
    tags: ["handmade", "tribal", "bestseller"],
    artisan: ARTISANS[0],
    region: "Odisha",
    material: "Pure Cotton",
    careInstructions: "Dry clean only. Store in muslin.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2024-10-01",
  },
  {
    id: "p2",
    slug: "bhil-tribal-kurta",
    name: "Bhil Tribal Kurta",
    shortDescription: "Organic cotton kurta with Bhil art hand-painted",
    description:
      "Inspired by Bhil tribal paintings, this kurta features hand-painted motifs on organic cotton, bridging ancient visual storytelling with contemporary wearability.",
    category: "clothing",
    price: 2199,
    images: [
      { url: "/images/products/bhil-kurta-1.jpg", alt: "Bhil Tribal Kurta", isPrimary: true },
    ],
    variants: [
      { id: "v3", size: "S", stock: 8, price: 2199 },
      { id: "v4", size: "M", stock: 10, price: 2199 },
      { id: "v5", size: "L", stock: 6, price: 2199 },
      { id: "v6", size: "XL", stock: 4, price: 2199 },
    ],
    tags: ["handmade", "eco-friendly", "tribal", "new-arrival"],
    artisan: ARTISANS[1],
    region: "Rajasthan",
    material: "100% Organic Cotton",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2024-11-15",
  },
  {
    id: "p3",
    slug: "gond-art-gift-box",
    name: "Gond Art Gift Box",
    shortDescription: "Curated gift set featuring authentic Gond artwork",
    description:
      "This curated gift box celebrates the Gond tribe's visual language — includes a hand-painted journal, a silk bookmark, and a tribal motif scarf.",
    category: "tribal-gifts",
    price: 1499,
    compareAtPrice: 1800,
    images: [
      { url: "/images/products/gond-gift-box-1.jpg", alt: "Gond Art Gift Box", isPrimary: true },
    ],
    variants: [{ id: "v7", stock: 20, price: 1499 }],
    tags: ["handmade", "tribal", "limited-edition"],
    artisan: ARTISANS[2],
    region: "Madhya Pradesh",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2024-12-01",
  },
];

// ─── Mock Blog Posts ──────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "story-of-ikat",
    title: "The Story of Ikat: Threads That Carry Time",
    excerpt:
      "Ikat is not just a weaving technique — it is a language of patience, culture, and identity passed down through generations.",
    content: "",
    coverImage: { url: "/images/blog/story-of-ikat.jpg", alt: "Ikat weaving" },
    author: "Kauseyah Editorial",
    publishedAt: "2024-11-10",
    tags: ["handloom", "ikat", "artisan-spotlight"],
  },
  {
    id: "b2",
    slug: "bhil-visual-universe",
    title: "The Bhil Visual Universe: Art as Rebellion",
    excerpt:
      "For the Bhil people, painting is not decorative — it is documentary, devotional, and defiant.",
    content: "",
    coverImage: { url: "/images/blog/bhil-art.jpg", alt: "Bhil tribal art" },
    author: "Kauseyah Editorial",
    publishedAt: "2024-12-05",
    tags: ["tribal", "bhil", "culture"],
  },
];
