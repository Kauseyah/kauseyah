import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, COLLECTIONS } from "@/data";
import CollectionDetailPageClient from "@/components/pages/CollectionDetailPageClient";
import type { Product } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

// Map slugs from mega-menu and collections to their filter settings
const SLUG_MAP: Record<
  string,
  {
    title: string;
    description: string;
    filter: (p: Product) => boolean;
  }
> = {
  // Predefined Collections
  "forest-spirits": {
    title: "Forest Spirits Collection",
    description: "Inspired by the sacred forests of Jharkhand, this collection draws on earthy tones and tribal motifs.",
    filter: (p) => p.tags.includes("tribal") || p.category === "tribal-crafts",
  },
  "river-songs": {
    title: "River Songs Collection",
    description: "Woven along the banks of the Mahanadi, this handloom collection narrates stories through the rhythm of the loom.",
    filter: (p) => p.category === "handlooms",
  },
  "festive-earth": {
    title: "Festive Earth Collection",
    description: "A celebration of India's tribal festivals — bold, vibrant, and deeply rooted in the joy of community.",
    filter: (p) => p.tags.includes("bestseller") || p.isFeatured,
  },

  // Categories
  "handlooms": {
    title: "Handloom Heritage",
    description: "Authentic hand-woven textiles and garments crafted directly by rural Indian weavers.",
    filter: (p) => p.category === "handlooms",
  },
  "jewellery": {
    title: "Handcrafted Jewellery",
    description: "Traditional ornaments and adornments cast in brass and bell metal using lost-wax casting.",
    filter: (p) => p.category === "jewellery",
  },
  "home-living": {
    title: "Home & Living",
    description: "Earthy, eco-conscious decor items designed to bring organic warmth to your living spaces.",
    filter: (p) => p.category === "home-living",
  },
  "conscious-gifting": {
    title: "Conscious Gifting",
    description: "Thoughtful, sustainable gift box hampers and festive collections with stories behind them.",
    filter: (p) => p.category === "conscious-gifting",
  },
  "tribal-crafts": {
    title: "Tribal & Artisan Crafts",
    description: "Original Gond paintings, Dhokra metal castings, and other crafts sourced directly from indigenous tribes.",
    filter: (p) => p.category === "tribal-crafts",
  },
  "upcycled": {
    title: "Upcycled & Zero Waste",
    description: "Creative zero-waste textile toys and accessories handcrafted from cotton remnants.",
    filter: (p) => p.category === "upcycled-waste",
  },
  "upcycled-waste": {
    title: "Upcycled & Zero Waste",
    description: "Creative zero-waste textile toys and accessories handcrafted from cotton remnants.",
    filter: (p) => p.category === "upcycled-waste",
  },

  // Subcategories
  "sarees": {
    title: "Traditional Sarees",
    description: "Explore our collection of hand-spun, hand-woven sarees featuring heritage ikat and weave structures.",
    filter: (p) => p.subcategory === "Sarees",
  },
  "kurtis": {
    title: "Easy Cotton Kurtis",
    description: "Comfortable and breathable organic cotton kurtis featuring hand-painted tribal visual folklore.",
    filter: (p) => p.subcategory === "Easy Cotton Kurtis",
  },
  "dupattas": {
    title: "Handwoven Dupattas",
    description: "Heritage dupattas and stoles woven using organic wild silk and cotton threads.",
    filter: (p) => p.subcategory === "Dupattas" || p.subcategory === "Stoles",
  },
  "stoles": {
    title: "Artisan Stoles & Scarves",
    description: "Soft handwoven stoles and zero-waste patchwork scarves for everyday accents.",
    filter: (p) => p.subcategory === "Stoles" || p.subcategory === "Faabr",
  },
  "fabric-yardages": {
    title: "Fabric Yardages",
    description: "Pure handloom fabric yardages suitable for custom tailoring and conscious designs.",
    filter: (p) => p.subcategory === "Fabric Yardages" || p.category === "handlooms",
  },
  "kosa-jackets": {
    title: "Men Kosa Jackets",
    description: "Structured Nehru jackets tailored from organic Kosa wild silk sourced from local weaver clusters.",
    filter: (p) => p.subcategory === "Men Kosa Jackets",
  },
  "earrings": {
    title: "Handcrafted Earrings",
    description: "Lost-wax cast bell metal earrings and brass jewellery crafted by tribal artists.",
    filter: (p) => p.subcategory === "Handcrafted Earrings",
  },
  "baskets": {
    title: "Woven Baskets",
    description: "Hand-braided natural fiber baskets and organic home containers.",
    filter: (p) => p.subcategory === "Baskets" || p.category === "home-living",
  },
  "wall-plates": {
    title: "Artistic Wall Plates",
    description: "Decorative ceramic wall plates hand-painted with earthy Gond motifs and storytelling lines.",
    filter: (p) => p.subcategory === "Wall Plates",
  },
  "diyas": {
    title: "Organic Cow Dung Diyas",
    description: "100% biodegradable festive diyas made using sacred cow dung, ghee, and natural herbs.",
    filter: (p) => p.subcategory === "Cow Dung Diyas",
  },
  "fridge-magnets": {
    title: "Hand Painted Fridge Magnets",
    description: "Miniature hand-painted visual arts and tribal motifs on clay magnets.",
    filter: (p) => p.subcategory === "Hand Painted Fridge Magnets" || p.category === "home-living",
  },
  "incense-holders": {
    title: "Hand Painted Incense Stick Holders",
    description: "Terracotta and ceramic incense stick holders detailed with organic tribal art.",
    filter: (p) => p.subcategory === "Hand Painted Incense Stick Holders" || p.category === "home-living",
  },
  "toran": {
    title: "Eco Seed Paper Toran",
    description: "Door hangings crafted from plantable seed paper that sprouts into flowers after use.",
    filter: (p) => p.subcategory === "Eco Seed Paper Toran",
  },
  "gift-hampers": {
    title: "Premium Gift Hampers",
    description: "Curated sets of handloom scarves, Gond journals, and brass coaster sets for conscious gifting.",
    filter: (p) => p.subcategory === "Gift Hampers",
  },
  "rakhi": {
    title: "Handmade Rakhi Collection",
    description: "Organic cotton and wooden bead rakhis woven by women self-help clusters.",
    filter: (p) => p.subcategory === "Rakhi Collection",
  },
  "sunglass-pouch": {
    title: "Zero-Waste Sunglass Pouches",
    description: "Soft protective sunglass sleeves stitched from handloom remnants.",
    filter: (p) => p.subcategory === "Sunglass Pouch" || p.category === "conscious-gifting",
  },
  "brass-plates": {
    title: "Brass Plates & Bowls",
    description: "Traditional brass dinnerware and serving trays hand-beaten by metalsmiths.",
    filter: (p) => p.subcategory === "Brass Plates" || p.category === "conscious-gifting",
  },
  "gond-art": {
    title: "Gond Art Paintings",
    description: "Original paintings on canvas and paper presenting the legendary Gond visual universe.",
    filter: (p) => p.subcategory === "Gond Art",
  },
  "dhokra-craft": {
    title: "Dhokra Metal Castings",
    description: "Sacred bulls, figurines, and sculptures cast using the lost-wax method.",
    filter: (p) => p.subcategory === "Dhokra Craft",
  },
  "textile-toys": {
    title: "Upcycled Textile Toys",
    description: "Safe, cotton-stuffed elephant, camel, and bird toys hand-stitched from fabric remnants.",
    filter: (p) => p.subcategory === "Textile Toys",
  },
  "faabr": {
    title: "Faabr Zero-Waste Fabric",
    description: "Artisan stoles and accessories crafted from patchwork textile strips.",
    filter: (p) => p.subcategory === "Faabr" || p.category === "upcycled-waste",
  },
};

export async function generateStaticParams() {
  // Return all static slugs from both the predefined collection list and the custom slug mapping
  const staticSlugs = new Set([
    ...COLLECTIONS.map((c) => c.slug),
    ...Object.keys(SLUG_MAP),
  ]);
  return Array.from(staticSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mapped = SLUG_MAP[slug];
  if (mapped) {
    return {
      title: mapped.title,
      description: mapped.description,
    };
  }

  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const mapped = SLUG_MAP[slug];

  if (!mapped) {
    const collection = COLLECTIONS.find((c) => c.slug === slug);
    if (!collection) notFound();

    // Generic collection filtering fallback
    const filteredProducts = PRODUCTS.filter(
      (p) => p.category.toLowerCase() === collection.name.toLowerCase()
    );

    return (
      <CollectionDetailPageClient
        title={collection.name}
        description={collection.description}
        products={filteredProducts}
      />
    );
  }

  // Filter products based on mapped rule
  const filteredProducts = PRODUCTS.filter(mapped.filter);

  return (
    <CollectionDetailPageClient
      title={mapped.title}
      description={mapped.description}
      products={filteredProducts}
    />
  );
}
