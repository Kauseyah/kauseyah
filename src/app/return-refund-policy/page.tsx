import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/constants";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "Review Kauseyah's official return, refund, replacement, and cancellation policies for our authentic handloom textiles and handcrafted tribal crafts.",
  alternates: { canonical: "/return-refund-policy" },
  openGraph: {
    title: `Return & Refund Policy — ${SITE_NAME}`,
    description:
      "Review Kauseyah's official return, refund, replacement, and cancellation policies for our authentic handloom textiles and handcrafted tribal crafts.",
    url: "/return-refund-policy",
  },
};

export default function ReturnRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F3] pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-body text-[#111111]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#FF6B00] mb-3">
            Customer Care &amp; Transparency
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#111111] mb-4">
            Return &amp; Refund Policy
          </h1>
          <div className="w-20 h-0.5 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-[#6E6E6E] text-sm sm:text-base max-w-2xl mx-auto">
            At {SITE_NAME}, every product is a celebration of India&apos;s indigenous handloom heritage
            and artisan dedication. We are committed to transparency and exceptional service.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-[#FF6B00]/15 shadow-[0_4px_30px_rgba(0,0,0,0.03)] p-6 sm:p-10 lg:p-12 space-y-10 leading-relaxed text-[#2D2825]">
          
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">1. Introduction</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Thank you for supporting {SITE_NAME} and India&apos;s tribal artisan communities.
              Because our collections are handmade on traditional handlooms using natural fibers and
              upcycled textiles, subtle irregularities in weave, color variations, and natural texture are
              distinctive hallmarks of authenticity rather than defects. We invite you to read our return
              and refund terms carefully before placing an order.
            </p>
          </section>

          {/* Section 2: Return Policy */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">2. Return Policy</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              In accordance with our terms of service, all orders must be paid in full prior to dispatch.
              Returns are accepted exclusively within <strong>7 days of delivery</strong> for items that
              arrive damaged in transit or suffer from manufacturing defects. Due to the artisanal and
              limited-batch nature of our pieces, voluntary returns for general buyer remorse are not supported.
            </p>
          </section>

          {/* Section 3: Eligibility for Returns */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">3. Eligibility for Returns</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              To qualify for a verified return or replacement:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-[#6E6E6E] space-y-2">
              <li>The item must be reported within <strong>7 days of delivery</strong>.</li>
              <li>The item must remain unused, unwashed, unaltered, and in the exact condition received.</li>
              <li>Original tags, cloth packaging, and invoice/receipt must be retained and intact.</li>
              <li>Clear photographic or unboxing video evidence demonstrating the defect must be provided upon request.</li>
            </ul>
          </section>

          {/* Section 4: Non-Returnable Products */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">4. Non-Returnable Products</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Certain categories are strictly non-returnable to preserve hygiene, artisan labor, and custom specifications:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-[#6E6E6E] space-y-2">
              <li>Custom-tailored garments and bespoke outfits created to specific individual measurements.</li>
              <li>Items marked as final sale or special festive hamper editions.</li>
              <li>Products that have been washed, worn, altered, or damaged due to improper handling.</li>
              <li>Any item without its original packaging and tags.</li>
            </ul>
          </section>

          {/* Section 5: Damaged or Defective Products */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">5. Damaged or Defective Products</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              We take great care in packaging our handcrafted creations securely. However, if your parcel arrives
              visibly tampered with or damaged:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-[#6E6E6E] space-y-2">
              <li>Please document the outer parcel condition before unboxing.</li>
              <li>Take clear photos and an unboxing video highlighting the package label and the affected merchandise.</li>
              <li>Contact our support team within <strong>7 days</strong> so we can immediately inspect the issue and initiate a replacement or refund.</li>
            </ul>
          </section>

          {/* Section 6: Return Request Procedure */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">6. Return Request Procedure</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              To submit a return or defect notification:
            </p>
            <ol className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-[#6E6E6E] space-y-2">
              <li>
                Email our customer care team at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF6B00] font-semibold hover:underline">
                  {CONTACT_EMAIL}
                </a>{" "}
                or legal queries at{" "}
                <a href="mailto:legal@kauseyah.com" className="text-[#FF6B00] font-semibold hover:underline">
                  legal@kauseyah.com
                </a>
                .
              </li>
              <li>Include your <strong>Order ID</strong> (e.g., KAS-XXXXXX), registered email address, and contact number.</li>
              <li>Attach high-resolution photos or video footage showing the issue clearly.</li>
              <li>Our team will review your request and provide return shipping or pickup instructions within 24 to 48 business hours.</li>
            </ol>
          </section>

          {/* Section 7: Exchange Policy */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">7. Exchange Policy</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Because each piece is crafted in limited numbers by our weavers, direct exchanges are subject to current inventory availability. If a defective or damaged product qualifies for replacement but an identical item is out of stock, customers may select an alternate item of equivalent value or receive a full refund.
            </p>
          </section>

          {/* Section 8: Refund Policy */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">8. Refund Policy</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Once your returned item is safely received at our facility and verified by our quality inspection team, a refund will be authorized. Refunds are processed back to the original source account used during online payment (via our authorized gateway, Razorpay).
            </p>
          </section>

          {/* Section 9: Refund Processing Timeline */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">9. Refund Processing Timeline</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Upon successful verification of the return, the refund initiation is triggered promptly. The credited amount typically reflects in your bank account, credit card, UPI ID, or netbanking source within <strong>5 to 7 business days</strong>, depending on your banking institution&apos;s processing cycles.
            </p>
          </section>

          {/* Section 10: Order Cancellation Policy */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">10. Order Cancellation Policy</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              If you need to cancel an order, please contact customer support immediately. Orders can be cancelled provided they have not yet been dispatched by our logistics partners. Once an order is packed and dispatched, it cannot be cancelled in transit. Custom or bespoke orders enter craftsmanship production immediately and cannot be cancelled once weaving or tailoring begins.
            </p>
          </section>

          {/* Section 11: Shipping Charges and Return Shipping */}
          <section className="space-y-3 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">11. Shipping Charges and Return Shipping</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Our standard shipping policy applies across all domestic orders:
            </p>
            <div className="bg-[#FFF8F3] p-4 sm:p-5 rounded-2xl border border-[#FF6B00]/20 space-y-2">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-medium text-[#111111]">Cart Subtotal strictly above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}:</span>
                <span className="font-bold text-emerald-600 uppercase">Free Shipping</span>
              </div>
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-medium text-[#111111]">Cart Subtotal of ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")} or below:</span>
                <span className="font-bold text-[#111111]">₹{STANDARD_SHIPPING_FEE} Flat Rate</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              For approved returns of damaged or defective merchandise, {SITE_NAME} arranges reverse pickup or reimburses the return shipping fee. Initial shipping fees on non-defective orders are non-refundable.
            </p>
          </section>

          {/* Section 12: Contact and Customer Support */}
          <section className="space-y-4 border-t border-gray-100 pt-8">
            <h2 className="font-display text-2xl sm:text-3xl text-[#111111]">12. Contact and Customer Support</h2>
            <p className="text-sm sm:text-base text-[#6E6E6E]">
              Our dedicated support team is here to assist with any questions or order queries:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FFF8F3] rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">Customer Support Email</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-[#111111] hover:text-[#FF6B00] transition-colors break-all">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="p-4 bg-[#FFF8F3] rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">Legal Queries</p>
                <a href="mailto:legal@kauseyah.com" className="font-medium text-[#111111] hover:text-[#FF6B00] transition-colors break-all">
                  legal@kauseyah.com
                </a>
              </div>
              <div className="p-4 bg-[#FFF8F3] rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                <a href={`tel:${CONTACT_PHONE}`} className="font-medium text-[#111111] hover:text-[#FF6B00] transition-colors">
                  {CONTACT_PHONE}
                </a>
              </div>
              <div className="p-4 bg-[#FFF8F3] rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">Support Hours</p>
                <p className="font-medium text-[#111111]">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#6E6E6E] pt-2">
              For other legal terms and privacy disclosures, please visit our{" "}
              <Link href="/terms" className="text-[#FF6B00] underline underline-offset-4 hover:text-[#111111]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#FF6B00] underline underline-offset-4 hover:text-[#111111]">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}

