import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch all published products
  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("status", "published");

  // Fetch all categories for the filter sidebar
  const { data: sbCategories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const products = (sbProducts || []).map(mapSupabaseProductToFrontend);
  
  // Format categories for the sidebar
  const categoriesData = (sbCategories || []).map((cat) => ({
    id: cat.id,
    label: cat.name,
    slug: cat.slug,
    subcategories: ["All"], // No subcategories in schema currently
  }));

  return <ProductsClient initialProducts={products} categoriesData={categoriesData} />;
}
