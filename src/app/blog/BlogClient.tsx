"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";

const ITEMS_PER_PAGE = 5;

export default function BlogClient({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = initialBlogs.filter((post) => {
    if (selectedCategory === "All") return true;
    return post.tags?.includes(selectedCategory.toLowerCase()); // or category if we had it
  });

  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const categories = ["All", "Educational", "Insights", "Heritage", "Artisans"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
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
        <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="mx-auto">

            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedCategory + "_" + currentPage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col space-y-10"
                >
                  {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post) => (
                      <article 
                        key={post.id}
                        className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-[#FF6B00]/5 shadow-[0_12px_45px_rgba(181,84,26,0.03)] hover:shadow-[0_20px_60px_rgba(181,84,26,0.08)] hover:border-[#FF6B00]/20 transition-all duration-500 p-4 md:p-6 gap-8 items-center"
                      >
                        <Link href={`/blog/${post.slug}`} className="relative w-full md:w-[380px] shrink-0 aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 block">
                          <Image
                            src={post.coverImage.url}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                        </Link>

                        <div className="flex flex-col flex-1 py-4 md:pr-6">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-body tracking-wider text-stone-500 uppercase mb-4">
                            <span className="flex items-center gap-1.5 font-bold text-[#FF6B00]">
                              <Calendar size={14} />
                              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#FF6B00]/30" aria-hidden />
                            <span className="flex items-center gap-1.5 font-bold text-stone-400">
                              <User size={14} />
                              {post.author}
                            </span>
                          </div>

                          <h3 className="font-display text-3xl lg:text-4xl text-[#111111] mb-4 group-hover:text-[#FF6B00] transition-colors duration-300 leading-tight">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="font-body text-[15px] text-stone-600 leading-relaxed mb-8 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="mt-auto">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] text-[#111111] uppercase group-hover:text-[#FF6B00] transition-all duration-300"
                            >
                              Read Article 
                              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-2 text-[#FF6B00]" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white border border-[#FF6B00]/10 rounded-3xl p-8">
                      <p className="font-body text-stone-500 text-lg">No articles found in this category.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-3 pt-10 border-t border-[#FF6B00]/10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-full bg-white border border-[#FF6B00]/10 font-body text-xs font-semibold tracking-wider text-[#111111] hover:bg-[#FF6B00] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#111111] transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

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
