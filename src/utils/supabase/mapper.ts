import type { Product, BlogPost } from "@/types";

export function mapSupabaseProductToFrontend(sbProduct: any): Product {
  // Canonical discount price resolution:
  // compareAtPrice is the higher original/list price before discount
  let compareAtPrice: number | undefined = undefined;
  if (typeof sbProduct.compare_at_price === "number" && sbProduct.compare_at_price > sbProduct.price) {
    compareAtPrice = sbProduct.compare_at_price;
  } else if (typeof sbProduct.discount_price === "number" && sbProduct.discount_price > sbProduct.price) {
    compareAtPrice = sbProduct.discount_price;
  }

  // Parse specifications safely into ProductSpecification[] ({ key, value })
  let specs: { key: string; value: string }[] = [];
  if (Array.isArray(sbProduct.specifications)) {
    specs = sbProduct.specifications.map((s: any) => {
      if (s && typeof s === "object" && "key" in s && "value" in s) {
        return { key: String(s.key), value: String(s.value) };
      }
      return { key: String(s), value: "" };
    });
  } else if (typeof sbProduct.specifications === "string") {
    try {
      const parsed = JSON.parse(sbProduct.specifications);
      if (Array.isArray(parsed)) {
        specs = parsed.map((s: any) => ({ key: String(s.key || s), value: String(s.value || "") }));
      } else if (parsed && typeof parsed === "object") {
        specs = Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
      }
    } catch (_) {}
  } else if (sbProduct.specifications && typeof sbProduct.specifications === "object") {
    specs = Object.entries(sbProduct.specifications).map(([key, value]) => ({ key, value: String(value) }));
  }

  return {
    id: sbProduct.id,
    slug: sbProduct.slug,
    name: sbProduct.name,
    subtitle: sbProduct.subtitle || undefined,
    description: sbProduct.description || "",
    shortDescription: sbProduct.short_description || sbProduct.description?.substring(0, 160) || "",
    material: sbProduct.material,
    careInstructions: sbProduct.care_instructions,
    dimensions: sbProduct.dimensions || undefined,
    specifications: specs,
    videoUrl: sbProduct.video_url || undefined,
    videoPosterUrl: sbProduct.video_poster_url || undefined,
    publicNotes: sbProduct.public_notes || undefined,
    // Note: internal_notes is deliberately omitted from public frontend mapping for security
    seoTitle: sbProduct.seo_title || undefined,
    seoDescription: sbProduct.seo_description || undefined,
    sku: sbProduct.sku || undefined,
    category: sbProduct.category?.name || "Uncategorized",
    subcategory: sbProduct.subcategory,
    price: sbProduct.price,
    compareAtPrice,
    discountPrice: sbProduct.discount_price || undefined,
    images: sbProduct.images && sbProduct.images.length > 0 
      ? sbProduct.images.map((url: string, i: number) => ({ url, alt: sbProduct.name, isPrimary: i === 0 }))
      : [{ url: "/images/placeholder.png", alt: "Placeholder", isPrimary: true }],
    variants: (sbProduct.variants && sbProduct.variants.length > 0)
      ? sbProduct.variants.map((v: any, idx: number) => ({
          ...v,
          id: v.id || `${sbProduct.id}-var-${idx}`,
          price: typeof v.price === "number" && v.price > 0 ? v.price : sbProduct.price,
          stock: v.stock !== undefined ? v.stock : sbProduct.stock,
          imageUrl: v.imageUrl || undefined,
        }))
      : [{ id: sbProduct.id, stock: sbProduct.stock, price: sbProduct.price }], // Fallback for stock
    tags: sbProduct.featured ? (["featured"] as any) : [],
    isAvailable: sbProduct.status === "published" && sbProduct.stock > 0,
    isFeatured: sbProduct.featured,
    createdAt: sbProduct.created_at,
  };
}

export function mapSupabaseBlogToFrontend(sbBlog: any): BlogPost {
  return {
    id: sbBlog.id,
    slug: sbBlog.slug,
    title: sbBlog.title,
    excerpt: sbBlog.excerpt || "",
    content: sbBlog.content || "",
    coverImage: { url: sbBlog.cover_image || "/images/placeholder.png", alt: sbBlog.title },
    author: sbBlog.author || "Admin",
    publishedAt: sbBlog.created_at,
    tags: [],
  };
}
