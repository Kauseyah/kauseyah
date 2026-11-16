"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Palette,
  Send,
  Check,
  X,
  MessageCircle,
  ArrowRight,
  Plus,
  Minus,
  HelpCircle
} from "lucide-react";

export interface BespokeProduct {
  id: string;
  name: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  posterSrc?: string;
  badge: string;
  description: string;
  basePrice: number;
  priceDisplay?: string;
  dimensions?: string;
  sizes?: { label: string; price: number; isCustom?: boolean }[];
  isPreorder?: boolean;
  isCustomizationOnly?: boolean;
  customizationNote?: string;
  dimensionsNote?: string;
}

const BESPOKE_PRODUCTS: BespokeProduct[] = [
  {
    id: "bespoke-sabai-wall-plates",
    name: "Custom Sabai Wall Plates",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/sabai-wall-plates.png",
    badge: "Made to Order · Artisan Weave",
    description:
      "These custom sabai wall plates were crafted by my women’s for a client’s new home bringing together rich craftsmanship, vibrant elegance, and unique patterns that make every wall feel special🪷",
    basePrice: 920,
    sizes: [
      { label: '6"', price: 920 },
      { label: '8"', price: 1040 },
      { label: '10"', price: 1120 },
      { label: '12"', price: 1200 },
      { label: "Custom / Larger", price: 0, isCustom: true },
    ],
    customizationNote: "Custom sizes, color palettes and cluster compositions available on request.",
  },
  {
    id: "bespoke-sabai-resort-bags",
    name: "Sabai Grass Resort Bags",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/resor-bags.png",
    badge: "Taking Pre-Orders · Quiet Luxury",
    description:
      "Our new collection of resor bags woven by sabai grass are getting ready for gifting. Each piece is a quiet luxury, light, earthy, and designed for slow, meaningful escapes taking pre orders 🌻",
    basePrice: 1380,
    dimensions: '16" × 9" × 6"',
    isPreorder: true,
    customizationNote: "Made to order. Custom sizes and monogram tags available for gifting.",
  },
  {
    id: "bespoke-gond-art-cards",
    name: "Hand-Painted Gond Art Cards",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/Gond-art-cards.png",
    badge: "Tribal Folk Art · Handmade Paper",
    description:
      "Happy to have received an order from a beautiful sustainable resort for our hand painted Gond art cards on handmade paper :)\n\nGond art is a traditional tribal art form known for its intricate patterns and storytelling inspired by nature and folklore. These hand-painted cards make thoughtful gifts and can also be framed as beautiful wall decor.\n\nTo make them even more special, each piece carries the signature of the artisan who created it :) Customizations are possible too.",
    basePrice: 1555,
    dimensions: "A4 Size",
    customizationNote: "Carries the signature of the tribal artisan. Framing available on request (framing costs additional).",
  },
  {
    id: "bespoke-dhokra-fish-decor",
    name: "Dhokra Fish Decor",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/fish.png",
    badge: "Lost-Wax Brass Casting · Prosperity Symbol",
    description:
      "In many Indian traditions, the fish is considered a symbol of prosperity, abundance, and positive energy, making it a cherished element in home decor. Hand crafted by the artisans of Chhattisgarh using the ancient Dhokra art form, this handcrafted piece showcases intricate details and the timeless skill of tribal artisans. A beautiful blend of culture, craftsmanship, and meaning🪷",
    basePrice: 2588,
    dimensionsNote: "Client dimensions pending verification; omitted from customer card.",
    customizationNote: "Handcrafted using 4,000-year-old lost-wax casting in non-ferrous metal.",
  },
  {
    id: "bespoke-dhokra-peacock",
    name: "Dhokra Peacock",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/Peacock.png",
    badge: "Lost-Wax Craft · Heritage Statement",
    description:
      "We are creating custom decor pieces in Dhokra art. This handcrafted Peacock is made by artisans from Chhattisgarh using the ancient lost-wax casting technique, one of India's oldest metal craft traditions. Every piece is shaped by hand, making each one truly unique and full of character. A timeless symbol of beauty, grace, prosperity, and joy, this peacock makes a meaningful addition to your home or a thoughtful gift that celebrates India's rich craftsmanship.",
    basePrice: 4788,
    dimensions: "7–8 inches",
    customizationNote: "One-of-a-kind piece. Shapes and motifs can be tailored for bespoke wedding gifts.",
  },
  {
    id: "bespoke-dhokra-nandi",
    name: "Dhokra Nandi",
    mediaType: "video",
    mediaSrc: "/images/Bespoke-Gifts/Nandi.mp4",
    posterSrc: "/images/Bespoke-Gifts/nandi-poster.png",
    badge: "Lost-Wax Casting · Video Showcase",
    description:
      "We are making some custom decors in dhokra art. This Nandi in Dhokra, one of India's oldest metal craft traditions, handcrafted by artisans from Chhattisgarh using the ancient lost-wax casting technique. Every piece is shaped by hand, making it truly unique and rich in character. Nandi, a symbol of devotion, strength and protection, makes a thoughtful gifting addition that carries both craftsmanship and tradition.",
    basePrice: 4258,
    dimensions: "7–8 inches",
    customizationNote: "Shape, posture, and finish can be fully customized upon request.",
  },
  {
    id: "bespoke-kauna-clutches",
    name: "Personalised Kauna Grass Clutches",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/clutches.png",
    badge: "Hand-Embroidered Initials · Team Gifting",
    description:
      "Swati came to me with a beautiful idea gifting our Kauna grass clutches to her office team, each one personalised with their initials. Our women artisans hand embroidered every initial, adding tiny floral details to make each clutch feel truly their own.\n\nWe love seeing our pieces become part of someone’s story thoughtfully chosen, personally made, and meant to be remembered 🪷",
    basePrice: 972,
    priceDisplay: "₹972 (for customizations)",
    isCustomizationOnly: true,
    customizationNote: "Base product pricing & bulk monogram details confirmed upon enquiry.",
  },
  {
    id: "bespoke-sabai-decor",
    name: "Sabai Grass Handcrafted Decor",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/crafted.png",
    badge: "Traditional Weaving · Natural Dyes",
    description:
      "Here's this lovely piece in a beautiful traditional colour combination, crafted using a traditional Sabai grass weaving technique",
    basePrice: 745,
    dimensions: '8" × 3"',
    customizationNote: "Lightweight, durable, handcrafted with eco-conscious natural sabai fibers.",
  },
  {
    id: "bespoke-dhokra-pen-holders",
    name: "Dhokra Pen Holders",
    mediaType: "image",
    mediaSrc: "/images/Bespoke-Gifts/pen-holders.png",
    badge: "Taking Pre-Orders · Desk Artifact",
    description:
      "We've been making some really beautiful things in Dhokra lately. These intricate pen holders are thoughtfully designed to be useful, while still carrying the beauty of the lost wax technique.\n\nPerfect for gifting or adding a little character to your desk or home.",
    basePrice: 2885,
    dimensions: "Approx. 5 inches",
    isPreorder: true,
    customizationNote: "Lost-wax tribal brass. Ideal for corporate desktop gifting and celebration hampers.",
  },
];

