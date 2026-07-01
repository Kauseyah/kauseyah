"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";

const ALL_BLOG_POSTS = [
  {
    id: "b1",
    slug: "story-of-ikat",
    title: "The Story of Ikat: Threads That Carry Time",
    excerpt: "Ikat is not just a weaving technique — it is a language of patience, culture, and identity passed down through generations.",
    coverImage: "/images/indigenous_textile_close_up_1782640177042.png",
    author: "Kauseyah Editorial",
    publishedAt: "2026-06-15",
    category: "Educational",
    tags: ["handloom", "ikat"],
  },
  {
    id: "b2",
    slug: "bhil-visual-universe",
    title: "The Bhil Visual Universe: Art as Devotion",
    excerpt: "For the Bhil people, painting is not decorative — it is documentary, devotional, and a vibrant storytelling medium.",
    coverImage: "/images/artisan_workshop_portrait_1782640198563.png",
    author: "Kauseyah Editorial",
    publishedAt: "2026-06-10",
    category: "Insights",
    tags: ["tribal", "bhil"],
  },
  {
    id: "b3",
    slug: "reviving-chhattisgarh-weavers",
    title: "Reviving Tribal Handlooms in Chhattisgarh",
    excerpt: "Exploring our direct partnerships with local weaver families and how slow craft cycles sustain remote rural livelihoods.",
    coverImage: "/images/tribal_handloom_weaving_v2_1782640224732.png",
    author: "Shweta Rao",
    publishedAt: "2026-05-28",
    category: "Heritage",
    tags: ["artisans", "handloom"],
  },
  {
    id: "b4",
    slug: "indigo-dyeing-magic",
    title: "The Alchemy of Natural Indigo Dyeing",
    excerpt: "A deep dive into the organic indigo vats, examining the science and poetry behind nature's most magical color.",
    coverImage: "/images/menswear.png",
    author: "Craft Research Lab",
    publishedAt: "2026-05-15",
    category: "Educational",
    tags: ["indigo", "natural-dyes"],
  },
  {
    id: "b5",
    slug: "slow-fashion-philosophy",
    title: "Slow Fashion: Conscious Choices for Tomorrow",
    excerpt: "Why choosing handwoven garments is an act of environmental preservation and respect for human labor.",
    coverImage: "/images/seasonal_edit.png",
    author: "Conscious Design Group",
    publishedAt: "2026-04-30",
    category: "Insights",
    tags: ["slow-fashion", "sustainability"],
  },
  {
    id: "b6",
    slug: "tribal-toys-preservation",
    title: "Hand-Embroidered Toys: Preserving Tribal Magic",
    excerpt: "Meet the women artisans craftily shaping organic cotton and local wool into whimsical toy companions for children.",
    coverImage: "/images/toy_doll.png",
    author: "Kauseyah Editorial",
    publishedAt: "2026-04-12",
    category: "Artisans",
    tags: ["toys", "women-empowerment"],
  },
  {
    id: "b7",
    slug: "bridging-the-gap-fair-trade",
    title: "Bridging the Gap: Fair Trade and Artisan Livelihoods",
    excerpt: "How direct ethical access to national and global markets changes families, communities, and craft legacies.",
    coverImage: "/images/about/about.jpeg",
    author: "Shweta Rao",
    publishedAt: "2026-03-25",
    category: "Artisans",
    tags: ["fair-trade", "artisans"],
  }
];

