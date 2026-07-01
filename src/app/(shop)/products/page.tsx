/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data";
import { formatPrice } from "@/utils";
import { useCart } from "@/store/CartContext";
import { Star, Search, SlidersHorizontal, ShoppingBag, Check, ChevronRight } from "lucide-react";
import ProductDetailDrawer from "@/components/sections/ProductDetailDrawer";

const CATEGORIES_DATA = [
  {
    id: "handlooms",
    label: "Handlooms",
    subcategories: ["All", "Sarees", "Easy Cotton Kurtis", "Men Kosa Jackets"],
  },
  {
    id: "jewellery",
    label: "Jewellery",
    subcategories: ["All", "Handcrafted Earrings"],
  },
  {
    id: "home-living",
    label: "Home & Living",
    subcategories: ["All", "Baskets", "Wall Plates", "Cow Dung Diyas", "Eco Seed Paper Toran"],
  },
  {
    id: "conscious-gifting",
    label: "Conscious Gifting",
    subcategories: ["All", "Gift Hampers", "Rakhi Collection"],
  },
  {
    id: "tribal-crafts",
    label: "Tribal & Artisan Crafts",
    subcategories: ["All", "Gond Art", "Dhokra Craft"],
  },
  {
    id: "upcycled-waste",
    label: "Upcycled & Zero Waste",
    subcategories: ["All", "Textile Toys", "Faabr"],
  },
];

const PRICE_PRESETS = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹1,000", value: "under-1000" },
  { label: "₹1,000 - ₹3,000", value: "1000-3000" },
  { label: "Over ₹3,000", value: "over-3000" },
];

const RATING_PRESETS = [
  { label: "All Ratings", value: "all" },
  { label: "4.5★ & above", value: "4.5" },
  { label: "4.8★ & above", value: "4.8" },
];

