 
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils";
import { useCart } from "@/store/CartContext";
import { PRODUCTS } from "@/data";
import { Star, ShoppingBag, Heart, ArrowRight, ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetailPageClientProps {
  product: any;
}

export default function ProductDetailPageClient({ product }: ProductDetailPageClientProps) {
  const { addItem } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Review states
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Calculate dynamic average rating
  const averageRating = useMemo(() => {
    if (reviewsList.length === 0) return 0;
    const sum = reviewsList.reduce((acc, rev) => acc + rev.rating, 0);
    return sum / reviewsList.length;
  }, [reviewsList]);

  // Find currently selected variant based on selection
  const selectedVariant = useMemo(() => {
    return product.variants.find((v: any) => {
      const matchSize = selectedSize ? v.size === selectedSize : true;
      const matchColor = selectedColor ? v.color === selectedColor : true;
      return matchSize && matchColor;
    }) || product.variants[0];
  }, [selectedSize, selectedColor, product]);

  // Handle quantity modification
  const handleQtyChange = (val: number) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= (selectedVariant?.stock || 10)) {
      setQuantity(newQty);
    }
  };

  // Add to cart helper
  const handleAddToCart = () => {
    if (selectedVariant) {
      // Loop to add multiple quantity
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedVariant);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: "r_new_" + Date.now(),
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0],
    };

    setReviewsList([newReview, ...reviewsList]);
    setNewReviewName("");
    setNewReviewRating(5);
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Get related products (same category, excluding current product)
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product]);

  // Colors and sizes arrays
  const uniqueSizes = useMemo(() => {
    const sizes = product.variants.map((v: any) => v.size).filter(Boolean);
    return Array.from(new Set(sizes)) as string[];
  }, [product]);

  const uniqueColors = useMemo(() => {
    const colors = product.variants.map((v: any) => ({ name: v.color, hex: v.colorHex })).filter((c: any) => c.name);
    // Remove duplicates
    const seen = new Set();
    return colors.filter((c: any) => {
      const duplicate = seen.has(c.name);
      seen.add(c.name);
      return !duplicate;
    });
  }, [product]);

  return (
    <div className="bg-[#FFF8F3] min-h-screen py-16 lg:py-24">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        
        {/* Breadcrumb path */}
        <nav className="flex items-center gap-2 font-body text-xs text-stone-500 uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-[#FF6B00]">Home</Link>
          <ChevronRight size={10} />
          <Link href="/collections" className="hover:text-[#FF6B00]">Products</Link>
          <ChevronRight size={10} />
          <span className="text-[#FF6B00] font-bold">{product.name}</span>
        </nav>

        {/* 2. Complete Service / Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start bg-white border border-[#FF6B00]/10 p-6 md:p-8 lg:p-12 rounded-3xl shadow-[0_12px_45px_rgba(181,84,26,0.03)] mb-16">
          
          {/* Left Column: Interactive Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden rounded-2xl border border-[#FF6B00]/10 shadow-[0_8px_30px_rgba(181,84,26,0.03)]">
              <Image
                src={product.images[activeImageIdx]?.url || product.images[0].url}
                alt={product.images[activeImageIdx]?.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
                priority
              />
            </div>

            {/* Thumbnail Carousel selection */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-[4/5] rounded-lg overflow-hidden border bg-stone-50 shrink-0 cursor-pointer transition-all ${
                      activeImageIdx === idx 
                        ? "border-[#FF6B00] shadow-[0_0_0_2px_rgba(255,107,0,0.15)] scale-[1.03]" 
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Detailed Product Info */}
          <div className="space-y-6 bg-white border border-[#FF6B00]/10 rounded-3xl p-6 md:p-8 lg:p-10 shadow-[0_12px_45px_rgba(181,84,26,0.03)] relative overflow-hidden">
            {/* Soft decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B00]/5 to-transparent rounded-bl-full pointer-events-none" />

            
            {/* Meta category/artisan */}
            <div className="flex flex-wrap items-center gap-2.5 font-body text-[11px] uppercase tracking-widest text-[#FF6B00] font-bold">
              <span>{(product.subcategory || product.category)?.replace(/-/g, ' ')}</span>
              {product.region && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                  <span className="text-stone-500 font-medium">{product.region} origin</span>
                </>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-display text-4xl md:text-5xl text-[#111111] leading-tight">
              {product.name}
            </h1>

            {/* Review Stars Summary */}
            {averageRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      fill={idx < Math.floor(averageRating) ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="font-body text-xs font-semibold text-stone-700 mt-0.5">
                  {averageRating.toFixed(1)} / 5.0
                </span>
                <span className="font-body text-xs text-stone-400 mt-0.5">
                  ({reviewsList.length} customer reviews)
                </span>
              </div>
            )}

            {/* Price Detail */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="font-body text-3xl font-extrabold text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="font-body text-lg text-stone-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="font-body text-sm md:text-base text-stone-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color variants selector */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <span className="block font-body text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Color: <span className="text-[#FF6B00]">{selectedColor}</span>
                </span>
                <div className="flex gap-3">
                  {uniqueColors.map((color: any) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        style={{ backgroundColor: color.hex || "#FFF" }}
                        className={`w-8 h-8 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                          isSelected 
                            ? "ring-2 ring-[#FF6B00] ring-offset-2 scale-110" 
                            : "border-stone-300 hover:scale-[1.05]"
                        }`}
                        title={color.name}
                      >
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size variants selector */}
            {uniqueSizes.length > 0 && (
              <div className="space-y-2">
                <span className="block font-body text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Size: <span className="text-[#FF6B00]">{selectedSize}</span>
                </span>
                <div className="flex gap-2">
                  {uniqueSizes.map((size: string) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-xl font-body text-xs font-bold flex items-center justify-center border cursor-pointer transition-all ${
                          isSelected 
                            ? "bg-[#111111] text-white border-[#111111] shadow-md shadow-black/10 scale-105" 
                            : "bg-white border-stone-200 text-stone-700 hover:border-[#FF6B00]/40"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Actions row */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-100">
              
              {/* Qty count selector */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => handleQtyChange(-1)}
                  className="w-8 h-8 font-body font-bold flex items-center justify-center hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-body text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  className="w-8 h-8 font-body font-bold flex items-center justify-center hover:bg-stone-50 rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-[180px] py-3.5 rounded-xl font-body text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
                  addedToCart
                    ? "bg-emerald-600 text-white shadow-emerald-600/10 scale-[1.02]"
                    : "bg-[#111111] text-white hover:bg-[#FF6B00] shadow-black/10 hover:shadow-[#FF6B00]/10"
                }`}
              >
                <ShoppingBag size={14} />
                {addedToCart ? "Added To Cart!" : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistAdded(!wishlistAdded)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border cursor-pointer transition-all duration-300 ${
                  wishlistAdded 
                    ? "bg-red-50 border-red-200 text-red-500" 
                    : "bg-white border-stone-200 text-stone-500 hover:text-red-500 hover:border-red-200"
                }`}
                title="Add to Wishlist"
              >
                <Heart size={18} fill={wishlistAdded ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Guarantees Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-100 text-center font-body text-[10px] text-stone-500 uppercase tracking-widest">
              <div className="flex flex-col items-center gap-2 p-3 bg-stone-50/50 rounded-xl border border-stone-100">
                <ShieldCheck size={18} className="text-[#FF6B00]" />
                <span>100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-stone-50/50 rounded-xl border border-stone-100">
                <Truck size={18} className="text-[#FF6B00]" />
                <span>₹200 Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-stone-50/50 rounded-xl border border-stone-100">
                <RotateCcw size={18} className="text-[#FF6B00]" />
                <span>Easy Returns</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── Tabs Content View ── */}
        <div className="bg-white border border-[#FF6B00]/10 rounded-3xl p-6 md:p-8 lg:p-12 shadow-[0_12px_45px_rgba(181,84,26,0.03)] mb-16">
          <div className="flex border-b border-stone-100 gap-6 font-body text-xs font-bold uppercase tracking-widest mb-8 overflow-x-auto pb-1">
            {["description", "materials", "artisan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 cursor-pointer relative shrink-0 transition-colors ${
                  activeTab === tab ? "text-[#FF6B00]" : "text-stone-400 hover:text-[#111111]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]" />
                )}
              </button>
            ))}
          </div>

          <div className="font-body text-stone-600 leading-relaxed text-sm md:text-base">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="pt-2 grid md:grid-cols-2 gap-4 text-sm border-t border-stone-50 mt-6">
                  {product.material && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#111111] uppercase tracking-wider text-[11px]">Material:</strong> 
                      <span>{product.material}</span>
                    </div>
                  )}
                  {product.region && (
                    <div className="flex items-center gap-2">
                      <strong className="text-[#111111] uppercase tracking-wider text-[11px]">Region:</strong> 
                      <span>{product.region}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "materials" && (
              <div className="space-y-4">
                <h4 className="font-display text-lg text-[#111111]">Care & Fabric Instructions</h4>
                <p><strong>Composition:</strong> {product.material || "Traditional hand-spun organic threads."}</p>
                <p><strong>Care:</strong> {product.careInstructions || "Dry clean or handwash inside-out with cold water."}</p>
              </div>
            )}

            {activeTab === "artisan" && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {product.artisan ? (
                  <>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#FF6B00]/20">
                      <Image
                        src={product.artisan.avatar || "/images/artisan-detail.png"}
                        alt={product.artisan.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display text-2xl text-[#111111]">{product.artisan.name}</h4>
                      <p className="text-[#FF6B00] font-semibold text-xs uppercase tracking-widest">{product.artisan.craft}</p>
                      <p className="text-stone-500 font-light italic text-xs mb-3">{product.artisan.region} Tribe / Community</p>
                      <p className="text-sm text-stone-600 leading-relaxed font-light">{product.artisan.bio}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="italic text-stone-400">Crafted ethically by various tribal families in our Chhattisgarh and Odisha self-help clusters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews & Submit Feedback Form ── */}
        <div className="bg-white border border-[#FF6B00]/10 rounded-3xl p-6 md:p-8 lg:p-12 shadow-[0_12px_45px_rgba(181,84,26,0.03)] mb-16">
          <h2 className="font-display text-3xl text-[#111111] mb-8 pb-4 border-b border-stone-100 flex items-center justify-between">
            <span>Customer Reviews</span>
            <span className="text-sm font-body text-stone-500 font-normal">({reviewsList.length} reviews)</span>
          </h2>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
            
            {/* Reviews List */}
            <div className="space-y-6">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="pb-6 border-b border-stone-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-body text-sm font-bold text-[#111111]">{rev.userName}</h4>
                      <span className="font-body text-[10px] text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={11}
                          fill={idx < rev.rating ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <p className="font-body text-stone-600 text-sm leading-relaxed font-light">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="italic font-body text-stone-500 text-sm">Be the first to review this product!</p>
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-[#FFF8F3] border border-[#FF6B00]/10 p-6 md:p-8 rounded-2xl">
              <h3 className="font-display text-xl text-[#111111] mb-4">Write a Review</h3>
              
              {reviewSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center font-body text-xs font-semibold">
                  Thank you! Your review has been submitted successfully.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block font-body text-[11px] font-bold text-stone-700 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full bg-white border border-stone-200 focus:border-[#FF6B00] px-3.5 py-2.5 rounded-xl font-body text-xs text-[#111111] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-body text-[11px] font-bold text-stone-700 uppercase tracking-wider">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setNewReviewRating(stars)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            size={20}
                            fill={stars <= newReviewRating ? "currentColor" : "none"}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-body text-[11px] font-bold text-stone-700 uppercase tracking-wider">Your Feedback</label>
                    <textarea
                      required
                      rows={4}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Describe your experience with the craftsmanship..."
                      className="w-full bg-white border border-stone-200 focus:border-[#FF6B00] px-3.5 py-2.5 rounded-xl font-body text-xs text-[#111111] outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#111111] text-white py-3 rounded-xl font-body text-xs font-bold uppercase tracking-wider hover:bg-[#FF6B00] transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* ── Related Products Carousel ── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <h2 className="font-display text-3xl text-center text-[#111111]">
              Related <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Masterpieces</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => {
                const primaryImage = p.images.find(img => img.isPrimary) || p.images[0];
                return (
                  <div
                    key={p.id}
                    className="group bg-white border border-[#FF6B00]/10 hover:shadow-[0_15px_40px_rgba(181,84,26,0.08)] hover:border-[#FF6B00]/30 transition-all duration-500 rounded-2xl flex flex-col overflow-hidden"
                  >
                    {/* Image box */}
                    <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden shrink-0">
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt}
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                      {p.subcategory && (
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#FF6B00]/10 text-[#FF6B00] px-2.5 py-1 text-[8px] font-bold tracking-[0.2em] uppercase rounded-md shadow-sm">
                          {p.subcategory}
                        </span>
                      )}
                    </div>

                    {/* Card Content details */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 font-body text-[10px] text-stone-500 uppercase tracking-widest">
                          <span>{p.region}</span>
                          {p.artisan && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-stone-300" />
                              <span>By {p.artisan.name}</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-display text-2xl text-[#111111] group-hover:text-[#FF6B00] transition-colors duration-300 mb-2 leading-tight">
                          <Link href={`/products/${p.slug}`}>
                            {p.name}
                          </Link>
                        </h3>
                        <p className="font-body text-[13px] text-stone-600 line-clamp-2 leading-relaxed mb-4">
                          {p.shortDescription}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#FF6B00]/10 flex items-center justify-between">
                        <span className="font-body text-base font-bold text-[#111111]">
                          {formatPrice(p.price)}
                        </span>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-body text-[10px] font-bold uppercase tracking-wider text-[#111111] border-b border-[#111111] pb-0.5 group-hover:text-[#FF6B00] group-hover:border-[#FF6B00] transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
