import type { Metadata } from "next";
import ContactPageContent from "@/components/pages/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us - Kauseyah Handlooms",
  description: "Get in touch with the Kauseyah team for orders, partnerships, and inquiries. Fast delivery across India including Mumbai, Delhi, Hyderabad, and Bangalore.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
