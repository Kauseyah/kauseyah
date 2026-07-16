import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import CuratedGiftHampersClient from "./CuratedGiftHampersClient";

export default async function CuratedGiftHampers() {
  const supabase = await createClient();

  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    // Filter by category slug for "conscious-gifting" or whatever the slug is for gift hampers
    // Wait, since we are using foreign key, we need to filter on the joined table or fetch the category id first.
    // Actually, supabase allows filtering on joined tables: .eq('category.slug', 'conscious-gifting')
    // Wait, a better way is to just fetch the category ID first if joining is tricky, or just fetch all and filter in memory if small.
    // Let's try .eq('categories.slug', 'conscious-gifting') -> this might not work perfectly without inner join syntax.
    // Since this is a simple store, fetching top 20 and filtering is safe, or better:
    
    // Instead of doing a complex query if we aren't sure of the exact slug, we can do this:
    // .limit(50);
    // and filter in memory for now to ensure it doesn't break if the slug is slightly different (like 'gift-hampers')
    
  // Let's use the exact categories table filtering if possible:
  // .eq('categories.name', 'Gift Hampers') (Wait, what is the actual category name? The user said "gift hampers")
  // Let's just fetch all published and filter by category name containing "Hamper" or "Gift" or slug "conscious-gifting"
  
  // To be perfectly safe, let's fetch products and filter
  // in javascript to avoid supabase syntax errors on relations.
    .limit(100);

  let products = (sbProducts || []).map(mapSupabaseProductToFrontend);
  
  // Filter to STRICTLY show ONLY products with the "Gift Hampers" subcategory
  let hampers = products.filter(p => {
    const isGiftingCategory = p.category?.toLowerCase().includes("hamper") || 
                              p.category?.toLowerCase().includes("gift") ||
                              p.category?.toLowerCase() === "conscious-gifting" ||
                              p.category?.toLowerCase() === "conscious gifting";
                              
    const subcategory = p.subcategory?.toLowerCase() || "";
    
    // If a subcategory is selected (like Rakhi Collection, Sunglass Pouch, etc.), 
    // it MUST contain "hamper" to be shown in this section.
    if (subcategory) {
      return isGiftingCategory && subcategory.includes("hamper");
    }
    
    // Fallback: If they forgot to select a subcategory, only show it if the product name contains "hamper"
    return isGiftingCategory && (p.name.toLowerCase().includes("hamper") || p.category?.toLowerCase().includes("hamper"));
  });
  
  // If we can't find any, fallback to showing an empty state rather than disappearing
  if (hampers.length === 0) {
    // We will just pass an empty array, and handle it in the Client component
    return <CuratedGiftHampersClient hampers={[]} />;
  }

  return <CuratedGiftHampersClient hampers={hampers} />;
}
