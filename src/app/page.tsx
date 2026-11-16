import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ShopCategories from "@/components/sections/ShopCategories";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhoWeAre from "@/components/sections/WhoWeAre";
import LifestyleGallery from "@/components/sections/LifestyleGallery";
import CuratedGiftHampers from "@/components/sections/CuratedGiftHampers";
import HandEmbroideredToys from "@/components/sections/HandEmbroideredToys";
import BehindTheLoom from "@/components/sections/BehindTheLoom";
import BrandTrust from "@/components/sections/BrandTrust";
import FeaturedIn from "@/components/sections/FeaturedIn";
import Testimonials from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "Authentic Handlooms & Sarees | Delivering to Mumbai, Delhi, Bangalore & Across India",
  description:
    "Explore Kauseyah's authentic handloom sarees and tribal crafts from Chhattisgarh. Ethical weaves, wild Kosa silk, upcycled textile toys and thoughtful gifting.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="bg-[#FFF9F4] text-[#1A1412] min-h-screen">
      {/* 1. Dual-Mode Hero Section */}
      <Hero />

      {/* 2. Curated Categories Rail */}
      <ShopCategories />

      {/* 3. Bestselling & Featured Products */}
      <FeaturedProducts />

      {/* 4. Client Testimonials & Social Proof (elevated for early trust) */}
      <Testimonials />

      {/* 5. Brand Story / Who We Are */}
      <WhoWeAre />

      {/* 6. Lifestyle & Craft Edit */}
      <LifestyleGallery />

      {/* 7. Conscious Gifting & Hampers */}
      <CuratedGiftHampers />

      {/* 8. Handcrafted Zero-Waste Toys */}
      <HandEmbroideredToys />

      {/* 9. Behind the Loom / Artisan Stories */}
      <BehindTheLoom />

      {/* 10. Bespoke Gifting & Living Values */}
      <BrandTrust />

      {/* 11. National Recognition, Press Coverage & Brand Features */}
      <FeaturedIn />
    </main>
  );
}
