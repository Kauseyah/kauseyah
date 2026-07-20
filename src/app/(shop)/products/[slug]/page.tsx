import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { mapSupabaseProductToFrontend } from "@/utils/supabase/mapper";
import ProductDetailPageClient from "@/components/pages/ProductDetailPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) return {};
  
  return {
    title: `${product.name} - Authentic Handlooms`,
    description: `Buy ${product.name} online. ${product.description?.substring(0, 120)}... Delivering across India including Delhi, Mumbai, Bangalore, Pune, and Hyderabad.`,
    keywords: [
      product.name,
      product.category || "",
      product.subcategory || "",
      "Handlooms",
      "Buy online in Mumbai",
      "Delhi",
      "Bangalore",
      "Pune",
      "Hyderabad",
      "Chhattisgarh",
      "India"
    ],
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      images: product.images ? product.images.map((url: string) => ({ url })) : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('slug', slug)
    .single();

  if (!product) notFound();

  const mappedProduct = mapSupabaseProductToFrontend(product);

  return <ProductDetailPageClient product={mappedProduct} />;
}
