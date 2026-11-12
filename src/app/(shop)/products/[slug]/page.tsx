import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import ProductDetailPageClient from "@/components/pages/ProductDetailPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Explicit slug aliases verified against actual database records
const KNOWN_SLUG_ALIASES: Record<string, string> = {
  // Men's Kosa Silk Jacket (Verified DB slug: "premium-handloom-kosa-silk-jacket-men")
  "men-kosa-jacket": "premium-handloom-kosa-silk-jacket-men",
  "men-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-jacket": "premium-handloom-kosa-silk-jacket-men",
  "handloom-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",

  // The Cuddle Hamper Box (Verified DB slug: "hamper")
  "cuddle-hamper": "hamper",
  "gift-hamper": "hamper",
  "the-cuddle-hamper-box": "hamper",

  // The Bhai Keepsake Hamper (Verified DB slug: "ham")
  "bhai-keepsake-hamper": "ham",
  "the-bhai-keepsake-hamper": "ham",

  // Corporate Gifts / Hampers (Verified DB slug: "corporate hampers")
  "corporate-gifts": "corporate hampers",
  "corporate-hampers": "corporate hampers",

  // Handcrafted Diwali Shagun Thali (Verified DB slug: "diwali")
  "diwali-shagun-thali": "diwali",
  "handcrafted-diwali-shagun-thali": "diwali",

  // Verified records with specific whitespace in database slug
  "fabric-elephant": "Fabric elephant ",
  "hand-embroidery": "hand embroidery ",
  "saree-organisers": "Saree organisers ",
};

async function fetchProductBySlug(supabase: any, rawSlug: string) {
  const cleanSlug = rawSlug.trim();
  if (!cleanSlug) return null;

  const lowerSlug = cleanSlug.toLowerCase();

  // 1. Check verified alias map
  const targetSlug = KNOWN_SLUG_ALIASES[lowerSlug] || cleanSlug;

  // 2. Exact match on targetSlug
  const { data: exact } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .eq("slug", targetSlug)
    .maybeSingle();
  if (exact) return exact;

  // 3. Case-insensitive match on targetSlug
  const { data: ilikeMatch } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .ilike("slug", targetSlug)
    .maybeSingle();
  if (ilikeMatch) return ilikeMatch;

  // 4. Try hyphens replaced with spaces (e.g. URL '/products/rakhi-gift' -> DB 'rakhi gift')
  if (targetSlug.includes("-")) {
    const spaceSlug = targetSlug.replace(/-/g, " ");
    const { data: spaceMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", spaceSlug)
      .maybeSingle();
    if (spaceMatch) return spaceMatch;
  }

  // 5. Try spaces replaced with hyphens (e.g. 'rakhi gift' -> 'rakhi-gift')
  if (targetSlug.includes(" ")) {
    const hyphenSlug = targetSlug.replace(/\s+/g, "-");
    const { data: hyphenMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", hyphenSlug)
      .maybeSingle();
    if (hyphenMatch) return hyphenMatch;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  const supabase = await createClient();
  const product = await fetchProductBySlug(supabase, slug);

  if (!product) return {};

  return {
    title: `${product.name} - Authentic Handlooms`,
    description: `Buy ${product.name} online. ${product.description?.substring(0, 120)}... Delivering across India including Delhi, Mumbai, Bangalore, Pune, and Hyderabad.`,
    keywords: [
      product.name,
      product.category?.name || product.category || "",
      product.subcategory || "",
      "Handlooms",
      "Buy online in Mumbai",
      "Delhi",
      "Bangalore",
      "Pune",
      "Hyderabad",
      "Chhattisgarh",
      "India",
    ],
    alternates: { canonical: `/products/${encodeURIComponent(product.slug.trim())}` },
    openGraph: {
      images: Array.isArray(product.images)
        ? product.images.map((img: string | { url: string }) => ({ url: typeof img === "string" ? img : img.url }))
        : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  const supabase = await createClient();
  const product = await fetchProductBySlug(supabase, slug);

  if (!product) notFound();

  const mappedProduct = mapSupabaseProductToFrontend(product);

  return <ProductDetailPageClient product={mappedProduct} />;
}
