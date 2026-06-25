import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="container-site py-20 max-w-4xl mx-auto space-y-12">
      <h1 className="font-display text-5xl text-center mb-16">Privacy Policy</h1>

      <section>
        <h2 className="font-display text-3xl mb-4">Information Collection</h2>
        <p className="text-stone-600">
          We collect information you provide directly to us when you create an account, make a purchase, 
          or sign up for our newsletter. This includes name, email, shipping address, and payment details.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">Use of Personal Information</h2>
        <p className="text-stone-600">
          The information we collect is used to process your orders, communicate with you about your 
          purchases, and send promotional materials if you have opted in.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">Data Protection & Security</h2>
        <p className="text-stone-600">
          We implement industry-standard security measures to protect your personal information. 
          Your payment data is securely processed via trusted third-party gateways and is never 
          stored on our servers.
        </p>
      </section>

      <section>
        <h2 className="font-display text-3xl mb-4">Contact Information</h2>
        <p className="text-stone-600">
          If you have questions about this Privacy Policy, please contact us at privacy@kauseyah.com.
        </p>
      </section>
    </main>
  );
}
