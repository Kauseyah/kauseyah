import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import WhoWeAre from "@/components/sections/WhoWeAre";
import LifestyleGallery from "@/components/sections/LifestyleGallery";
import HandEmbroideredToys from "@/components/sections/HandEmbroideredToys";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedIn from "@/components/sections/FeaturedIn";
import CuratedGiftHampers from "@/components/sections/CuratedGiftHampers";
import Testimonials from "@/components/sections/Testimonials";
import InstagramReels from "@/components/sections/InstagramReels";

export const metadata: Metadata = {
  title: "Authentic Handlooms & Sarees | Delivering to Mumbai, Delhi, Bangalore & Across India",
  description: "Explore Kauseyah's authentic handloom sarees and tribal crafts from Chhattisgarh. We offer fast shipping to Mumbai, Delhi, Bangalore, Hyderabad, Pune, and all major cities in India.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Who We Are */}
      <WhoWeAre />

      {/* 3. Lifestyle Gallery */}
      <LifestyleGallery />

      {/* Hand Embroidered Toys */}
      <HandEmbroideredToys />

      {/* Gift Hampers */}
      <CuratedGiftHampers />

      {/* 4. Featured Products */}
      <FeaturedProducts />

      {/* 4. Featured In */}
      <FeaturedIn />


      {/* 5. Testimonials */}
      <Testimonials />

      {/* 7. Instagram Reels */}
      <InstagramReels />

    </main>
  );
}
