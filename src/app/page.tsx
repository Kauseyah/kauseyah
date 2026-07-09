import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import WhoWeAre from "@/components/sections/WhoWeAre";
import LifestyleGallery from "@/components/sections/LifestyleGallery";
import HandEmbroideredToys from "@/components/sections/HandEmbroideredToys";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedIn from "@/components/sections/FeaturedIn";
import CuratedGiftHampers from "@/components/sections/CuratedGiftHampers";
import Testimonials from "@/components/sections/Testimonials";
import Achievements from "@/components/sections/Achievements";
import InstagramReels from "@/components/sections/InstagramReels";

export const metadata: Metadata = {
  title: "Kauseyah - Grassroot | Local | Indigenous",
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

      {/* 4. Featured Products */}
      <FeaturedProducts />

      {/* 4. Featured In */}
      <FeaturedIn />

      {/* Gift Hampers */}
      <CuratedGiftHampers />


      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Our Achievements */}
      <Achievements />

      {/* 7. Instagram Reels */}
      <InstagramReels />

    </main>
  );
}
