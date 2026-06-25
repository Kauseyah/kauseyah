"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME, SITE_TAGLINE, CATEGORIES, SOCIAL_LINKS, CONTACT_EMAIL } from "@/constants";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
];

const SOCIAL_ICONS: Record<string, JSX.Element> = {
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
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <footer style={{ background: "#120D09" }}>

      {/* ── Gold top border ── */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C8892A 25%, #C8892A 75%, transparent)" }} />

      {/* ── Main 4-column grid ── */}
      <div className="max-w-[1400px] mx-auto px-10 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1fr] gap-10 lg:gap-8">

          {/* ── Col 1: Brand identity ── */}
          <div>
            {/* Logo area */}
            <div className="flex items-center gap-2 mb-4">
              {/* Woven diamond mark */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2 L26 14 L14 26 L2 14 Z" stroke="#C8892A" strokeWidth="1.2" fill="none"/>
                <path d="M14 7 L21 14 L14 21 L7 14 Z" stroke="#C8892A" strokeWidth="0.8" fill="rgba(200,137,42,0.1)"/>
                <circle cx="14" cy="14" r="2" fill="#C8892A"/>
              </svg>
              <p className="font-display text-2xl text-[#E7D6B8] tracking-wide">{SITE_NAME}</p>
            </div>

            {/* Brand tagline in small caps */}
            <p
              className="font-body text-[9px] tracking-[0.35em] text-[#C8892A] mb-4 uppercase font-semibold"
            >
              {SITE_TAGLINE}
            </p>

            {/* Divider */}
            <div style={{ width: "28px", height: "1px", background: "#C8892A", marginBottom: "14px" }} />

            {/* Brand description */}
            <p className="font-body text-[12.5px] leading-[1.85] text-white/45 max-w-[220px]">
              India's living textile heritage, brought directly from artisan hands to yours — uncompromised, authentic, and ethically made.
            </p>
          </div>

          {/* ── Col 2: Quick Links (2 sub-columns) ── */}
          <div>
            {/* Section heading — italic display like reference */}
            <h3 className="font-display text-[1.35rem] italic text-[#C8892A] mb-5 font-light">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Collections", href: "/collections" },
                { label: "Artisans", href: "/about#artisans" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-body text-[13px] text-white/60 hover:text-[#E7D6B8] transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Col 3: Reach Us ── */}
          <div>
            <h3 className="font-display text-[1.35rem] italic text-[#C8892A] mb-5 font-light">
              Reach Us
            </h3>

            <div className="space-y-4">
              {/* Hours */}
              <div>
                <p className="font-body text-[12.5px] leading-[1.8] text-white/60">
                  Mon – Sat: 10:00 AM – 7:00 PM
                </p>
                <p
                  className="font-body text-[9px] tracking-[0.25em] uppercase font-semibold mt-1"
                  style={{ color: "#C8892A" }}
                >
                  By Appointment Only
                </p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8892A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-body text-[12.5px] text-white/60 hover:text-[#C8892A] transition-colors duration-200"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Removed Newsletter inline as requested */}
            </div>
          </div>

          {/* ── Col 4: Follow Us ── */}
          <div>
            <h3 className="font-display text-[1.35rem] italic text-[#C8892A] mb-5 font-light">
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
                    border: "1px solid rgba(200,137,42,0.35)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#C8892A";
                    (e.currentTarget as HTMLElement).style.color = "#120D09";
                    (e.currentTarget as HTMLElement).style.borderColor = "#C8892A";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,137,42,0.35)";
                  }}
                >
                  {SOCIAL_ICONS[platform.toLowerCase()] ?? (
                    <span className="text-[10px] uppercase font-semibold">{platform[0]}</span>
                  )}
                </a>
              ))}
            </div>

            <p className="font-body text-[12.5px] leading-[1.85] text-white/45">
              Follow our journey of handloom heritage, artisan stories, and behind-the-scenes craft moments.
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(200,137,42,0.1)" }}>
        <div className="max-w-[1400px] mx-auto px-10 lg:px-20 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-body text-[10px] tracking-[0.18em] uppercase text-white/25">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-5 items-center">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-[10px] tracking-[0.12em] uppercase text-white/25 hover:text-[#C8892A] transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-white/25">
            Designed &amp; Developed by{" "}
            <span style={{ color: "#C8892A" }}>Techsyntric Innovations</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
