"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, User, MessageSquare } from "lucide-react";
import {
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  SOCIAL_LINKS,
  CONTACT_HERO,
} from "@/constants";

const SOCIAL_ICONS = {
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const inputClass =
  "w-full rounded-xl border border-[#E8E0D4] bg-white pl-11 pr-4 py-3.5 font-body text-[15px] text-[#0D0603] placeholder:text-[#2C1810]/40 focus:border-[#C8892A] focus:outline-none focus:ring-2 focus:ring-[#C8892A]/15 transition-all duration-200";

const textareaClass =
  "w-full rounded-xl border border-[#E8E0D4] bg-white pl-11 pr-4 pt-3.5 pb-3.5 font-body text-[15px] text-[#0D0603] placeholder:text-[#2C1810]/40 focus:border-[#C8892A] focus:outline-none focus:ring-2 focus:ring-[#C8892A]/15 transition-all duration-200 min-h-[100px] resize-y";

const labelClass =
  "block font-body text-[11px] font-semibold tracking-[0.14em] uppercase text-[#6B3A2A] mb-2.5";

function FormField({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B3A2A]/65 transition-colors duration-200 group-focus-within:text-[#6B2D0A]"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}

function MessageField() {
  return (
    <div className="group">
      <label htmlFor="message" className={labelClass}>
        Message
      </label>
      <div className="relative">
        <MessageSquare
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute left-4 top-4 text-[#6B3A2A]/65 transition-colors duration-200 group-focus-within:text-[#6B2D0A]"
          aria-hidden
        />
        <textarea
          id="message"
          className={textareaClass}
          placeholder="Tell us about your order, custom request, or partnership idea..."
        />
      </div>
    </div>
  );
}

export default function ContactPageContent() {
  return (
    <main className="bg-[#F9F5EE]">
      {/* ── Navbar clearance + separation from hero ── */}
      <div className="h-24 lg:h-28" aria-hidden />

      {/* ── Page Hero ── */}
      <section className="w-full bg-[#E5C18D] py-12 lg:py-16 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-[#6B3A2A]" />
                <span className="font-body text-[11px] tracking-[0.35em] text-[#6B3A2A] uppercase font-semibold">
                  {CONTACT_HERO.eyebrow}
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#0D0603] mb-5 leading-[1.05]">
                {CONTACT_HERO.title}
              </h1>
              <div className="w-12 h-[2px] bg-[#6B3A2A] mb-6" />
              <p className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed max-w-xl">
                {CONTACT_HERO.intro}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
              className="lg:ml-auto lg:max-w-xs xl:max-w-sm lg:pl-16 xl:pl-24 lg:border-l lg:border-[#6B3A2A]/20 lg:pt-2"
            >
              <p className="font-display text-xl md:text-2xl italic text-[#1A1410]/85 leading-snug mb-5">
                &ldquo;{CONTACT_HERO.quote}&rdquo;
              </p>

              <div className="w-8 h-px bg-[#6B3A2A] mb-4" />

              <p className="font-body text-[14px] tracking-[0.08em] text-[#6B3A2A] uppercase font-semibold">
                {CONTACT_HERO.note}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="bg-white pt-14 lg:pt-20 pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-10 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mb-14 lg:mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="font-display text-2xl md:text-3xl text-[#0D0603] leading-snug mb-6"
            >
              Send us a message — we&apos;re always happy to help.
            </motion.p>
            <motion.div variants={fadeUp} custom={1} className="w-12 h-[2px] bg-[#C8892A] mb-6" />
            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-body text-[16px] lg:text-[17px] text-[#2C1810]/80 leading-relaxed"
            >
              Fill out the form below and our team will get back to you. For wholesale or
              partnership enquiries, you can also reach us directly by email.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 xl:gap-20 items-start">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-[#E8E0D4] bg-[#F9F5EE] p-6 lg:p-8"
            >
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#C8892A]/25">
                <div className="w-11 h-11 rounded-full bg-[#E5C18D] border border-[#C8892A]/35 flex items-center justify-center text-[#6B2D0A] flex-shrink-0">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-[#0D0603] mb-1.5">Send a Message</h2>
                  <p className="font-body text-[14px] text-[#2C1810]/70 leading-relaxed">
                    We typically respond within 24 hours on business days.
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField id="name" label="Name" icon={User}>
                    <input id="name" type="text" className={inputClass} placeholder="Your name" />
                  </FormField>
                  <FormField id="email" label="Email" icon={Mail}>
                    <input id="email" type="email" className={inputClass} placeholder="you@email.com" />
                  </FormField>
                </div>

                <MessageField />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                  <p className="font-body text-[13px] text-[#2C1810]/60 leading-relaxed max-w-sm">
                    By submitting, you agree to be contacted about your enquiry.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0D0603] text-white px-8 py-3.5 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#6B2D0A] hover:shadow-[0_8px_24px_rgba(107,45,10,0.2)] transition-all duration-300 sm:flex-shrink-0"
                  >
                    Submit Message
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="lg:pt-20 xl:pt-24"
            >
              <div className="lg:pl-10 xl:pl-12 lg:border-l lg:border-[#6B3A2A]/40 space-y-8">
                <div className="space-y-4">
                  <a
                    href={`tel:${WHATSAPP_NUMBER.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 font-body text-[17px] text-[#0D0603] hover:text-[#6B2D0A] transition-colors duration-200"
                  >
                    <Phone size={18} strokeWidth={1.5} className="text-[#6B3A2A] flex-shrink-0" />
                    {WHATSAPP_NUMBER}
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-3 font-body text-[17px] text-[#0D0603] hover:text-[#6B2D0A] transition-colors duration-200"
                  >
                    <Mail size={18} strokeWidth={1.5} className="text-[#6B3A2A] flex-shrink-0" />
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div>
                  <p className="font-body text-[11px] tracking-[0.14em] uppercase text-[#2C1810]/50 mb-4">
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={SOCIAL_LINKS.instagram}
                      className="inline-flex items-center gap-2 rounded-full border border-[#C4A882]/40 bg-[#F3EBD8]/50 px-4 py-2.5 font-body text-[12px] text-[#2C1810]/80 hover:border-[#C8892A]/60 hover:text-[#6B2D0A] transition-all duration-200"
                    >
                      {SOCIAL_ICONS.instagram}
                      Instagram
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.facebook}
                      className="inline-flex items-center gap-2 rounded-full border border-[#C4A882]/40 bg-[#F3EBD8]/50 px-4 py-2.5 font-body text-[12px] text-[#2C1810]/80 hover:border-[#C8892A]/60 hover:text-[#6B2D0A] transition-all duration-200"
                    >
                      {SOCIAL_ICONS.facebook}
                      Facebook
                    </Link>
                  </div>
                </div>

                <div className="-mt-1 pt-3 border-t border-[#6B3A2A]/40">
                  <p className="font-display text-xl text-[#0D0603] mb-2">Wholesale &amp; Partnerships</p>
                  <p className="font-body text-[14px] text-[#2C1810]/70 leading-relaxed mb-4">
                    Interested in stocking Kauseyah or collaborating with our artisan network?
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Partnership Inquiry`}
                    className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-[#6B2D0A] hover:text-[#0D0603] transition-colors duration-200"
                  >
                    Email us directly
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
