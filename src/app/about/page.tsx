import type { Metadata } from "next";
import AboutPageContent from "@/components/pages/AboutPageContent";

export const metadata: Metadata = {
  title: "Our Story - Authentic Handlooms & Chhattisgarh Crafts",
  description: "Learn about Kauseyah's story, mission, and core values. We bring the rich heritage of Chhattisgarh handlooms to metro cities like Delhi, Mumbai, Pune, Bangalore and across India.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
