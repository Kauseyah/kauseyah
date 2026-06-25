import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <main className="container-site py-20 max-w-4xl mx-auto space-y-12">
      <h1 className="font-display text-5xl text-center mb-16">Terms & Conditions</h1>

      <section>
        <h2 className="font-display text-3xl mb-4">1. Website Usage Terms</h2>
        <p className="text-stone-600">
          By accessing Kauseyah, you agree to comply with these terms. The content of the pages 
          is for your general information and use only.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">2. User Responsibilities</h2>
        <p className="text-stone-600">
          Users must ensure that any details provided during registration or checkout are accurate 
          and complete. 
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">3. Intellectual Property Rights</h2>
        <p className="text-stone-600">
          All materials on this website, including design, layout, look, appearance, graphics, 
          and images, are owned by or licensed to Kauseyah.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">4. Limitation of Liability</h2>
        <p className="text-stone-600">
          Kauseyah shall not be liable for any direct, indirect, or consequential loss or damage 
          arising under these terms and conditions.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">5. Payment & Refund Terms</h2>
        <p className="text-stone-600">
          All payments must be made in full before dispatch. We offer returns within 7 days 
          of delivery for damaged or defective items only.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">6. Contact Information</h2>
        <p className="text-stone-600">
          For any legal or terms-related queries, email legal@kauseyah.com.
        </p>
      </section>
    </main>
  );
}
