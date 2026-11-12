import { notFound, redirect } from "next/navigation";
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
    filter: (p) => p.category === "apparels",
  },
  "festive-earth": {
    title: "Festive Earth Collection",
    description: "A celebration of India's tribal festivals — bold, vibrant, and deeply rooted in the joy of community.",
    filter: (p) => p.tags.includes("bestseller") || p.isFeatured,
  },
};


const COLLECTION_ALIASES: Record<string, string> = {
  "handlooms": "apparels",
  "handloom": "apparels",
  "textiles": "apparels",
  "hamper": "gift-hampers",
  "hampers": "gift-hampers",
  "gifts": "gift-hampers",
  "upcycled-waste": "textile-toys",
  "toys": "textile-toys",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const rawClean = decodeURIComponent(rawSlug).trim();
  const slug = COLLECTION_ALIASES[rawClean.toLowerCase()] || rawClean;

  // 1. Check predefined collections
  const predefined = PREDEFINED_COLLECTIONS[slug];
  if (predefined) {
    return { 
      title: `${predefined.title} - Kauseyah Handlooms`, 
      description: predefined.description,
      keywords: [predefined.title, "Handlooms", "Sarees", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chhattisgarh"],
      alternates: { canonical: `/collections/${slug}` }
    };
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
      title: `${category.name} - Kauseyah Handlooms`,
      description: category.description ? `${category.description} Delivering authentic handlooms across India including Mumbai, Delhi, and Bangalore.` : undefined,
      keywords: [category.name, "Handlooms", "Sarees", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chhattisgarh"],
      alternates: { canonical: `/collections/${slug}` }
    };
  }

  // 2b. Fetch subcategory from Supabase if not a category
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("name")
    .eq("slug", slug)
    .single();

  if (subcategory) {
    return {
      title: `${subcategory.name} - Kauseyah Handlooms`,
      description: `Buy ${subcategory.name} online. Handcrafted and delivered to Delhi, Mumbai, Pune, Bangalore and across India.`,
      keywords: [subcategory.name, "Handlooms", "Sarees", "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chhattisgarh"],
      alternates: { canonical: `/collections/${slug}` }
    };
  }

  // 3. Fallback to mock generic collections if DB fails
  const mockCollection = COLLECTIONS.find((c) => c.slug === slug);
  if (mockCollection) {
    return { 
      title: `${mockCollection.name} - Kauseyah`, 
      description: mockCollection.description,
      keywords: [mockCollection.name, "Handlooms", "Mumbai", "Delhi", "Bangalore"],
      alternates: { canonical: `/collections/${slug}` }
    };
  }

  return {};
}

export default async function CollectionDetailPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const rawClean = decodeURIComponent(rawSlug).trim();
  const slug = COLLECTION_ALIASES[rawClean.toLowerCase()] || rawClean;
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

  if (category) {
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

  // ─── 4. If not a category, try Subcategory ───
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, name, category_id")
    .eq("slug", slug)
    .single();

  if (subcategory) {
    let description = "";
    if (subcategory.category_id) {
      const { data: catData } = await supabase
        .from("categories")
        .select("description")
        .eq("id", subcategory.category_id)
        .single();
      if (catData?.description) description = catData.description;
    }

    let query = supabase
      .from("products")
      .select("*, category:categories(name)")
      .eq("status", "published")
      .ilike("subcategory", subcategory.name);

    const { data: sbProducts } = await query;
    const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

    return (
      <CollectionDetailPageClient
        title={subcategory.name}
        description={description}
        products={products}
      />
    );
  }

  // If neither category nor subcategory was found, show 404
  notFound();
}
