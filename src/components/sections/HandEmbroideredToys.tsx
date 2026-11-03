import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import HandEmbroideredToysClient from "./HandEmbroideredToysClient";

const FALLBACK_TOYS = [
  {
    title: "Handmade Doll",
    src: "/images/toy_doll2.jpeg",
    subtitle: "Heritage Craft",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  },
  {
    title: "Embroidered Camel",
    src: "/images/toy_camel.png",
    subtitle: "Desert Nomads",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  },
  {
    title: "Stitched Elephant",
    src: "/images/toy_elephant2.jpeg",
    subtitle: "Animal Kingdom",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  }
];

const LAYOUT = [
  { span: "md:col-span-4", height: "h-[260px] sm:h-[320px] lg:h-[400px] xl:h-[550px]" },
  { span: "md:col-span-4", height: "h-[260px] sm:h-[320px] lg:h-[400px] xl:h-[550px]" },
  { span: "md:col-span-4", height: "h-[260px] sm:h-[320px] lg:h-[400px] xl:h-[550px]" }
];

export default async function HandEmbroideredToys() {
  const supabase = await createClient();

  // Fetch products that might be toys
  const { data: sbProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50); // fetch enough to filter

  let products = (sbProducts || []).map(mapSupabaseProductToFrontend);
  
  // Filter for toys (checking category/subcategory name for 'toy')
  let dbToys = products.filter(p => 
    p.category?.toLowerCase().includes("toy") || 
    p.subcategory?.toLowerCase().includes("toy")
  ).slice(0, 3); // Take top 3

  // Map to the layout structure, using fallbacks if we don't have 3 toys in DB
  const mappedToys = LAYOUT.map((layout, i) => {
    if (i < dbToys.length) {
      const p = dbToys[i];
      let productImg = p.images.find(img => img.isPrimary)?.url || p.images[0]?.url;
      if (!productImg || productImg.includes("placeholder")) {
        productImg = FALLBACK_TOYS[i].src;
      }

      return {
        title: p.name,
        src: productImg,
        subtitle: p.subcategory || p.category || "Heritage Craft",
        href: `/products/${p.slug}`,
        span: layout.span,
        height: layout.height,
        tag: "Nostalgia" // Custom tag for toys
      };
    } else {
      // Fallback
      return {
        ...FALLBACK_TOYS[i],
        span: layout.span,
        height: layout.height,
        tag: "Nostalgia"
      };
    }
  });

  return <HandEmbroideredToysClient toys={mappedToys} />;
}
