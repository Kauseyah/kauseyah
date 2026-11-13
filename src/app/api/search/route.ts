import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQ = searchParams.get("q") || "";
    // Sanitize wildcards and PostgREST syntax operators (, and parentheses)
    const q = rawQ
      .trim()
      .replace(/[%_,\(\)]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);

    if (!q || q.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await createClient();

    // 1. Direct query matching full phrase across name, subcategory, or slug
    let { data: products, error } = await supabase
      .from("products")
      .select("id, name, slug, price, discount_price, images, subcategory, category:categories(name)")
      .eq("status", "published")
      .or(`name.ilike.%${q}%,subcategory.ilike.%${q}%,slug.ilike.%${q}%`)
      .limit(8);

    if (error) {
      console.error("[Search API Error]:", error);
      return NextResponse.json({ results: [] }, { status: 500 });
    }

    let combined = products || [];

    // 2. If multi-word search returned few results, try word-level intersection
    const words = q.split(/\s+/).filter(w => w.length > 2);
    if (combined.length < 4 && words.length > 1) {
      let wordQuery = supabase
        .from("products")
        .select("id, name, slug, price, discount_price, images, subcategory, category:categories(name)")
        .eq("status", "published");

      for (const w of words) {
        wordQuery = wordQuery.ilike("name", `%${w}%`);
      }

      const { data: wordMatches } = await wordQuery.limit(8);
      if (wordMatches && wordMatches.length > 0) {
        const existingIds = new Set(combined.map((p: any) => p.id));
        for (const item of wordMatches) {
          if (!existingIds.has(item.id)) {
            combined.push(item);
            existingIds.add(item.id);
          }
        }
      }
    }

    const results = combined.slice(0, 8).map((p: any) => {
      let primaryImg = "/images/placeholder.png";
      if (Array.isArray(p.images) && p.images.length > 0) {
        primaryImg = typeof p.images[0] === "string" ? p.images[0] : (p.images[0]?.url || primaryImg);
      }
      const cleanSlug = typeof p.slug === "string" ? p.slug.trim() : "";

      return {
        id: p.id,
        name: p.name,
        slug: cleanSlug,
        price: p.price,
        discountPrice: p.discount_price,
        image: primaryImg,
        subcategory: p.subcategory || p.category?.name || "Handloom",
        category: p.category?.name || "Craft",
      };
    });

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("[Search Route Unexpected Error]:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
