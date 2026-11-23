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
  "men kosa jacket": "premium-handloom-kosa-silk-jacket-men",
  "men-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "men kosa silk jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa silk jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa jacket": "premium-handloom-kosa-silk-jacket-men",
  "handloom-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "handloom kosa silk jacket": "premium-handloom-kosa-silk-jacket-men",

  // The Cuddle Hamper Box (Verified DB slug: "hamper")
  "cuddle-hamper": "hamper",
  "cuddle hamper": "hamper",
  "gift-hamper": "hamper",
  "gift hamper": "hamper",
  "the-cuddle-hamper-box": "hamper",
  "the cuddle hamper box": "hamper",

  // The Bhai Keepsake Hamper (Verified DB slug: "ham")
  "bhai-keepsake-hamper": "ham",
  "bhai keepsake hamper": "ham",
  "the-bhai-keepsake-hamper": "ham",
  "the bhai keepsake hamper": "ham",

  // Corporate Gifts / Hampers (Verified DB slug: "corporate hampers")
  "corporate-gifts": "corporate hampers",
  "corporate gifts": "corporate hampers",
  "corporate-hampers": "corporate hampers",
  "corporate hampers": "corporate hampers",

  // Handcrafted Diwali Shagun Thali (Verified DB slug: "diwali")
  "diwali-shagun-thali": "diwali",
  "diwali shagun thali": "diwali",
  "handcrafted-diwali-shagun-thali": "diwali",
  "handcrafted diwali shagun thali": "diwali",

  // Verified records with specific whitespace in database slug
  "fabric-elephant": "Fabric elephant ",
  "fabric elephant": "Fabric elephant ",
  "our-favourite-ellie": "Fabric elephant ",
  "our favourite ellie": "Fabric elephant ",
  "hand-embroidery": "hand embroidery ",
  "hand embroidery": "hand embroidery ",
  "saree-organisers": "Saree organisers ",
  "saree organisers": "Saree organisers ",
  "saree-organiser": "Saree organisers ",
  "saree organiser": "Saree organisers ",
};

async function fetchProductBySlug(supabase: any, rawSlug: string) {
  const cleanSlug = rawSlug.trim();
  if (!cleanSlug) return null;

  const lowerSlug = cleanSlug.toLowerCase();
  const hyphenSlug = lowerSlug.replace(/\s+/g, "-");
  const spaceSlug = lowerSlug.replace(/-/g, " ");

  // 1. Check verified alias map (supports hyphenated or spaced queries)
  const targetSlug =
    KNOWN_SLUG_ALIASES[lowerSlug] ||
    KNOWN_SLUG_ALIASES[hyphenSlug] ||
    KNOWN_SLUG_ALIASES[spaceSlug] ||
    cleanSlug;

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

  // 4. Try matching with trailing space (for verified database records with trailing whitespace, e.g. 'Fabric elephant ')
  if (!targetSlug.endsWith(" ")) {
    const { data: trailingSpaceMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", `${targetSlug} `)
      .maybeSingle();
    if (trailingSpaceMatch) return trailingSpaceMatch;
  }

  // 5. Try hyphens replaced with spaces (e.g. URL '/products/rakhi-gift' -> DB 'rakhi gift' or 'rakhi gift ')
  if (targetSlug.includes("-")) {
    const spaceVariant = targetSlug.replace(/-/g, " ");
    const { data: spaceMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", spaceVariant)
      .maybeSingle();
    if (spaceMatch) return spaceMatch;

    const { data: spaceTrailingMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", `${spaceVariant} `)
      .maybeSingle();
    if (spaceTrailingMatch) return spaceTrailingMatch;
  }

  // 6. Try spaces replaced with hyphens (e.g. 'Fabric elephant' -> 'Fabric-elephant')
  if (targetSlug.includes(" ")) {
    const hyphenVariant = targetSlug.replace(/\s+/g, "-");
    const { data: hyphenMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .ilike("slug", hyphenVariant)
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
    title: product.seo_title || `${product.name} - Authentic Handlooms`,
    description:
      product.seo_description ||
      `Buy ${product.name} online. ${product.description?.substring(0, 120)}... Delivering across India including Delhi, Mumbai, Bangalore, Pune, and Hyderabad.`,
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
