import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <main className="container-site py-20 space-y-24">
      <h1 className="font-display text-5xl text-center mb-16">Portfolio & Gallery</h1>

      {/* 1. Product Showcase */}
      <section>
        <h2 className="font-display text-3xl mb-8 text-center">Product Showcase</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-stone-200"></div>
          <div className="aspect-square bg-stone-100"></div>
          <div className="aspect-square bg-stone-200"></div>
          <div className="aspect-square bg-stone-100"></div>
        </div>
      </section>

      {/* 2. Project Gallery */}
      <section>
        <h2 className="font-display text-3xl mb-8 text-center">Artisan Projects Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-stone-200"></div>
          <div className="h-64 bg-stone-100"></div>
          <div className="h-64 bg-stone-200"></div>
        </div>
      </section>

      {/* 3. Instagram Feed Integration */}
      <section>
        <h2 className="font-display text-3xl mb-8 text-center">Instagram Feed</h2>
        <div className="text-center text-stone-500 py-12 border border-dashed border-stone-300">
          [Instagram Feed integration goes here]
        </div>
      </section>
    </main>
  );
}
