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

export default function Footer() {
  return (
    <footer style={{ background: "#E5C18D" }}>

      {/* ── Gold top border ── */}
      <div style={{ height: "2px", background: "#1A1410" }} />

      {/* ── Main 4-column grid ── */}
      <div className="max-w-[1400px] mx-auto px-10 lg:px-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1fr] gap-10 lg:gap-8">

          {/* ── Col 1: Brand identity ── */}
          <div>
            {/* Logo area */}
            <div className="mb-4">
              <Link href="/">
                <Image
                  src="/images/logo1.png"
                  alt={SITE_NAME}
                  width={160}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Brand tagline in small caps */}
            <p
              className="font-body text-[10px] tracking-[0.3em] text-[#1A1410] mb-4 uppercase font-bold"
            >
              {SITE_TAGLINE}
            </p>

            {/* Divider */}
            <div style={{ width: "32px", height: "2px", background: "#1A1410", marginBottom: "16px" }} />

            {/* Brand description */}
            <p className="font-body text-[13px] leading-[1.7] text-[#1A1410]/85 max-w-[220px] font-medium">
              India&apos;s handloom heritage, ethically made.
            </p>
          </div>

          {/* ── Col 2: Quick Links (2 sub-columns) ── */}
          <div>
            {/* Section heading — italic display like reference */}
            <h3 className="font-display text-[1.5rem] text-[#1A1410] mb-6 font-semibold mt-4">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Kauseyah", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Collections", href: "/collections" },
                { label: "Gallery", href: "/gallery" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-body text-[14px] text-[#1A1410]/80 hover:text-[#1A1410] transition-colors duration-200 font-medium"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Col 3: Reach Us ── */}
          <div>
            <h3 className="font-display text-[1.5rem] text-[#1A1410] mb-6 font-semibold mt-4">
              Reach Us
            </h3>

            <div className="space-y-4">
              {/* Hours */}
              <div>
                <p className="font-body text-[14px] leading-[1.7] text-[#1A1410]/85 font-medium">
                  Mon – Sat: 10:00 AM – 7:00 PM
                </p>
                <p
                  className="font-body text-[10px] tracking-[0.2em] uppercase font-bold mt-1"
                  style={{ color: "#1A1410" }}
                >
                  By Appointment Only
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1410" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-body text-[14px] text-[#1A1410]/85 hover:text-[#1A1410] transition-colors duration-200 font-medium"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1410" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="font-body text-[14px] text-[#1A1410]/85 hover:text-[#1A1410] transition-colors duration-200 font-medium"
                >
                  {CONTACT_PHONE}
                </a>
              </div>

              {/* Removed Newsletter inline as requested */}
            </div>
          </div>

          {/* ── Col 4: Follow Us ── */}
          <div>
            <h3 className="font-display text-[1.5rem] text-[#1A1410] mb-6 font-semibold mt-4">
              Follow Us
            </h3>

            {/* Social icon circles */}
            <div className="flex gap-3 mb-5">
              {Object.entries(SOCIAL_LINKS).filter(([p]) => p.toLowerCase() !== 'pinterest').map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  title={platform}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    border: "1.5px solid #1A1410",
                    color: "#1A1410",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#1A1410";
                    (e.currentTarget as HTMLElement).style.color = "#E5C18D";
                    (e.currentTarget as HTMLElement).style.borderColor = "#1A1410";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#1A1410";
                    (e.currentTarget as HTMLElement).style.borderColor = "#1A1410";
                  }}
                >
                  {SOCIAL_ICONS[platform.toLowerCase()] ?? (
                    <span className="text-[10px] uppercase font-semibold">{platform[0]}</span>
                  )}
                </a>
              ))}
            </div>

            <p className="font-body text-[13px] leading-[1.7] text-[#1A1410]/85 font-medium">
              Follow our journey of handloom heritage, artisan stories, and behind-the-scenes craft moments.
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(26,20,16,0.2)" }}>
        <div className="max-w-[1400px] mx-auto px-10 lg:px-20 py-3 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#1A1410]/70 font-medium">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-5 items-center">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-[11px] tracking-[0.1em] uppercase text-[#1A1410]/70 hover:text-[#1A1410] transition-colors duration-200 font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="font-body text-[11px] tracking-[0.12em] uppercase text-[#1A1410]/70 font-medium">
            Designed &amp; Developed by{" "}
            <Link 
              href="https://www.techsyntricinnovations.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1A1410] hover:text-[#6B2D0A] hover:underline underline-offset-2 transition-all duration-200"
            >
              Techsyntric Innovations
            </Link>
          </p>
        </div>
      </div>

    </footer>
  );
}
