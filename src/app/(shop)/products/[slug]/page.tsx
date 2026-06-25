import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS } from "@/data";
import { formatPrice } from "@/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="container-site py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          {/* TODO: <ProductImageGallery images={product.images} /> */}
          <div className="aspect-product bg-stone-100 rounded flex items-center justify-center text-stone-400">
            Product Image Gallery
          </div>
        </div>

        {/* Product Info */}
        <div>
          {product.artisan && (
            <p className="text-xs uppercase tracking-widest text-ochre-600 mb-2">
              By {product.artisan.name} · {product.region}
            </p>
          )}
          <h1 className="font-display text-4xl">{product.name}</h1>
          <p className="mt-2 text-stone-500">{product.shortDescription}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-stone-400 line-through text-lg">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* TODO: <VariantSelector variants={product.variants} /> */}
          {/* TODO: <AddToCartButton product={product} /> */}
          {/* TODO: <WishlistButton productId={product.id} /> */}

          <div className="mt-8 prose prose-stone">
            <p>{product.description}</p>
            {product.material && <p><strong>Material:</strong> {product.material}</p>}
            {product.careInstructions && <p><strong>Care:</strong> {product.careInstructions}</p>}
          </div>
        </div>
      </div>

      {/* TODO: <RelatedProducts category={product.category} currentId={product.id} /> */}
      {/* TODO: <ArtisanCard artisan={product.artisan} /> */}
    </div>
  );
}
