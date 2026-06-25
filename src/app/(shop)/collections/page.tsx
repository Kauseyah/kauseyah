import type { Metadata } from "next";
import { COLLECTIONS } from "@/data";
import { CATEGORIES } from "@/constants";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore Kauseyah's handloom, clothing, and tribal gift collections.",
};

export default function CollectionsPage() {
  return (
    <div className="container-site py-16">
      <h1 className="font-display text-5xl mb-4">Our Collections</h1>
      <p className="text-stone-500 text-lg mb-12 max-w-2xl">
        Each collection tells a story — of a tribe, a terrain, a technique preserved across centuries.
      </p>
      {/* TODO: <CollectionGrid collections={COLLECTIONS} /> */}
      {/* TODO: <CategoryFilter categories={CATEGORIES} /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => (
          <div key={col.id} className="card p-6">
            <h2 className="font-display text-2xl">{col.name}</h2>
            <p className="mt-2 text-stone-500 text-sm">{col.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
