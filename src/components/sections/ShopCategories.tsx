import { createClient } from "@/utils/supabase/server";
import ShopCategoriesClient, { CategoryCardData } from "./ShopCategoriesClient";

interface CategoryDefinition {
  id: string;
  name: string;
  tagline: string;
  href: string;
  fallbackImage: string;
  queryType: "subcategory" | "category";
  queryValue: string;
}

const CURATED_DEFINITIONS: CategoryDefinition[] = [
  {
    id: "sarees",
    name: "Sarees",
    tagline: "Kosa Silk & Handlooms",
    href: "/collections/sarees",
    fallbackImage: "/images/shadi_collection.png",
    queryType: "subcategory",
    queryValue: "Sarees",
  },
  {
    id: "kurtis",
    name: "Easy Kurtis",
    tagline: "Pure Handspun Cotton",
    href: "/collections/easy-cotton-kurtis",
    fallbackImage: "/images/custom_outfit.jpeg",
    queryType: "subcategory",
    queryValue: "Easy Cotton Kurtis",
  },
  {
    id: "dupattas",
    name: "Dupattas",
    tagline: "Ikat & Tribal Motifs",
    href: "/collections/dupattas",
    fallbackImage: "/images/artesian/image2.jpg",
    queryType: "subcategory",
    queryValue: "Dupattas",
  },
  {
    id: "textile-toys",
    name: "Textile Toys",
    tagline: "Zero-Waste Remnants",
    href: "/collections/textile-toys",
    fallbackImage: "/images/toy_elephant2.jpeg",
    queryType: "subcategory",
    queryValue: "Textile Toys",
  },
  {
    id: "gift-hampers",
    name: "Gift Hampers",
    tagline: "Thoughtful Keepsakes",
    href: "/collections/gift-hampers",
    fallbackImage: "/images/seasonal_edit.png",
    queryType: "subcategory",
    queryValue: "Gift Hampers",
  },
  {
    id: "home-living",
    name: "Home Decor",
    tagline: "Baskets & Tribal Art",
    href: "/collections/home-living",
    fallbackImage: "/images/artesian/image6.png",
    queryType: "category",
    queryValue: "home-living",
  },
];

export default async function ShopCategories() {
  const supabase = await createClient();

  // Fetch category id for home-living if needed
  const { data: homeCat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", "home-living")
    .single();

  const homeCatId = homeCat?.id;

  // Concurrently fetch sample products and counts for each curated category
  const categoriesWithData: CategoryCardData[] = await Promise.all(
    CURATED_DEFINITIONS.map(async (def) => {
      let query = supabase
        .from("products")
        .select("images", { count: "exact" })
        .eq("status", "published");

      if (def.queryType === "subcategory") {
        query = query.ilike("subcategory", def.queryValue);
      } else if (def.queryType === "category" && homeCatId) {
        query = query.eq("category_id", homeCatId);
      }

      const { data: products, count } = await query.limit(1);
      const primaryImg = products?.[0]?.images?.[0];

      return {
        id: def.id,
        name: def.name,
        tagline: def.tagline,
        href: def.href,
        image: primaryImg || def.fallbackImage,
        count: count ?? undefined,
      };
    })
  );

  return <ShopCategoriesClient categories={categoriesWithData} />;
}
