import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Are Different",
};

export default function HowWeAreDifferentPage() {
  return (
    <main className="container-site py-20 space-y-16">
      <h1 className="font-display text-5xl text-center mb-16">How We Are Different</h1>

      {/* 1. What Sets Us Apart */}
      <section>
        <h2 className="font-display text-3xl mb-4">What Sets Us Apart</h2>
        <p className="text-stone-600">
          We don't just sell clothes; we curate living artifacts. Every item carries the signature 
          of its region and the history of its people.
        </p>
      </section>

      {/* 2. Competitive Advantages */}
      <section>
        <h2 className="font-display text-3xl mb-4">Competitive Advantages</h2>
        <p className="text-stone-600">
          Exclusive access to remote tribal craft clusters and limited-batch production ensures 
          that our offerings are truly rare.
        </p>
      </section>

      {/* 3. Brand Differentiators */}
      <section>
        <h2 className="font-display text-3xl mb-4">Brand Differentiators</h2>
        <p className="text-stone-600">
          An unwavering commitment to cultural sustainability — meaning we focus on keeping 
          the art forms alive in their original context, not mass-producing adaptations.
        </p>
      </section>

      {/* 4. Value Proposition */}
      <section>
        <h2 className="font-display text-3xl mb-4">Value Proposition</h2>
        <p className="text-stone-600">
          Wearable art that is ethical, sustainable, and makes a direct economic impact on artisans.
        </p>
      </section>
    </main>
  );
}
