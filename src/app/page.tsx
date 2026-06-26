import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import WhoWeAre from "@/components/sections/WhoWeAre";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedIn from "@/components/sections/FeaturedIn";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import InstagramReels from "@/components/sections/InstagramReels";
import FAQ from "@/components/sections/FAQ";

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

      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Featured In */}
      <FeaturedIn />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Instagram Reels */}
      <InstagramReels />

      {/* 7. FAQ */}
      <FAQ />

    </main>
  );
}