export default function BespokeGiftsCatalogue() {
  // Size selection state for products with sizes (key: product.id)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({
    "bespoke-sabai-wall-plates": 0, // default to 6"
  });

  // Quantity state (key: product.id)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "bespoke-sabai-wall-plates": 1,
    "bespoke-sabai-resort-bags": 1,
    "bespoke-gond-art-cards": 1,
    "bespoke-dhokra-fish-decor": 1,
    "bespoke-dhokra-peacock": 1,
    "bespoke-dhokra-nandi": 1,
    "bespoke-kauna-clutches": 1,
    "bespoke-sabai-decor": 1,
    "bespoke-dhokra-pen-holders": 1,
  });

  // Video state for Nandi video
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enquiry / Preorder Drawer Modal
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<BespokeProduct | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    notes: "",
  });

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleOpenEnquiry = (product: BespokeProduct) => {
    setSelectedProductForEnquiry(product);
    setEnquirySuccess(false);
  };

  const getProductPrice = (product: BespokeProduct) => {
    if (product.sizes) {
      const idx = selectedSizes[product.id] ?? 0;
      const sizeObj = product.sizes[idx];
      return sizeObj.isCustom ? 0 : sizeObj.price;
    }
    return product.basePrice;
  };

  const isCustomSizeSelected = (product: BespokeProduct) => {
    if (!product.sizes) return false;
    const idx = selectedSizes[product.id] ?? 0;
    return Boolean(product.sizes[idx]?.isCustom);
  };

  return (
    <div className="mt-12 sm:mt-16 pt-8">
      {/* Editorial Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 border-b border-[#1A1412]/10 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D95D1E] block mb-1">
            Artisanal Curations · Limited Batches
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-[#1A1412] font-semibold">
            Bespoke Keepsakes &amp; Custom Treasures
          </h3>
        </div>
        <p className="font-body text-xs sm:text-sm text-[#665D59] max-w-md">
          Each piece is shaped by hand across tribal clusters in India. Made to order, customizable for family milestones, weddings and thoughtful corporate curations.
        </p>
      </div>

      {/* 9-Product Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {BESPOKE_PRODUCTS.map((product) => {
          const qty = quantities[product.id] || 1;
          const currentPrice = getProductPrice(product);
          const isCustomSize = isCustomSizeSelected(product);
          const totalAmount = currentPrice * qty;

          return (
            <article
              key={product.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#1A1412]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF4ED]">
                {product.mediaType === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={product.mediaSrc}
                      poster={product.posterSrc}
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                    {/* Accessible Video Controls */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                      <button
                        type="button"
                        onClick={toggleVideo}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="translate-x-[1px]" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                        className="w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={product.mediaSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Cultural Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#851A36] text-[10px] font-bold uppercase tracking-wider shadow-sm border border-[#851A36]/15">
                    <Sparkles size={11} className="text-[#D95D1E]" />
                    <span>{product.badge}</span>
                  </span>
                </div>

                {/* Preorder / Made to Order Tag */}
                {product.isPreorder && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D95D1E] text-white text-[9.5px] font-bold uppercase tracking-wider shadow-md">
                      <Clock size={10} />
                      <span>Pre-Order</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info & Editorial Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-display text-xl sm:text-2xl text-[#1A1412] font-semibold leading-tight">
                      {product.name}
                    </h4>

                    {/* Dimensions Pill if available */}
                    {product.dimensions && (
                      <span className="shrink-0 px-2 py-0.5 rounded bg-[#FAF4ED] text-[#665D59] text-[11px] font-mono border border-[#1A1412]/8">
                        {product.dimensions}
                      </span>
                    )}
                  </div>

                  {/* Client-Supplied Description */}
                  <p className="font-body text-xs sm:text-[13px] text-[#665D59] font-light leading-relaxed mb-5 whitespace-pre-line">
                    {product.description}
                  </p>

                  {/* Size Selector for Sabai Wall Plates */}
                  {product.sizes && (
                    <div className="mb-5 p-3 rounded-xl bg-[#FAF4ED]/70 border border-[#1A1412]/8">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1412] mb-2">
                        Select Diameter / Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((sz, idx) => {
                          const isSelected = (selectedSizes[product.id] ?? 0) === idx;
                          return (
                            <button
                              key={sz.label}
                              type="button"
                              onClick={() =>
                                setSelectedSizes((prev) => ({ ...prev, [product.id]: idx }))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isSelected
                                  ? "bg-[#851A36] text-white font-semibold shadow-sm"
                                  : "bg-white text-[#1A1412] border border-[#1A1412]/15 hover:border-[#851A36]"
                              }`}
                            >
                              <span>{sz.label}</span>
                              {!sz.isCustom && <span className="ml-1 opacity-80">₹{sz.price}</span>}
                            </button>
                          );
                        })}
                      </div>
                      {isCustomSize && (
                        <p className="text-[11px] text-[#D95D1E] mt-2 italic">
                          Custom size selected. We will tailor dimensions &amp; motif to your wall.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Customization Details Note */}
                  {product.customizationNote && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#8C827A] mb-4">
                      <Palette size={13} className="shrink-0 mt-0.5 text-[#D95D1E]" />
                      <span>{product.customizationNote}</span>
                    </div>
                  )}
                </div>

                {/* Footer Bar: Quantity, Live Price & Action */}
                <div className="pt-4 border-t border-[#1A1412]/10 mt-auto">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Price Presentation */}
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">
                        {product.isCustomizationOnly
                          ? "Personalisation"
                          : isCustomSize
                          ? "Custom Pricing"
                          : qty > 1
                          ? `Price (${qty} units)`
                          : "Price"}
                      </span>
                      <div className="font-display text-xl sm:text-2xl font-bold text-[#1A1412]">
                        {product.priceDisplay ? (
                          <span className="text-base sm:text-lg text-[#851A36]">{product.priceDisplay}</span>
                        ) : isCustomSize ? (
                          <span className="text-base text-[#D95D1E] italic">Upon Enquiry</span>
                        ) : (
                          <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Counter */}
                    {!isCustomSize && (
                      <div className="flex items-center border border-[#1A1412]/15 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty <= 1}
                          className="px-2.5 py-1.5 text-[#1A1412] hover:bg-[#FAF4ED] disabled:opacity-30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#1A1412] min-w-[20px] text-center font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="px-2.5 py-1.5 text-[#1A1412] hover:bg-[#FAF4ED] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Primary Action Button */}
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(product)}
                      className={`w-full py-3 px-4 rounded-xl font-body text-xs font-bold uppercase tracking-[0.16em] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                        product.isCustomizationOnly || isCustomSize
                          ? "bg-[#851A36] hover:bg-[#6e132b] text-white"
                          : "bg-[#1A1412] hover:bg-[#D95D1E] text-white"
                      }`}
                    >
                      <span>
                        {product.isCustomizationOnly
                          ? "Personalisation Enquiry"
                          : isCustomSize
                          ? "Custom Order Enquiry"
                          : product.isPreorder
                          ? "Pre-Order & Enquire"
                          : "Reserve Bespoke Piece"}
                      </span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Bespoke Concierge / Preorder Modal ── */}
      {selectedProductForEnquiry && (
        <div className="fixed inset-0 z-50 bg-[#1A1412]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#EADDCF] shadow-2xl p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProductForEnquiry(null)}
              className="absolute top-5 right-5 text-[#8C827A] hover:text-[#1A1412] p-1.5 rounded-full hover:bg-[#FAF4ED] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D95D1E] block mb-1">
                Bespoke Gifting Concierge
              </span>
              <h3 className="font-display text-2xl text-[#1A1412] font-semibold">
                {selectedProductForEnquiry.name}
              </h3>
              <p className="text-xs text-[#665D59] mt-1 font-body">
                Share your customization details, team quantity, or milestone celebration date.
              </p>
            </div>

            {/* Product Summary Box */}
            <div className="p-4 rounded-xl bg-[#FAF4ED] border border-[#1A1412]/8 mb-6 flex items-center gap-4 text-xs">
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#1A1412]/10 bg-white">
                <Image
                  src={
                    selectedProductForEnquiry.mediaType === "video"
                      ? selectedProductForEnquiry.posterSrc || "/images/Bespoke-Gifts/nandi-poster.png"
                      : selectedProductForEnquiry.mediaSrc
                  }
                  alt={selectedProductForEnquiry.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[#1A1412] block truncate">
                  {selectedProductForEnquiry.name}
                </span>
                {selectedProductForEnquiry.sizes && (
                  <span className="text-[#665D59] block">
                    Size: {selectedProductForEnquiry.sizes[selectedSizes[selectedProductForEnquiry.id] ?? 0]?.label}
                  </span>
                )}
                <span className="text-[#851A36] font-bold font-mono">
                  Qty: {quantities[selectedProductForEnquiry.id] || 1}
                  {selectedProductForEnquiry.priceDisplay ? (
                    ` · ${selectedProductForEnquiry.priceDisplay}`
                  ) : !isCustomSizeSelected(selectedProductForEnquiry) ? (
                    ` · Est. ₹${(getProductPrice(selectedProductForEnquiry) * (quantities[selectedProductForEnquiry.id] || 1)).toLocaleString("en-IN")}`
                  ) : (
                    " · Custom Quote"
                  )}
                </span>
              </div>
            </div>

            {enquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <Check size={24} />
                </div>
                <h4 className="font-display text-xl text-[#1A1412]">Enquiry Received</h4>
                <p className="text-xs text-[#665D59] max-w-xs mx-auto leading-relaxed">
                  Thank you! Our bespoke team will get in touch with you shortly to finalize details, artisan timeline, and delivery.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedProductForEnquiry(null)}
                  className="mt-4 px-6 py-2 rounded-full bg-[#1A1412] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEnquirySuccess(true);
                }}
                className="space-y-3.5 text-left font-body text-xs"
              >
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#665D59] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    placeholder="Swati Sharma"
                    className="w-full bg-[#FFF9F4] border border-[#E0D5C7] focus:border-[#851A36] px-3.5 py-2.5 rounded-lg outline-none text-[#1A1412]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#665D59] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FFF9F4] border border-[#E0D5C7] focus:border-[#851A36] px-3.5 py-2.5 rounded-lg outline-none text-[#1A1412]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#665D59] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="swati@example.com"
                      className="w-full bg-[#FFF9F4] border border-[#E0D5C7] focus:border-[#851A36] px-3.5 py-2.5 rounded-lg outline-none text-[#1A1412]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#665D59] mb-1">
                    Delivery City / State
                  </label>
                  <input
                    type="text"
                    value={enquiryForm.city}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                    placeholder="Bangalore, Karnataka"
                    className="w-full bg-[#FFF9F4] border border-[#E0D5C7] focus:border-[#851A36] px-3.5 py-2.5 rounded-lg outline-none text-[#1A1412]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#665D59] mb-1">
                    Customization Notes (Initials, Event Date, Milestone)
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryForm.notes}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                    placeholder="Personalized initials on clutch, required by 25th of next month for our team celebration..."
                    className="w-full bg-[#FFF9F4] border border-[#E0D5C7] focus:border-[#851A36] p-3 rounded-lg outline-none text-[#1A1412]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#851A36] hover:bg-[#6e132b] text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={13} />
                    <span>Send Concierge Request</span>
                  </button>

                  {/* 1-Click WhatsApp Concierge */}
                  <a
                    href={`https://wa.me/919971031383?text=${encodeURIComponent(
                      `Hello Kauseyah, I would like to enquire about the bespoke item: ${selectedProductForEnquiry.name} (Qty: ${
                        quantities[selectedProductForEnquiry.id] || 1
                      }${
                        selectedProductForEnquiry.sizes
                          ? `, Size: ${selectedProductForEnquiry.sizes[selectedSizes[selectedProductForEnquiry.id] ?? 0]?.label}`
                          : ""
                      }).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
