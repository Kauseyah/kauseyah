"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactElement } from "react";
import { SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS, CONTACT_EMAIL, CONTACT_PHONE } from "@/constants";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
];

const SOCIAL_ICONS: Record<string, ReactElement> = {
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  pinterest: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.563 0-2.386-1.716-4.054-4.165-4.054-2.838 0-4.502 2.129-4.502 4.33 0 .857.33 1.776.741 2.279a.3.3 0 0 1 .069.285c-.076.315-.244.995-.277 1.134-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.477 10-10S17.522 2 12 2z" />
    </svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
};

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-[#111111] text-white font-body overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20" style={{ height: "2px", background: "#FF6B00" }} />
      {/* Subtle weave pattern background (using SVG to prevent Android GPU crash) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0,0 h40 M0,0 v40' stroke='%23FF6B00' stroke-opacity='0.15' stroke-width='1' /%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px"
        }}
      />
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-10 lg:px-20 pt-8 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1fr] gap-8 lg:gap-10 items-start text-center lg:text-left">

          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-3">
              <Link href="/">
                <Image
                  src="/images/logo1.png"
                  alt={SITE_NAME}
                  width={180}
                  height={70}
                  className="object-contain"
                />
              </Link>
            </div>

            <p className="font-body text-[9px] tracking-[0.2em] text-[#FF6B00] mb-2 uppercase font-bold">
              {SITE_TAGLINE}
            </p>

            <p className="font-body text-[12px] leading-[1.6] text-[#FFFFFF]/80 max-w-[220px] font-light">
              India&apos;s handloom heritage, ethically made. Every thread preserves a story.
            </p>
          </div>

          <div className="pt-10 flex flex-col items-center lg:items-start">
            <h3 className="font-display text-[1rem] text-[#FFFFFF] mb-4 font-medium tracking-wide">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                { label: "About Us", href: "/about" },
                { label: "Collections", href: "/collections" },
                { label: "Portfolio" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ" },
                { label: "Blog", href: "/blog" },
              ].map((l) => (
                l.href ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="font-body text-[15px] text-[#FFFFFF]/70 hover:text-[#FF6B00] transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <span
                    key={l.label}
                    className="font-body text-[15px] text-[#FFFFFF]/70"
                  >
                    {l.label}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className="pt-10 flex flex-col items-center lg:items-start">
            <h3 className="font-display text-[1rem] text-[#FFFFFF] mb-4 font-medium tracking-wide">
              Reach Us
            </h3>

            <div className="space-y-3">
              <div>
                <p className="font-body text-[14px] leading-[1.7] text-[#FFFFFF]/80">
                  Mon – Sat: 10:00 AM – 7:00 PM
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#FF6B00]">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-body text-[14px] text-[#FFFFFF]/80 hover:text-[#FF6B00] transition-colors duration-200"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#FF6B00]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="font-body text-[14px] text-[#FFFFFF]/80 hover:text-[#FF6B00] transition-colors duration-200"
                >
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col items-center lg:items-start">
            <h3 className="font-display text-[1rem] text-[#FFFFFF] mb-4 font-medium tracking-wide">
              Follow Us
            </h3>

            <div className="flex gap-3 mb-3">
              {Object.entries(SOCIAL_LINKS).filter(([p]) => p.toLowerCase() !== "pinterest").map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  title={platform}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#FF6B00]/20 text-white/70 hover:bg-[#FF6B00] hover:border-[#FF6B00] hover:text-white transition-all duration-300"
                >
                  {SOCIAL_ICONS[platform.toLowerCase()] ?? (
                    <span className="text-[10px] uppercase font-semibold">{platform[0]}</span>
                  )}
                </a>
              ))}
            </div>

            <p className="font-body text-[14px] leading-[1.8] text-[#FFFFFF]/60 font-light">
              Follow our journey of heritage and artisan stories.
            </p>
          </div>

        </div>
      </div>

      <div className="mt-8 lg:mt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="max-w-[1400px] mx-auto px-10 lg:px-20 py-4 flex flex-col items-center gap-3 text-center">
          <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#FFFFFF]/40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-[11px] tracking-[0.1em] uppercase text-[#FFFFFF]/40 hover:text-[#FF6B00] transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="font-body text-[11px] tracking-[0.12em] uppercase text-[#FFFFFF]/40">
            Designed &amp; Developed by{" "}
            <Link
              href="https://www.techsyntricinnovations.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFFFFF]/60 hover:text-[#FF6B00] transition-all duration-200"
            >
              Techsyntric Innovations
            </Link>
          </p>
        </div>
      </div>

    </footer>
  );
}

