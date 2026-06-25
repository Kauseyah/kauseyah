import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
};

export default function FAQPage() {
  return (
    <main className="container-site py-20 space-y-16 max-w-4xl mx-auto">
      <h1 className="font-display text-5xl text-center mb-16">Frequently Asked Questions</h1>

      {/* 1. Common Queries */}
      <section>
        <h2 className="font-display text-3xl mb-6 border-b border-stone-200 pb-2">Common Queries</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How long does delivery take?</h3>
            <p className="text-stone-600">Standard delivery takes 5-7 business days across India.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Are the products truly handmade?</h3>
            <p className="text-stone-600">Yes, every product listed on Kauseyah is 100% authentic and handmade.</p>
          </div>
        </div>
      </section>

      {/* 2. Service / Product Questions */}
      <section>
        <h2 className="font-display text-3xl mb-6 border-b border-stone-200 pb-2">Product Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How should I wash my handloom saree?</h3>
            <p className="text-stone-600">We recommend dry cleaning only to maintain the dye and weave integrity.</p>
          </div>
        </div>
      </section>

      {/* 3. Support Information */}
      <section>
        <h2 className="font-display text-3xl mb-6 border-b border-stone-200 pb-2">Support Information</h2>
        <p className="text-stone-600">
          Still have questions? Our support team is available Monday-Friday, 9 AM to 6 PM IST.
          <br /><br />
          Email: <span className="font-semibold">support@kauseyah.com</span>
        </p>
      </section>
    </main>
  );
}
