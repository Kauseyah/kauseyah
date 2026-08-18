import type { Metadata } from "next";
import Image from "next/image";
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

      {/* Awards Section */}
      <section className="w-full bg-[#fcf9f2] py-16 px-4 sm:px-6 lg:px-8 border-y border-amber-100">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          
          {/* Text Content */}
          <div className="text-center mb-10 space-y-4">
            <div className="inline-block px-6 py-2 rounded bg-amber-500 text-stone-950 text-sm sm:text-base font-black tracking-widest uppercase shadow-md border-b-4 border-amber-700">
              Recognised at a National Platform
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
              Naari Vandan Award <br className="hidden md:block" />
              <span className="text-amber-700 italic font-light text-2xl sm:text-3xl lg:text-4xl">for Excellence in Crafts & Tribal Empowerment</span>
            </h2>
            <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full mt-4"></div>
            <p className="text-base md:text-lg text-stone-600 font-medium mt-4 max-w-4xl mx-auto leading-relaxed">
              Presented by <span className="text-stone-900 font-semibold">Smt. Smriti Irani Ji</span>, National General Secretary, in the presence of <span className="text-stone-900 font-semibold">Shri Praveen Khandelwal Ji</span>, Hon’ble MP, and <span className="text-stone-900 font-semibold">Shri Balakrishna Bharatiya Ji</span>, National President, CAIT
            </p>
          </div>

          {/* Image Container */}
          <div className="w-full relative max-w-5xl">
            <div className="absolute inset-0 bg-amber-200/40 rounded-2xl transform translate-x-3 translate-y-3 sm:translate-x-5 sm:translate-y-5"></div>
            <Image
              src="/images/winner.jpeg"
              alt="Naari Vandan Award"
              width={1600}
              height={1000}
              className="relative z-10 w-full h-auto rounded-2xl shadow-2xl object-cover border-[6px] border-white"
            />
          </div>
          
        </div>
      </section>

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
