import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Kauseyah's story, mission, and core values.",
};

export default function AboutPage() {
  return (
    <main className="container-site py-20 space-y-24">
      <h1 className="font-display text-5xl text-center mb-16">About Us</h1>

      {/* 1. Brand Story */}
      <section>
        <h2 className="font-display text-3xl mb-4">Our Brand Story</h2>
        <div className="prose prose-stone max-w-none text-stone-600">
          <p>
            Born out of love for indigenous art, Kauseyah began as a journey to understand 
            the silent languages spoken through threads and tribal motifs. We traveled 
            across the heartlands of India to connect with master artisans whose hands 
            have kept ancient traditions alive.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section>
        <h2 className="font-display text-3xl mb-4">Mission & Vision</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-6 bg-stone-50 rounded">
            <h3 className="font-display text-2xl mb-2">Our Mission</h3>
            <p className="text-stone-600">
              To provide a global platform for indigenous craft, ensuring fair wages 
              and global recognition for traditional weavers and tribal artists.
            </p>
          </div>
          <div className="p-6 bg-stone-50 rounded">
            <h3 className="font-display text-2xl mb-2">Our Vision</h3>
            <p className="text-stone-600">
              A world where heritage crafts are not just preserved in museums, but thriving 
              in contemporary lifestyles, empowering the communities that create them.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section>
        <h2 className="font-display text-3xl mb-6">Core Values</h2>
        <ul className="grid md:grid-cols-3 gap-6">
          <li className="card p-6">
            <h4 className="font-semibold mb-2">Authenticity</h4>
            <p className="text-sm text-stone-600">Sourcing directly from genuine artisans.</p>
          </li>
          <li className="card p-6">
            <h4 className="font-semibold mb-2">Sustainability</h4>
            <p className="text-sm text-stone-600">Eco-friendly materials and slow fashion.</p>
          </li>
          <li className="card p-6">
            <h4 className="font-semibold mb-2">Empowerment</h4>
            <p className="text-sm text-stone-600">Uplifting tribal indigenous communities.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
