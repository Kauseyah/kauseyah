import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COLLECTIONS } from "@/data";
import CollectionDetailPageClient from "@/components/pages/CollectionDetailPageClient";
import type { Product } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ─── Predefined Curated Collections ───
// These are special multi-category collections that don't map 1:1 with the DB categories.
const PREDEFINED_COLLECTIONS: Record<
  string,
  {
    title: string;
    description: string;
    filter: (p: Product) => boolean;
  }
> = {
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
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 1. Check predefined collections
  const predefined = PREDEFINED_COLLECTIONS[slug];
  if (predefined) {
    return { title: predefined.title, description: predefined.description };
  }

  // 2. Fetch category from Supabase
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (category) {
    return {
      title: category.name,
      description: category.description || undefined,
    };
  }

  // 3. Fallback to mock generic collections if DB fails
  const mockCollection = COLLECTIONS.find((c) => c.slug === slug);
  if (mockCollection) {
    return { title: mockCollection.name, description: mockCollection.description };
  }

  return {};
}

export default async function CollectionDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const subcategoryQuery = typeof sp.subcategory === "string" ? sp.subcategory : undefined;

  const supabase = await createClient();

  // ─── 1. Check if it's a Predefined Curated Collection ───
  const predefined = PREDEFINED_COLLECTIONS[slug];
  if (predefined) {
    // For curated collections, we fetch ALL published products and filter in JS
    const { data: allSbProducts } = await supabase
      .from("products")
      .select("*, category:categories(name)")
      .eq("status", "published");

    const allProducts = (allSbProducts || []).map(mapSupabaseProductToFrontend);
    
    // Filter resiliently
    const filteredProducts = allProducts.filter((p) => {
      try {
         return predefined.filter({
             ...p,
             category: p.category?.toLowerCase() as any,
         });
      } catch (e) {
          return false;
      }
    });

    return (
      <CollectionDetailPageClient
        title={predefined.title}
        description={predefined.description}
        products={filteredProducts}
      />
    );
  }

  // ─── 2. Fetch Dynamic Category from Database ───
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  // ─── 3. Fetch Products for this Category ───
  let query = supabase
    .from("products")
    .select("*, category:categories(name)")
    .eq("status", "published")
    .eq("category_id", category.id);

  // If a subcategory query parameter is present in the URL, filter by it
  if (subcategoryQuery) {
    query = query.ilike("subcategory", subcategoryQuery);
  }

  const { data: sbProducts } = await query;
  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  const displayTitle = subcategoryQuery || category.name;

  return (
    <CollectionDetailPageClient
      title={displayTitle}
      description={category.description || ""}
      products={products}
    />
  );
}
