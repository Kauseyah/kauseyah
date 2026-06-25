import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COLLECTIONS } from "@/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  return (
    <div className="container-site py-16">
      <h1 className="font-display text-5xl">{collection.name}</h1>
      <p className="mt-4 text-stone-500 max-w-2xl">{collection.description}</p>
      {/* TODO: <ProductGrid products={collection.products} /> */}
    </div>
  );
}
