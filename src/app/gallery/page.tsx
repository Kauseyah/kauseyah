import type { Metadata } from "next";
import GalleryPageContent from "@/components/pages/GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore the craft, colour, and community behind Kauseyah's handloom and tribal creations.",
};

export default function GalleryPage() {
  return <GalleryPageContent />;
}
