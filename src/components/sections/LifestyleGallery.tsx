import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import LifestyleGalleryClient from "./LifestyleGalleryClient";

const HARDCODED_CATEGORIES = [
  {
    title: "Explore our Shadi collection",
    src: "/images/shadi_collection.png",
    subtitle: "Heritage Bridal",
    gridClass: "lg:col-span-8 lg:row-span-1",
    position: "center 15%",
    href: "/collections/handlooms?subcategory=Sarees"
  },
  {
    title: "Contemporary Menswear",
    src: "/images/menswear.png",
    subtitle: "Modern Heritage",
    gridClass: "lg:col-span-4 lg:row-span-1",
    position: "center 10%",
    href: "/collections/kosa-jackets"
  },
  {
    title: "Get your custom outfit done",
    src: "/images/custom_outfit.png",
    subtitle: "Artisan Bespoke",
    gridClass: "lg:col-span-4 lg:row-span-1",
    position: "center 20%",
    href: "/collections/handlooms?subcategory=Easy+Cotton+Kurtis"
  },
  {
    title: "Shop our seasonal edit",
    src: "/images/seasonal_edit.png",
    subtitle: "Curated Handloom",
    gridClass: "lg:col-span-8 lg:row-span-1",
    position: "center 15%",
    href: "/collections/jewellery"
  }
];

export default async function LifestyleGallery() {
  const supabase = await createClient();

  // Fetch the latest 100 products to find matches for our 4 lifestyle cards
  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(100);

  let products = (sbProducts || []).map(mapSupabaseProductToFrontend);

  // Helper function to find a matching product based on keywords
  const findProduct = (keywords: string[]) => {
    return products.find(p => {
      const cat = p.category?.toLowerCase() || "";
      const sub = p.subcategory?.toLowerCase() || "";
      return keywords.some(kw => cat.includes(kw) || sub.includes(kw));
    });
  };

  // 1. Shadi / Bridal (Sarees)
  const shadiProduct = findProduct(["saree", "bridal", "wedding", "lehenga"]);
  
  // 2. Menswear
  const mensProduct = findProduct(["men", "menswear", "jacket"]);

  // 3. Custom / Kurtis
  const customProduct = findProduct(["kurti", "suit", "custom", "bespoke"]);

  // 4. Seasonal / Jewellery
  const seasonalProduct = findProduct(["jewel", "seasonal", "edit", "featured"]);

  const mappedCategories = HARDCODED_CATEGORIES.map((hc, i) => {
    let matchedProduct = null;
    if (i === 0) matchedProduct = shadiProduct;
    if (i === 1) matchedProduct = mensProduct;
    if (i === 2) matchedProduct = customProduct;
    if (i === 3) matchedProduct = seasonalProduct;

    if (matchedProduct) {
      let productImg = matchedProduct.images.find(img => img.isPrimary)?.url || matchedProduct.images[0]?.url;
      // If the product has a placeholder image (meaning the user uploaded a product without an image), use the beautiful fallback image instead
      if (!productImg || productImg.includes("placeholder")) {
        productImg = hc.src;
      }

      return {
        ...hc,
        title: matchedProduct.name, // Use the product name as the main title
        subtitle: hc.title, // Keep the original "Explore our Shadi collection" as the subtitle overhead
        src: productImg,
        href: `/products/${matchedProduct.slug}`,
      };
    }

    return hc; // Fallback to hardcoded if no product found in that category
  });

  return <LifestyleGalleryClient categories={mappedCategories} />;
}
