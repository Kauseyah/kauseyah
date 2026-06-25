import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default function TestimonialsPage() {
  return (
    <main className="container-site py-20 space-y-20">
      <h1 className="font-display text-5xl text-center mb-16">Testimonials & Reviews</h1>

      {/* 1. Client Feedback */}
      <section>
        <h2 className="font-display text-3xl mb-8">Client Feedback</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-6 border border-stone-100 shadow-sm">
            <p className="italic text-stone-600 mb-4">"The craftsmanship is unparalleled. You can feel the history in the fabric."</p>
            <p className="font-semibold">- Anjali R.</p>
          </div>
          <div className="card p-6 border border-stone-100 shadow-sm">
            <p className="italic text-stone-600 mb-4">"Absolutely stunning tribal gift box. The packaging and the art piece inside were magnificent."</p>
            <p className="font-semibold">- Michael T.</p>
          </div>
        </div>
      </section>

      {/* 2. Success Stories */}
      <section>
        <h2 className="font-display text-3xl mb-6">Success Stories</h2>
        <p className="text-stone-600 max-w-3xl">
          By choosing Kauseyah, our customers have collectively helped sustain over 50 artisan families 
          in rural India this year, providing steady incomes and preserving endangered craft techniques.
        </p>
      </section>

      {/* 3. Customer Experiences */}
      <section>
        <h2 className="font-display text-3xl mb-6">Customer Experiences</h2>
        <div className="aspect-video bg-stone-200 flex items-center justify-center text-stone-500">
          [Video Testimonials / Experience Stories]
        </div>
      </section>
    </main>
  );
}