const ITEMS_PER_PAGE = 5;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on selected category
  const filteredPosts = ALL_BLOG_POSTS.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Calculate pagination details
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Categories helper
  const categories = ["All", "Educational", "Insights", "Heritage", "Artisans"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-white">
      {/* ── Page Hero ── */}
      <section className="w-full bg-[#0D0400] pt-32 lg:pt-36 pb-20 lg:pb-32 overflow-hidden relative">
        {/* Decorative gradient glowing orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-[#FF6B00]/8 to-transparent blur-[80px]" />
        </div>

        <div className="max-w-[900px] mx-auto px-10 lg:px-20 text-center relative z-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#FF6B00]" />
              <span className="font-body text-[11px] tracking-[0.35em] text-[#FF6B00] uppercase font-bold">
                Articles & Stories
              </span>
              <span className="w-8 h-px bg-[#FF6B00]" />
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white mb-8 leading-[0.9]">
              Blog & <span className="text-[#FF6B00] italic font-light drop-shadow-[0_2px_8px_rgba(255,107,0,0.15)]">Insights</span>
            </h1>

            <div className="w-16 h-[2px] bg-[#FF6B00] mb-8" />

            <p className="font-body text-lg md:text-xl lg:text-2xl text-[#FFF8F3]/90 leading-relaxed max-w-2xl mb-8 font-light">
              A journal of handlooms, tribal heritage, organic design philosophy and artisan empowerment.
            </p>

            <div className="flex flex-col items-center max-w-md mx-auto pt-6 border-t border-[#FF6B00]/15">
              <p className="font-display text-lg md:text-xl italic text-white/95 leading-relaxed mb-4">
                &ldquo;Every fabric has a voice, every craft has a soul.&rdquo;
              </p>
              <p className="font-body text-[11px] tracking-[0.2em] text-[#FF6B00] uppercase font-bold">
                — The Kauseyah Chronicle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Blog Content Section ── */}
      <section className="bg-[#FFF8F3] py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid lg:grid-cols-[250px_1fr] gap-12 lg:gap-16 items-start">
            
            {/* Sidebar Categories */}
            <aside className="lg:sticky lg:top-28 bg-white p-6 md:p-8 rounded-2xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.04)]">
              <h3 className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-[#111111] mb-6 pb-3 border-b border-[#FF6B00]/10">
                Categories
              </h3>
              <ul className="space-y-3 font-body text-sm">
                {categories.map((cat) => {
                  const count = cat === "All" 
                    ? ALL_BLOG_POSTS.length 
                    : ALL_BLOG_POSTS.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

                  return (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full flex items-center justify-between py-2 text-left transition-all duration-300 ${
                          isSelected 
                            ? "text-[#FF6B00] font-semibold pl-2" 
                            : "text-[#111111]/70 hover:text-[#FF6B00]"
                        }`}
                      >
                        <span className="relative flex items-center gap-2">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />}
                          {cat}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-[#FF6B00]/10 text-[#FF6B00]" : "bg-stone-100 text-stone-500"
                        }`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Vertical Blog Feed Container */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedCategory + "_" + currentPage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
                      <article 
                        key={post.id}
                        className="bg-white rounded-2xl border border-[#FF6B00]/10 p-5 md:p-6 shadow-[0_12px_45px_rgba(181,84,26,0.03)] hover:shadow-[0_18px_50px_rgba(181,84,26,0.08)] hover:border-[#FF6B00]/30 transition-all duration-500 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch group"
                      >
                        {/* Cover Image */}
                        <div className="relative w-full md:w-[280px] lg:w-[320px] min-h-[200px] md:min-h-auto aspect-[16/10] md:aspect-auto overflow-hidden rounded-xl bg-stone-100 shrink-0">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                            sizes="(max-width: 768px) 100vw, 350px"
                          />
                          {/* Fine dark overlay for mood */}
                          <div className="absolute inset-0 bg-[#0D0400]/5 group-hover:bg-[#0D0400]/0 transition-colors duration-500" />
                          
                          {/* Category Tag overlay */}
                          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#FF6B00] border border-[#FF6B00]/10 px-3 py-1 text-[9px] font-bold tracking-[0.15em] uppercase rounded-md shadow-sm">
                            {post.category}
                          </span>
                        </div>

                        {/* Article Info details */}
                        <div className="flex flex-col justify-between flex-1 py-1">
                          <div>
                            {/* Metadata date/author */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-body text-stone-500 mb-3">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-[#FF6B00]/70" />
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[#FF6B00]/30" aria-hidden />
                              <span className="flex items-center gap-1.5">
                                <User size={13} className="text-[#FF6B00]/70" />
                                {post.author}
                              </span>
                            </div>

                            {/* Title with beautiful display font */}
                            <h3 className="font-display text-2xl lg:text-3xl text-[#111111] mb-4 group-hover:text-[#FF6B00] transition-colors duration-300 leading-snug">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h3>

                            {/* Excerpt */}
                            <p className="font-body text-[14px] lg:text-[15px] text-stone-600 leading-relaxed mb-6">
                              {post.excerpt}
                            </p>
                          </div>

                          {/* CTA link */}
                          <div>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] text-[#111111] uppercase group-hover:text-[#FF6B00] transition-all duration-300"
                            >
                              Read Article 
                              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5 text-[#FF6B00]" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white border border-[#FF6B00]/10 rounded-2xl p-8">
                      <p className="font-body text-stone-500 text-lg">No articles found in this category.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Pagination Controls */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-3 pt-10 border-t border-[#FF6B00]/10">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-full bg-white border border-[#FF6B00]/10 font-body text-xs font-semibold tracking-wider text-[#111111] hover:bg-[#FF6B00] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#111111] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = currentPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full font-body text-xs font-semibold flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25" 
                            : "bg-white border border-[#FF6B00]/10 text-[#111111] hover:bg-[#FF6B00] hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2.5 rounded-full bg-white border border-[#FF6B00]/10 font-body text-xs font-semibold tracking-wider text-[#111111] hover:bg-[#FF6B00] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#111111] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              )}

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
