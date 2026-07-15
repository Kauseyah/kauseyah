"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, User, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitContactForm } from "@/app/actions/contact-actions";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
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
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
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
  "w-full rounded-xl border border-[#E5E5E5] bg-white pl-11 pr-4 py-3.5 font-body text-[15px] text-[#111111] placeholder:text-[#111111]/40 focus:border-[#FF6B00] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/15 transition-all duration-200";

const textareaClass =
  "w-full rounded-xl border border-[#E5E5E5] bg-white pl-11 pr-4 pt-3.5 pb-3.5 font-body text-[15px] text-[#111111] placeholder:text-[#111111]/40 focus:border-[#FF6B00] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/15 transition-all duration-200 min-h-[100px] resize-y";

const labelClass =
  "block font-body text-[11px] font-semibold tracking-[0.14em] uppercase text-[#FF6B00] mb-2.5";

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
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00]/65 transition-colors duration-200 group-focus-within:text-[#FF6B00]"
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
          className="pointer-events-none absolute left-4 top-4 text-[#FF6B00]/65 transition-colors duration-200 group-focus-within:text-[#FF6B00]"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <main className="bg-[#FEF9F9] text-[#111111]">
      {/* ── Page Hero ── */}
      <section className="w-full min-h-[50svh] lg:min-h-[100svh] pt-20 pb-10 lg:pb-0 flex flex-col justify-center overflow-hidden relative border-b border-[#FF6B00]/10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/contact-hero.webp" alt="Contact Us" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-[#0D0400]/60" />
        </div>

        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#FF6B00]" />
              <span className="font-body text-[11px] tracking-[0.35em] text-[#FF6B00] uppercase font-bold">
                {CONTACT_HERO.eyebrow}
              </span>
              <span className="w-8 h-px bg-[#FF6B00]" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tighter text-white mb-4 leading-[0.9] drop-shadow-lg">
              Contact <span className="text-[#FF6B00] italic font-light drop-shadow-[0_2px_8px_rgba(255,107,0,0.25)]">Us</span>
            </h1>

            <div className="w-16 h-[2px] bg-[#FF6B00] mb-6" />

            <p className="font-body text-base md:text-lg lg:text-xl text-[#FFF8F3]/90 leading-relaxed max-w-2xl mb-8 font-light drop-shadow-md">
              {CONTACT_HERO.intro}
            </p>

            <div className="flex flex-col items-center max-w-md mx-auto pt-6 border-t border-[#FF6B00]/15 w-full">
              <p className="font-display text-lg md:text-xl italic text-white/95 leading-relaxed mb-4 drop-shadow-md">
                &ldquo;{CONTACT_HERO.quote}&rdquo;
              </p>
              <p className="font-body text-[11px] tracking-[0.2em] text-[#FF6B00] uppercase font-bold">
                — {CONTACT_HERO.note}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="bg-white pt-14 lg:pt-20 pb-20 lg:pb-28">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-3xl mb-14 lg:mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="font-display text-2xl md:text-3xl text-[#111111] leading-snug mb-6"
            >
              Send us a message — we&apos;re always happy to help.
            </motion.p>
            <motion.div variants={fadeUp} custom={1} className="w-12 h-[2px] bg-[#FF6B00] mb-6" />
            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-body text-[16px] lg:text-[17px] text-[#111111]/80 leading-relaxed"
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
              className="rounded-2xl border border-[#111111]/10 bg-white p-6 lg:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#111111]/15">
                <div className="w-11 h-11 rounded-full bg-[#F1F3E0] border border-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-[#111111] mb-1.5 leading-[0.85]">
                    Send a <span className="text-[#FF6B00] italic font-light drop-shadow-sm">Message</span>
                  </h2>
                  <p className="font-body text-[14px] text-[#111111]/75 leading-relaxed">
                    We typically respond within 24 hours on business days.
                  </p>
                </div>
              </div>

              <form className="space-y-5" action={async (formData) => {
                setIsSubmitting(true);
                const result = await submitContactForm(formData);
                setIsSubmitting(false);
                
                if (result.error) {
                  toast.error(result.error);
                } else {
                  toast.success("Message sent successfully! We'll be in touch soon.");
                  (document.getElementById('contact-form') as HTMLFormElement)?.reset();
                }
              }} id="contact-form">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField id="name" label="Name" icon={User}>
                    <input id="name" name="name" type="text" className={inputClass} placeholder="Your name" required />
                  </FormField>
                  <FormField id="email" label="Email" icon={Mail}>
                    <input id="email" name="email" type="email" className={inputClass} placeholder="you@email.com" required />
                  </FormField>
                </div>

                <div className="space-y-2 relative group">
                  <label htmlFor="message" className="block font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#111111]/60">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 text-[#111111]/40 transition-colors duration-200 group-focus-within:text-[#FF6B00]">
                      <MessageSquare size={16} strokeWidth={1.5} />
                    </div>
                    <textarea 
                      id="message" 
                      name="message" 
                      className={textareaClass} 
                      placeholder="Tell us about your order, custom request, or partnership idea..." 
                      required 
                      minLength={10}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                  <p className="font-body text-[13px] text-[#111111]/70 leading-relaxed max-w-sm">
                    By submitting, you agree to be contacted about your enquiry.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#FF6B00] text-[#F8EDED] px-8 py-3.5 font-body text-[11px] tracking-[0.22em] uppercase hover:bg-[#111111] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 sm:flex-shrink-0"
                  >
                    {isSubmitting ? "Sending..." : "Submit Message"}
                    {!isSubmitting && <ArrowRight size={14} />}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="relative z-10 lg:pt-20 xl:pt-24">
              <div className="lg:pl-10 xl:pl-12 lg:border-l lg:border-[#FF6B00]/40 space-y-8">
                <div className="space-y-4">
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 font-body text-[17px] text-[#111111] hover:text-[#FF6B00] transition-colors duration-200"
                  >
                    <Phone size={18} strokeWidth={1.5} className="text-[#FF6B00] flex-shrink-0" />
                    {CONTACT_PHONE}
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-3 font-body text-[17px] text-[#111111] hover:text-[#FF6B00] transition-colors duration-200"
                  >
                    <Mail size={18} strokeWidth={1.5} className="text-[#FF6B00] flex-shrink-0" />
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div>
                  <p className="font-body text-[11px] tracking-[0.14em] uppercase text-[#111111]/50 mb-4">
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={SOCIAL_LINKS.instagram}
                      className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/20 bg-[#F1F3E0] px-4 py-2.5 font-body text-[12px] text-[#111111]/80 hover:border-[#FF6B00]/60 hover:text-[#FF6B00] transition-all duration-200"
                    >
                      {SOCIAL_ICONS.instagram}
                      Instagram
                    </Link>
                    <Link
                      href={SOCIAL_LINKS.linkedin}
                      className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/20 bg-[#F1F3E0] px-4 py-2.5 font-body text-[12px] text-[#111111]/80 hover:border-[#FF6B00]/60 hover:text-[#FF6B00] transition-all duration-200"
                    >
                      {SOCIAL_ICONS.linkedin}
                      LinkedIn
                    </Link>
                  </div>
                </div>

                <div className="-mt-1 pt-3 border-t border-[#FF6B00]/40">
                  <p className="font-display text-xl text-[#111111] mb-2">Wholesale &amp; Partnerships</p>
                  <p className="font-body text-[14px] text-[#111111]/70 leading-relaxed mb-4">
                    Interested in stocking Kauseyah or collaborating with our artisan network?
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Partnership Inquiry`}
                    className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-[#FF6B00] hover:text-[#111111] transition-colors duration-200"
                  >
                    Email us directly
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
