import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  const supabase = await createClient();

  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .eq("status", "published")
    .eq("featured", true)
    .limit(10); // show top 10 featured

  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  return <FeaturedProductsClient featuredProducts={products} />;
}
