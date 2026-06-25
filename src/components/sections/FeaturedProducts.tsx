"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const blurIn = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: (i = 0) => ({
    opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

const slideUpBlur = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)", scale: 0.98 },
  show: (i = 0) => ({
    opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 1.1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <section className="w-full bg-[#FAF8F5] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-10 lg:px-20">

        {/* ── Rich Header Section ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-[#EAE6D9] pb-10">
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl"
          >
            <motion.span variants={blurIn} custom={0} className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
              Our Curations
            </motion.span>
            <motion.h2 variants={blurIn} custom={1} className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410] mb-6">
              Featured Masterpieces
            </motion.h2>
            <motion.p variants={blurIn} custom={2} className="font-body text-lg lg:text-xl text-[#1A1410]/70 max-w-2xl leading-relaxed">
              Discover a meticulously curated selection of authentic Indian handlooms and tribal artistry. 
              Each piece in this collection is crafted by indigenous artisans using traditional techniques 
              passed down through generations, ensuring you wear a true story of heritage.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center border border-[#1A1410] px-8 py-4 font-body text-[11px] font-bold tracking-[0.2em] text-[#1A1410] uppercase hover:bg-[#1A1410] hover:text-[#FAF8F5] transition-all duration-300"
              >
                Explore The Collection
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Rich Detailed Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              custom={i}
              variants={slideUpBlur}
              className="group bg-white border border-[#EAE6D9] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#C8892A]/30 transition-all duration-500 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-[#F2EFEA]">
                <Image
                  src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                  alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-white/90 backdrop-blur-sm text-[#1A1410] px-3 py-1 font-body text-[9px] uppercase tracking-[0.2em] shadow-sm">
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rich Text Body */}
              <div className="p-8 flex flex-col flex-1">
                {/* Artisan & Region Meta */}
                {product.artisan && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#C8892A]">
                    {product.artisan.region}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#EAE6D9]" />
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#3D2B1F]/60">
                    By {product.artisan.name}
                  </span>
                </div>
                )}

                {/* Title */}
                <Link href={`/products/${product.slug}`} className="block font-display text-3xl text-[#1A1410] group-hover:text-[#C8892A] transition-colors mb-4 leading-tight">
                  {product.name}
                </Link>

                {/* Descriptive Text Added Here */}
                <p className="font-body text-[14px] text-[#3D2B1F]/70 leading-relaxed mb-8 line-clamp-3">
                  {product.description}
                </p>

                {/* Footer / Price & Action */}
                <div className="mt-auto pt-6 border-t border-[#EAE6D9] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-body text-[16px] font-medium text-[#1A1410]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.compareAtPrice && (
                      <span className="font-body text-[12px] text-[#3D2B1F]/40 line-through mt-0.5">
                        ₹{product.compareAtPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <Link 
                    href={`/products/${product.slug}`}
                    className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1410] border-b border-[#1A1410] pb-0.5 group-hover:text-[#C8892A] group-hover:border-[#C8892A] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
