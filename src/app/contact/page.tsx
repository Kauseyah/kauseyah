import type { Metadata } from "next";
import ContactPageContent from "@/components/pages/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Kauseyah team for orders, partnerships, and inquiries.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
