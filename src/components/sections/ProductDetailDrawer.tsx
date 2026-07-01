/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatPrice } from "@/utils";
import { useCart } from "@/store/CartContext";
import { Star, ShoppingBag, Heart, X, ShieldCheck, Truck, RotateCcw, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetailDrawerProps {
  product: any;
  onClose: () => void;
}

export default function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
  const { addItem } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.variants[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(product.variants[0]?.color || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  // Review states
  const [reviewsList] = useState<Review[]>(product.reviews || []);

  // Quick Order states
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);

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
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedVariant);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Handle Quick Order Submission
  const handleQuickOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) return;

    setOrderSubmitted(true);
    setOrderName("");
    setOrderPhone("");
    setOrderAddress("");
    setTimeout(() => setOrderSubmitted(false), 5000);
  };

  // Colors and sizes arrays
  const uniqueSizes = useMemo(() => {
    const sizes = product.variants.map((v: any) => v.size).filter(Boolean);
    return Array.from(new Set(sizes)) as string[];
  }, [product]);

  const uniqueColors = useMemo(() => {
    const colors = product.variants.map((v: any) => ({ name: v.color, hex: v.colorHex })).filter((c: any) => c.name);
    const seen = new Set();
    return colors.filter((c: any) => {
      const duplicate = seen.has(c.name);
      seen.add(c.name);
      return !duplicate;
    });
  }, [product]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black cursor-pointer"
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 220 }}
        className="fixed inset-y-0 right-0 z-[110] w-full max-w-[620px] bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FFF8F3]">
          <div>
            <span className="font-body text-[9px] uppercase tracking-widest text-[#FF6B00] font-bold">
              {product.subcategory || product.category}
            </span>
            <h2 className="font-display text-xl md:text-2xl text-[#111111] line-clamp-1 mt-0.5">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500 hover:text-[#FF6B00] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/2] bg-stone-50 overflow-hidden rounded-2xl border border-stone-100">
              <Image
                src={product.images[activeImageIdx]?.url || product.images[0].url}
                alt={product.images[activeImageIdx]?.alt || product.name}
                fill
                className="object-cover"
                sizes="550px"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 aspect-[3/2] rounded-md overflow-hidden border bg-stone-50 shrink-0 cursor-pointer ${
                      activeImageIdx === idx ? "border-[#FF6B00] ring-1 ring-[#FF6B00]/35" : "border-stone-200"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Ratings */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="font-body text-2xl font-bold text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="font-body text-sm text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      fill={idx < Math.floor(averageRating) ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="font-body text-[11px] font-semibold text-stone-700 mt-0.5">
                  {averageRating.toFixed(1)}
                </span>
                <span className="font-body text-[10px] text-stone-400 mt-0.5">
                  ({reviewsList.length})
                </span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <p className="font-body text-stone-700 text-sm leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Sizing & Colors */}
          <div className="space-y-4">
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <span className="block font-body text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Color: <span className="text-[#FF6B00]">{selectedColor}</span>
                </span>
                <div className="flex gap-2.5">
                  {uniqueColors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ backgroundColor: color.hex || "#FFF" }}
                      className={`w-7 h-7 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        selectedColor === color.name ? "ring-2 ring-[#FF6B00] scale-105" : "border-stone-300"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {uniqueSizes.length > 0 && (
              <div className="space-y-2">
                <span className="block font-body text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Size: <span className="text-[#FF6B00]">{selectedSize}</span>
                </span>
                <div className="flex gap-2">
                  {uniqueSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-lg font-body text-xs font-bold flex items-center justify-center border cursor-pointer transition-all ${
                        selectedSize === size 
                          ? "bg-[#111111] text-white border-#111111 shadow-sm" 
                          : "bg-white border-stone-200 text-stone-600 hover:border-[#FF6B00]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-stone-200 rounded-xl bg-white p-0.5 shrink-0">
              <button
                onClick={() => handleQtyChange(-1)}
                className="w-8 h-8 font-body font-bold flex items-center justify-center hover:bg-stone-50 rounded-lg cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-body text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => handleQtyChange(1)}
                className="w-8 h-8 font-body font-bold flex items-center justify-center hover:bg-stone-50 rounded-lg cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl font-body text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                addedToCart
                  ? "bg-emerald-600 text-white"
                  : "bg-[#111111] text-white hover:bg-[#FF6B00]"
              }`}
            >
              <ShoppingBag size={13} />
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>

            <button
              onClick={() => setWishlistAdded(!wishlistAdded)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center border cursor-pointer transition-colors ${
                wishlistAdded ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-stone-200 text-stone-400 hover:text-red-500"
              }`}
            >
              <Heart size={16} fill={wishlistAdded ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Spec Tabs */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex border-b border-stone-200 gap-5 font-body text-xs font-bold uppercase tracking-wider mb-5">
              {["description", "materials", "artisan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 cursor-pointer relative transition-colors ${
                    activeTab === tab ? "text-[#FF6B00] font-extrabold" : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00]" />
                  )}
                </button>
              ))}
            </div>

            <div className="font-body text-stone-800 leading-relaxed text-sm space-y-3.5">
              {activeTab === "description" && (
                <>
                  <p className="text-stone-700">{product.description}</p>
                  <p className="text-stone-800"><strong>Region:</strong> {product.region || "Various rural artisan clusters"}</p>
                </>
              )}
              {activeTab === "materials" && (
                <>
                  <p className="text-stone-700"><strong>Composition:</strong> {product.material || "Organic materials sourced ethically."}</p>
                  <p className="text-stone-700"><strong>Care:</strong> {product.careInstructions || "Dry clean only or delicate wash inside out."}</p>
                </>
              )}
              {activeTab === "artisan" && (
                <div className="flex gap-4 items-start pt-1">
                  {product.artisan ? (
                    <>
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#FF6B00]/10">
                        <Image
                          src={product.artisan.avatar}
                          alt={product.artisan.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display text-sm font-semibold text-[#111111]">{product.artisan.name}</h4>
                        <p className="text-[#FF6B00] font-bold text-[9px] uppercase tracking-widest">{product.artisan.craft}</p>
                        <p className="text-stone-600 font-normal text-[11px] leading-relaxed">{product.artisan.bio}</p>
                      </div>
                    </>
                  ) : (
                    <p className="italic text-stone-500">Handcrafted by indigenous self-help weaving and casting groups.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 text-center font-body text-[10px] font-extrabold text-stone-700 uppercase tracking-widest">
            <div className="flex flex-col items-center gap-2 p-3 bg-stone-100 border border-stone-200/80 rounded-xl">
              <ShieldCheck size={16} className="text-[#FF6B00]" />
              <span>Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-stone-100 border border-stone-200/80 rounded-xl">
              <Truck size={16} className="text-[#FF6B00]" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-stone-100 border border-stone-200/80 rounded-xl">
              <RotateCcw size={16} className="text-[#FF6B00]" />
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Reviews List & Form */}
          <div className="border-t border-stone-100 pt-6 space-y-6">
            <h3 className="font-display text-lg text-[#111111] flex justify-between items-center">
              <span>Customer Reviews</span>
              <span className="text-xs text-stone-400">({reviewsList.length})</span>
            </h3>

            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="pb-4 border-b border-stone-50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-xs font-bold text-[#111111]">{rev.userName}</span>
                    <span className="font-body text-xs text-stone-500">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={10}
                        fill={idx < rev.rating ? "currentColor" : "none"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <p className="font-body text-stone-700 text-[13px] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Instant Order Form in Drawer */}
            <div className="bg-[#FAF0E6] border border-[#FF6B00]/30 p-6 rounded-2xl space-y-4 text-[#111111] shadow-[0_4px_20px_rgba(181,84,26,0.03)]">
              <h4 className="font-display text-lg text-[#111111] font-bold">Instant Order</h4>
              <p className="font-body text-stone-700 text-xs leading-relaxed">
                Fill in your details below to place a quick order for this masterpiece.
              </p>
              {orderSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Check size={28} strokeWidth={3} />
                  </div>
                  <h5 className="font-display text-base font-bold text-emerald-900">Order Placed Successfully!</h5>
                  <p className="font-body text-[11px] text-emerald-700 max-w-[200px]">
                    Our team will contact you shortly to confirm your delivery details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleQuickOrderSubmit} className="space-y-4 font-body text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-[#FF6B00] font-extrabold uppercase tracking-widest text-[11px]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full bg-white border border-stone-400 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-colors placeholder-stone-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[#FF6B00] font-extrabold uppercase tracking-widest text-[11px]">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={orderPhone}
                      onChange={(e) => setOrderPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white border border-stone-400 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-colors placeholder-stone-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[#FF6B00] font-extrabold uppercase tracking-widest text-[11px]">Shipping Address</label>
                    <textarea
                      required
                      rows={3}
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      placeholder="Enter your complete delivery address with pincode..."
                      className="w-full bg-white border border-stone-400 focus:border-[#FF6B00] px-4 py-3 rounded-xl text-stone-900 text-sm outline-none transition-colors resize-none placeholder-stone-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer"
                  >
                    Instant Order
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </motion.div>
    </>
  );
}
