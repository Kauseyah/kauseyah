import type { Product, BlogPost } from "@/types";

export function mapSupabaseProductToFrontend(sbProduct: any): Product {
  return {
    id: sbProduct.id,
    slug: sbProduct.slug,
    name: sbProduct.name,
    description: sbProduct.description || "",
    shortDescription: sbProduct.description?.substring(0, 60) || "",
    material: sbProduct.material,
    careInstructions: sbProduct.care_instructions,
    category: sbProduct.category?.name || "Uncategorized",
    subcategory: sbProduct.subcategory,
    price: sbProduct.price,
    compareAtPrice: sbProduct.discount_price || undefined,
    images: sbProduct.images && sbProduct.images.length > 0 
      ? sbProduct.images.map((url: string, i: number) => ({ url, alt: sbProduct.name, isPrimary: i === 0 }))
      : [{ url: "/images/placeholder.png", alt: "Placeholder", isPrimary: true }],
    variants: [{ id: sbProduct.id, stock: sbProduct.stock, price: sbProduct.price }], // Fallback for stock
    tags: sbProduct.featured ? ["featured"] : [],
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
