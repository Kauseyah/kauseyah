"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, ArrowRight, Video, Sparkles } from "lucide-react";

export interface ArtisanReel {
  id: string;
  title: string;
  caption: string;
  craft: string;
  videoSrc: string;
}

const DEFAULT_REELS: ArtisanReel[] = [
  {
    id: "reel-1",
    title: "Rhythm of the Loom",
    caption: "The steady beat of the flying shuttle crossing warp and weft in rural weaving workshops.",
    craft: "Pit-Loom Weaving",
    videoSrc: "/videos/reel1.mp4",
  },
  {
    id: "reel-2",
    title: "Wild Silk Spinning",
    caption: "Patient hands drawing luminous Kosa yarn from wild forest cocoons of Chhattisgarh.",
    craft: "Yarn Spinning",
    videoSrc: "/videos/reel2.mp4",
  },
  {
    id: "reel-3",
    title: "Woodblock Imprint",
    caption: "Carved teakwood blocks hand-pressed in rhythmic unison with natural mineral pigments.",
    craft: "Block Printing",
    videoSrc: "/videos/reel3.mp4",
  },
  {
    id: "reel-4",
    title: "Sacred Motifs",
    caption: "Generations of tribal memory preserved in geometric borders and temple motifs.",
    craft: "Tribal Weaves",
    videoSrc: "/videos/reel4.mp4",
  },
];

interface BehindTheLoomProps {
  reels?: ArtisanReel[];
}

function ReelCard({ reel }: { reel: ArtisanReel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        onClick={togglePlay}
        className="group relative w-full aspect-[9/15] rounded-2xl overflow-hidden bg-[#1A1412] shadow-sm border border-[#1A1412]/10 cursor-pointer"
      >
        <video
          ref={videoRef}
          src={reel.videoSrc}
          loop
          muted
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412]/90 via-[#1A1412]/25 to-transparent pointer-events-none" />

        {/* Center Play/Pause button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100 scale-90" : "opacity-100 scale-100 shadow-lg"
          }`}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-[1px]" />}
          </div>
        </div>

        {/* Craft Tag */}
        <div className="absolute top-3 left-3 bg-[#1A1412]/75 backdrop-blur-md text-[#D4A359] border border-[#D4A359]/30 px-2.5 py-0.5 rounded-full text-[10px] font-body tracking-[0.16em] uppercase font-semibold">
          {reel.craft}
        </div>

        {/* Bottom Details */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 pointer-events-none">
          <h3 className="font-display text-base sm:text-lg text-white tracking-tight mb-0.5 font-semibold">
            {reel.title}
          </h3>
          <p className="font-body text-[11px] text-white/80 line-clamp-2 leading-relaxed font-light">
            {reel.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BehindTheLoom({ reels = DEFAULT_REELS }: BehindTheLoomProps) {
  return (
    <section 
      aria-label="Artisan Stories and Craft in Motion"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#FFF9F4] border-b border-[#1A1412]/8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D95D1E]/20 text-[#D95D1E] mb-3 shadow-sm">
              <Sparkles size={11} className="text-[#D95D1E]" />
              <span className="font-body text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                Living Traditions · Grassroots Craft
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1A1412] leading-[1.08] tracking-tight">
              The Hands Behind <span className="text-[#851A36] italic font-light">Every Thread</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#D95D1E] mt-3 mb-3" />
            
            <p className="font-body text-sm sm:text-base text-[#665D59] font-light leading-relaxed">
              Behind every weave, stitch, and handcrafted detail are traditions and skills carried forward through generations. Step inside the rural workshops of Chhattisgarh, where craft is an enduring rhythm of life.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412] hover:text-[#D95D1E] transition-colors self-start md:self-end border-b border-[#1A1412]/20 pb-1"
          >
            <span>Discover Our Story</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* ── Editorial Feature Split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          
          {/* Left: Prominent Real Artisan Photograph */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#1A1412]/10 shadow-md">
              <Image
                src="/images/artesian/image12.jpg"
                alt="Women master weavers smiling inside their handloom workshop in Chhattisgarh"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-bold tracking-[0.16em] mb-2 border border-white/30">
                  Weaving Workshop · Bastar Cluster
                </span>
                <p className="font-display text-lg sm:text-2xl font-light italic leading-snug">
                  &ldquo;A loom is more than wood and cord — it is a sanctuary of shared songs, generational memory, and quiet dignity.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right: Craft Narrative & Supporting Craft Detail */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-[#1A1412]/8">
              <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#D95D1E] block mb-2">
                Honoring The Craft
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-[#1A1412] font-semibold mb-3">
                Women-Led Cooperatives & Pit-Loom Weaving
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#665D59] font-light leading-relaxed mb-4">
                Kauseyah works directly with rural artisans across Chhattisgarh, preserving ancient pit-loom techniques, wild tussar cocoon boiling, and indigenous block carving. No middlemen, no industrial shortcuts — only fair, dignified creative partnerships.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1A1412]/8">
                <div>
                  <span className="block font-display text-lg text-[#1A1412] font-bold">100% Pit-Loom</span>
                  <span className="block font-body text-[10px] text-[#665D59] uppercase tracking-wider">Hand-Operated</span>
                </div>
                <div>
                  <span className="block font-display text-lg text-[#851A36] font-bold">Zero-Waste</span>
                  <span className="block font-body text-[10px] text-[#665D59] uppercase tracking-wider">Upcycled Remnants</span>
                </div>
              </div>
            </div>

            {/* Supporting Detail Card */}
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-[#1A1412]/8 shadow-sm">
              <Image
                src="/images/artesian/image2.jpg"
                alt="Artisan weaving bright red geometric ikat on a floor loom"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                <div className="text-white max-w-xs">
                  <span className="font-body text-[10px] uppercase font-bold tracking-[0.16em] text-[#D4A359] block mb-1">
                    Detail in Practice
                  </span>
                  <h4 className="font-display text-base sm:text-lg font-normal leading-snug">
                    Hand-guided shuttle weaving vivid red ikat yarn.
                  </h4>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ── 4-Reel Motion Row (Living Motion) ── */}
        <div className="pt-8 border-t border-[#1A1412]/8">
          <div className="flex items-center gap-2 mb-6">
            <Video size={14} className="text-[#D95D1E]" />
            <span className="font-body text-xs font-bold uppercase tracking-[0.18em] text-[#1A1412]">
              Living Motion · Stories From The Loom
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}