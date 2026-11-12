import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import HandEmbroideredToysClient from "./HandEmbroideredToysClient";

export default async function HandEmbroideredToys() {
  const supabase = await createClient();

  // Fetch actual published textile toys from database
  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .ilike("subcategory", "%toy%")
    .order("created_at", { ascending: false })
    .limit(8);

  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  return <HandEmbroideredToysClient toys={products} />;
}
