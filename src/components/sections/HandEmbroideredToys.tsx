import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import HandEmbroideredToysClient from "./HandEmbroideredToysClient";

export default async function HandEmbroideredToys() {
  const supabase = await createClient();

  // Slugs for the 5 client-approved hot sellers in exact order:
  // 1. Men Kosa Jacket
  // 2. Journals
  // 3. Saree Pouch
  // 4. Bhai Hamper
  // 5. Christmas Hamper
  const hotSellerSlugs = [
    "premium-handloom-kosa-silk-jacket-men",
    "journal",
    "Saree organisers ",
    "ham",
    "Christmas hamper",
  ];

  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .in("slug", hotSellerSlugs);

  const slugOrder: Record<string, number> = {
    "premium-handloom-kosa-silk-jacket-men": 0,
    "journal": 1,
    "Saree organisers ": 2,
    "ham": 3,
    "Christmas hamper": 4,
  };

  const products = (sbProducts || [])
    .sort((a, b) => (slugOrder[a.slug.trim()] ?? 99) - (slugOrder[b.slug.trim()] ?? 99))
    .map(mapSupabaseProductToFrontend);

  return <HandEmbroideredToysClient products={products} />;
}