export default function ProductsPage() {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      if (query) setSearchQuery(query);

      const cat = params.get("category");
      if (cat) setSelectedCategory(cat);

      const sub = params.get("subcategory");
      if (sub) setSelectedSubcategory(sub);
    }
  }, []);

  // Handle Add to Cart animation
  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0]);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 2000);
    }
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesTags = product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "all") {
        if (product.category !== selectedCategory) return false;
        
        // 3. Subcategory Filter
        if (selectedSubcategory !== "All" && product.subcategory) {
          if (product.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
        }
      }

      // 4. Price Filter
      if (selectedPriceRange !== "all") {
        if (selectedPriceRange === "under-1000" && product.price >= 1000) return false;
        if (selectedPriceRange === "1000-3000" && (product.price < 1000 || product.price > 3000)) return false;
        if (selectedPriceRange === "over-3000" && product.price <= 3000) return false;
      }

      // 5. Rating Filter
      if (selectedRating !== "all" && product.rating) {
        const minRating = parseFloat(selectedRating);
        if (product.rating < minRating) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
      
      // Default: Featured
      return b.isFeatured ? 1 : a.isFeatured ? -1 : 0;
    });
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedPriceRange, selectedRating, sortBy]);

  return (
    <main className="bg-white">
      {/* ── Page Hero ── */}
      <section className="w-full bg-[#0D0400] pt-36 lg:pt-44 pb-20 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-b from-[#FF6B00]/8 to-transparent blur-[80px]" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-20 text-center relative z-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter text-white leading-tight">
              Our <span className="text-[#FF6B00] italic font-light drop-shadow-[0_2px_8px_rgba(255,107,0,0.15)]">Products</span>
            </h1>
            <p className="font-body text-xs md:text-sm text-[#FFF8F3]/75 mt-3 max-w-xl font-light">
              Explore our complete range of handwoven sarees, clothing, handcrafted jewellery, home decor and zero-waste items.
            </p>
          </div>
        </div>
      </section>

      {/* ── Catalog Section ── */}
      <section className="bg-[#FFF8F3] py-16 lg:py-24">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-16">
          
          {/* Search + Sort Bar */}
          <div className="bg-white rounded-2xl border border-[#FF6B00]/10 p-6 shadow-[0_8px_30px_rgba(181,84,26,0.03)] mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, materials, tags..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-[#FF6B00]/10 focus:border-[#FF6B00] rounded-xl font-body text-sm text-[#111111] outline-none transition-all duration-300"
              />
            </div>

            {/* Sort & Mobile Filters toggle */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4 shrink-0">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-[#FF6B00]/15 hover:border-[#FF6B00] px-4 py-3 rounded-xl font-body text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#FFF8F3] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="font-body text-xs text-stone-500 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-48 bg-stone-50 border border-[#FF6B00]/10 focus:border-[#FF6B00] px-3 py-3 rounded-xl font-body text-xs font-semibold text-[#111111] outline-none transition-colors cursor-pointer"
                >
                  <option value="featured">Featured Masterpieces</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>

          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
            
            {/* ── Left Sidebar Filters (Desktop) ── */}
            <aside className="hidden lg:block lg:sticky lg:top-28 space-y-8 max-h-[85vh] overflow-y-auto pr-2">
              
              {/* Category Filter */}
              <div className="bg-white p-6 rounded-2xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.03)]">
                <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-5 pb-2.5 border-b border-[#FF6B00]/10">
                  Categories
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory("All");
                      }}
                      className={`w-full flex items-center justify-between font-body text-sm py-1.5 text-left transition-colors ${
                        selectedCategory === "all" ? "text-[#FF6B00] font-bold" : "text-stone-600 hover:text-[#FF6B00]"
                      }`}
                    >
                      <span>All Collections</span>
                      <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-500">
                        {PRODUCTS.length}
                      </span>
                    </button>
                  </div>

                  {CATEGORIES_DATA.map((cat) => {
                    const isCatSelected = selectedCategory === cat.id;
                    const catCount = PRODUCTS.filter(p => p.category === cat.id).length;

                    return (
                      <div key={cat.id} className="space-y-2">
                        <button
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubcategory("All");
                          }}
                          className={`w-full flex items-center justify-between font-body text-sm py-1 text-left transition-colors ${
                            isCatSelected ? "text-[#FF6B00] font-bold" : "text-stone-700 hover:text-[#FF6B00]"
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-500">
                            {catCount}
                          </span>
                        </button>

                        {/* Subcategories (Only show if parent category is selected) */}
                        {isCatSelected && (
                          <div className="pl-4 space-y-1 border-l-2 border-[#FF6B00]/20 ml-1">
                            {cat.subcategories.map((sub) => {
                              const isSubSelected = selectedSubcategory === sub;
                              const subCount = sub === "All"
                                ? catCount
                                : PRODUCTS.filter(p => p.category === cat.id && p.subcategory?.toLowerCase() === sub.toLowerCase()).length;

                              return (
                                <button
                                  key={sub}
                                  onClick={() => setSelectedSubcategory(sub)}
                                  className={`w-full flex items-center justify-between font-body text-xs py-1 text-left transition-colors ${
                                    isSubSelected ? "text-[#FF6B00] font-semibold" : "text-stone-500 hover:text-[#FF6B00]"
                                  }`}
                                >
                                  <span>{sub}</span>
                                  <span className="text-[10px] text-stone-400">
                                    ({subCount})
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-white p-6 rounded-2xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.03)]">
                <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4 pb-2 border-b border-[#FF6B00]/10">
                  Price Range
                </h3>
                <div className="space-y-2.5">
                  {PRICE_PRESETS.map((price) => {
                    const isSelected = selectedPriceRange === price.value;
                    return (
                      <button
                        key={price.value}
                        onClick={() => setSelectedPriceRange(price.value)}
                        className={`w-full flex items-center gap-2 font-body text-sm py-1 text-left transition-colors ${
                          isSelected ? "text-[#FF6B00] font-bold" : "text-stone-600 hover:text-[#FF6B00]"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#FF6B00] bg-[#FF6B00]/10" : "border-stone-300 bg-white"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />}
                        </span>
                        {price.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white p-6 rounded-2xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.03)]">
                <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4 pb-2 border-b border-[#FF6B00]/10">
                  Customer Rating
                </h3>
                <div className="space-y-2.5">
                  {RATING_PRESETS.map((rate) => {
                    const isSelected = selectedRating === rate.value;
                    return (
                      <button
                        key={rate.value}
                        onClick={() => setSelectedRating(rate.value)}
                        className={`w-full flex items-center gap-2 font-body text-sm py-1 text-left transition-colors ${
                          isSelected ? "text-[#FF6B00] font-bold" : "text-stone-600 hover:text-[#FF6B00]"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[#FF6B00] bg-[#FF6B00]/10" : "border-stone-300 bg-white"
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />}
                        </span>
                        {rate.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </aside>

            {/* ── Right Content Grid ── */}
            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                      const isAdded = addedProductId === product.id;

                      return (
                        <motion.div
                          layout
                          key={product.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                          onClick={() => setSelectedProduct(product)}
                          className="cursor-pointer group bg-white border border-[#FF6B00]/10 hover:shadow-[0_15px_40px_rgba(181,84,26,0.08)] hover:border-[#FF6B00]/30 transition-all duration-500 rounded-2xl flex flex-col overflow-hidden"
                        >
                          {/* Image Box */}
                          <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden shrink-0">
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt}
                              fill
                              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                            />
                            <div className="absolute inset-0 bg-[#0D0400]/5 transition-colors group-hover:bg-transparent duration-500" />
                            
                            {/* Overlay Badge for Subcategory */}
                            {product.subcategory && (
                              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-1 text-[8px] font-bold tracking-[0.2em] uppercase rounded-md shadow-sm">
                                {product.subcategory}
                              </span>
                            )}
                          </div>

                          {/* Body Content */}
                          <div className="p-6 flex flex-col flex-1 justify-between">
                            <div>
                              {/* Region & Artisan tagline */}
                              <div className="flex items-center gap-1.5 mb-2 font-body text-[10px] text-stone-500 uppercase tracking-widest">
                                <span>{product.region}</span>
                                {product.artisan && (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                                    <span>By {product.artisan.name}</span>
                                  </>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className="font-display text-2xl text-[#111111] group-hover:text-[#FF6B00] transition-colors duration-300 mb-2 leading-tight">
                                <Link 
                                  href={`/products/${product.slug}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedProduct(product);
                                  }}
                                >
                                  {product.name}
                                </Link>
                              </h3>

                              {/* Short Description */}
                              <p className="font-body text-[13px] text-stone-600 line-clamp-2 leading-relaxed mb-4">
                                {product.shortDescription}
                              </p>

                              {/* Star Ratings */}
                              {product.rating && (
                                <div className="flex items-center gap-1.5 mb-4">
                                  <div className="flex text-amber-500">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                      <Star
                                        key={idx}
                                        size={12}
                                        fill={idx < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                                        strokeWidth={1.5}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-body text-[11px] font-semibold text-stone-700 mt-0.5">
                                    {product.rating.toFixed(1)}
                                  </span>
                                  <span className="font-body text-[10px] text-stone-400 mt-0.5">
                                    ({product.reviewsCount} reviews)
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Bottom Footer Price & Cart Button */}
                            <div className="pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between mt-auto">
                              <div className="flex flex-col">
                                <span className="font-body text-[15px] font-bold text-[#111111]">
                                  {formatPrice(product.price)}
                                </span>
                                {product.compareAtPrice && (
                                  <span className="font-body text-[11px] text-stone-400 line-through mt-0.5">
                                    {formatPrice(product.compareAtPrice)}
                                  </span>
                                )}
                              </div>

                              {/* Add to Cart Quick action */}
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-body text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                  isAdded 
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                                    : "bg-[#111111] text-white hover:bg-[#FF6B00] shadow-md shadow-black/10"
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check size={12} strokeWidth={3} />
                                    Added
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag size={12} />
                                    Add
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20 bg-white border border-[#FF6B00]/10 rounded-2xl p-8">
                      <p className="font-body text-stone-500 text-lg mb-2">No matching products found.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedSubcategory("All");
                          setSelectedPriceRange("all");
                          setSelectedRating("all");
                        }}
                        className="font-body text-xs font-semibold text-[#FF6B00] border-b border-[#FF6B00] pb-0.5 hover:text-[#111111] hover:border-[#111111] transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* ── Mobile Filters Drawer Panel ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[100] bg-black"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-[110] w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-4 border-b border-[#FF6B00]/10">
                  <h2 className="font-display text-2xl text-[#111111]">Filters</h2>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="font-body text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-[#111111]"
                  >
                    Close
                  </button>
                </div>

                {/* Categories (Mobile) */}
                <div>
                  <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-4">
                    Categories
                  </h3>
                  <div className="space-y-3 pl-1">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory("All");
                      }}
                      className={`w-full text-left font-body text-sm py-1 transition-colors ${
                        selectedCategory === "all" ? "text-[#FF6B00] font-bold" : "text-stone-600"
                      }`}
                    >
                      All Collections
                    </button>
                    {CATEGORIES_DATA.map((cat) => {
                      const isCatSelected = selectedCategory === cat.id;
                      return (
                        <div key={cat.id} className="space-y-1.5">
                          <button
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedSubcategory("All");
                            }}
                            className={`w-full text-left font-body text-sm py-0.5 transition-colors ${
                              isCatSelected ? "text-[#FF6B00] font-bold" : "text-stone-700"
                            }`}
                          >
                            {cat.label}
                          </button>
                          {isCatSelected && (
                            <div className="pl-4 space-y-1.5 border-l border-[#FF6B00]/20 ml-1">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub}
                                  onClick={() => setSelectedSubcategory(sub)}
                                  className={`w-full text-left font-body text-xs py-0.5 transition-colors ${
                                    selectedSubcategory === sub ? "text-[#FF6B00] font-semibold" : "text-stone-500"
                                  }`}
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price (Mobile) */}
                <div>
                  <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {PRICE_PRESETS.map((price) => (
                      <button
                        key={price.value}
                        onClick={() => setSelectedPriceRange(price.value)}
                        className={`w-full text-left font-body text-sm py-1 flex items-center gap-2 ${
                          selectedPriceRange === price.value ? "text-[#FF6B00] font-bold" : "text-stone-600"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full border shrink-0 ${
                          selectedPriceRange === price.value ? "border-[#FF6B00] bg-[#FF6B00]" : "border-stone-300"
                        }`} />
                        {price.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating (Mobile) */}
                <div>
                  <h3 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-[#111111] mb-3">
                    Customer Rating
                  </h3>
                  <div className="space-y-2">
                    {RATING_PRESETS.map((rate) => (
                      <button
                        key={rate.value}
                        onClick={() => setSelectedRating(rate.value)}
                        className={`w-full text-left font-body text-sm py-1 flex items-center gap-2 ${
                          selectedRating === rate.value ? "text-[#FF6B00] font-bold" : "text-stone-600"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full border shrink-0 ${
                          selectedRating === rate.value ? "border-[#FF6B00] bg-[#FF6B00]" : "border-stone-300"
                        }`} />
                        {rate.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-stone-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#111111] text-white py-3 rounded-xl font-body text-xs font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product details sidebar drawer */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailDrawer 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

    </main>
  );
}
