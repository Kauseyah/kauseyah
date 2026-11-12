import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import ProductDetailPageClient from "@/components/pages/ProductDetailPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const KNOWN_SLUG_ALIASES: Record<string, string> = {
  "men-kosa-jacket": "premium-handloom-kosa-silk-jacket-men",
  "men-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "kosa-jacket": "premium-handloom-kosa-silk-jacket-men",
  "handloom-kosa-silk-jacket": "premium-handloom-kosa-silk-jacket-men",
  "cuddle-hamper": "hamper",
  "gift-hamper": "hamper",
  "bhai-keepsake-hamper": "ham",
  "corporate-gifts": "corporate hampers",
  "diwali-shagun-thali": "diwali",
};

async function fetchProductBySlug(supabase: any, rawSlug: string) {
  const cleanSlug = rawSlug.trim();
  const lowerSlug = cleanSlug.toLowerCase();

  // 0. Check alias map
  const targetSlug = KNOWN_SLUG_ALIASES[lowerSlug] || cleanSlug;

  // 1. Exact match on targetSlug
  const { data: exact } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .eq("slug", targetSlug)
    .maybeSingle();
  if (exact) return exact;

  // 2. Case-insensitive match
  const { data: ilikeMatch } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .ilike("slug", targetSlug)
    .maybeSingle();
  if (ilikeMatch) return ilikeMatch;

  // 3. Match with trailing/leading space (resilient to database data entry quirks)
  const { data: trailingSpaceMatch } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .or(`slug.ilike.${targetSlug} ,slug.ilike. ${targetSlug}`)
    .maybeSingle();
  if (trailingSpaceMatch) return trailingSpaceMatch;

  // 4. Try hyphens replaced with spaces (e.g. 'rakhi-gift' -> 'rakhi gift')
  if (targetSlug.includes("-")) {
    const spaceSlug = targetSlug.replace(/-/g, " ");
    const { data: spaceMatch } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .or(`slug.ilike.${spaceSlug},slug.ilike.${spaceSlug} `)
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

  // 6. Fuzzy match on product name using significant words
  const words = cleanSlug
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "for", "with"].includes(w.toLowerCase()));

  if (words.length > 0) {
    let q = supabase
      .from("products")
      .select("*, category:categories(name)")
      .eq("status", "published");
    for (const w of words) {
      q = q.ilike("name", `%${w}%`);
    }
    const { data: fuzzy } = await q.limit(1);
    if (fuzzy && fuzzy.length > 0) {
      return fuzzy[0];
    }
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
