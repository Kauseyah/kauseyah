import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import CuratedGiftHampersClient from "./CuratedGiftHampersClient";

export default async function CuratedGiftHampers() {
  const supabase = await createClient();

  // Fetch published products in the Gift Hampers subcategory or containing hamper/gift
  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .or("subcategory.ilike.%hamper%,name.ilike.%hamper%,subcategory.ilike.%gift%")
    .order("created_at", { ascending: false })
    .limit(8);

  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  return <CuratedGiftHampersClient hampers={products} />;
}
