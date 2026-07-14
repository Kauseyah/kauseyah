import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import HandEmbroideredToysClient from "./HandEmbroideredToysClient";

const FALLBACK_TOYS = [
  {
    title: "Handmade Doll",
    src: "/images/toy_doll.png",
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
    src: "/images/toy_elephant.png",
    subtitle: "Animal Kingdom",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  },
  {
    title: "Fabric Rattle",
    src: "/images/toy_rattle.png",
    subtitle: "Infant Joy",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  },
  {
    title: "Woven Bird",
    src: "/images/toy_bird.png",
    subtitle: "Nostalgic Sky",
    href: "/collections/upcycled-waste?subcategory=Textile+Toys"
  }
];

const LAYOUT = [
  { span: "md:col-span-7", height: "h-[260px] sm:h-[320px] lg:h-[400px] xl:h-[550px]" },
  { span: "md:col-span-5", height: "h-[260px] sm:h-[320px] lg:h-[400px] xl:h-[550px]" },
  { span: "md:col-span-4", height: "h-[220px] sm:h-[280px] lg:h-[350px] xl:h-[450px]" },
  { span: "md:col-span-4", height: "h-[220px] sm:h-[280px] lg:h-[350px] xl:h-[450px]" },
  { span: "md:col-span-4", height: "h-[220px] sm:h-[280px] lg:h-[350px] xl:h-[450px]" }
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
  ).slice(0, 5); // Take top 5

  // Map to the layout structure, using fallbacks if we don't have 5 toys in DB
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
