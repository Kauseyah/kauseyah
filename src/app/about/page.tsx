import type { Metadata } from "next";
import AboutPageContent from "@/components/pages/AboutPageContent";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Kauseyah's story, mission, and core values.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
