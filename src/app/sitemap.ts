import { MetadataRoute } from 'next';
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kauseyah.com';
  const supabase = await createClient();

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/return-refund-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 2. Dynamic Products
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('status', 'published');
  
  const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. Dynamic Blogs
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, created_at')
    .eq('published', true);
  
  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 4. Dynamic Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at');

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${baseUrl}/collections/${category.slug}`,
    lastModified: category.created_at ? new Date(category.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...categoryRoutes];
}
