import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  const supabase = await createClient();

  // Try fetching featured products first
  let { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  // If fewer than 4 featured items, supplement with the latest published products
  if (!sbProducts || sbProducts.length < 4) {
    const { data: latestProducts } = await supabase
      .from("products")
      .select("*, category:categories(name, slug)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);
    sbProducts = latestProducts || [];
  }

  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  return <FeaturedProductsClient featuredProducts={products} />;
}
