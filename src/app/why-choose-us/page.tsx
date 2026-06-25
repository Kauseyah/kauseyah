import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Choose Us",
};

export default function WhyChooseUsPage() {
  return (
    <main className="container-site py-20 space-y-24">
      <h1 className="font-display text-5xl text-center mb-16">Why Choose Us</h1>

      {/* 1. Unique Selling Points */}
      <section>
        <h2 className="font-display text-3xl mb-4">Unique Selling Points</h2>
        <p className="text-stone-600 mb-6">
          Direct artisan-to-consumer model cutting out middlemen, ensuring 100% authenticity.
        </p>
      </section>

      {/* 2. Quality Commitment */}
      <section>
        <h2 className="font-display text-3xl mb-4">Quality Commitment</h2>
        <p className="text-stone-600 mb-6">
          Every piece is inspected for quality while respecting the natural imperfections 
          that define handmade goods.
        </p>
      </section>

      {/* 3. Customer-Centric Approach */}
      <section>
        <h2 className="font-display text-3xl mb-4">Customer-Centric Approach</h2>
        <p className="text-stone-600 mb-6">
          We prioritize transparency, offering deep stories of where your product came from, 
          along with responsive customer support.
        </p>
      </section>

      {/* 4. Expertise & Experience */}
      <section>
        <h2 className="font-display text-3xl mb-4">Expertise & Experience</h2>
        <p className="text-stone-600 mb-6">
          Our team intimately understands textiles and tribal arts, working closely with 
          master craftsmen to bridge traditional skills with modern design.
        </p>
      </section>
    </main>
  );
}
