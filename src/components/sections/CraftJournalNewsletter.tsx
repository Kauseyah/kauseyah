"use client";

import { useState, useEffect } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions";
import { Feather, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";

const CATEGORIES = [
  "Craft Stories",
  "Meet the Artisans",
  "Behind the Craft",
  "Cultural Discoveries",
  "Handloom Highlights",
];

export default function CraftJournalNewsletter() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loadTime, setLoadTime] = useState(0);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoadTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage("Please provide your email address.");
      return;
    }

    if (!consent) {
      setErrorMessage("Please check the box to confirm you wish to receive the Journal.");
      return;
    }

    setLoading(true);

    try {
      const res = await subscribeToNewsletter({
        email,
        firstName: firstName.trim() || undefined,
        consent,
        honeypot,
        loadTime,
      });

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage(res.message || "Thank you for subscribing to The Kauseyah Craft Journal.");
        setEmail("");
        setFirstName("");
        setConsent(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FAF4ED] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#EADDCF]/70 relative overflow-hidden font-body">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#111111]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Monogram / Header icon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF8F3] border border-[#FF6B00]/25 text-[#FF6B00] text-xs font-semibold uppercase tracking-widest mb-6">
          <Feather size={14} />
          <span>The Kauseyah Craft Journal</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal tracking-tight mb-4 leading-tight">
          Stories woven by hands. <br className="hidden sm:inline" />
          <span className="italic font-light text-[#FF6B00]">Heritage shared through generations.</span>
        </h2>

        <p className="text-[#55504A] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Subscribe to receive thoughtfully written chronicles from loom houses across India, intimate conversations with master weavers, and seasonal handloom collections before public release.
        </p>

        {/* Categories / Pill Tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 mb-10 max-w-2xl mx-auto">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-[#E0D5C7] text-[#4A4540] font-medium shadow-sm transition-all hover:border-[#FF6B00]/40 hover:text-[#111111]"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Subscription Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADDCF] shadow-[0_12px_40px_rgba(45,40,37,0.05)] max-w-2xl mx-auto text-left">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="font-display text-2xl text-[#111111]">Welcome to the Journal</h3>
              <p className="text-sm text-[#55504A] max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="mt-4 text-xs font-bold uppercase tracking-wider text-[#FF6B00] hover:underline"
              >
                Subscribe another address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot suppression (hidden visually & from accessibility trees) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="craft_hp">Do not fill this field</label>
                <input
                  type="text"
                  id="craft_hp"
                  name="craft_hp"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label htmlFor="first_name" className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6E6E] mb-1.5">
                    First Name <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aditi"
                    disabled={loading}
                    className="w-full bg-[#FFF8F3] border border-[#E0D5C7] focus:border-[#FF6B00] px-4 py-3 rounded-xl text-[#111111] text-sm outline-none transition-colors placeholder-stone-400"
                  />
                </div>

                <div className="sm:col-span-8">
                  <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6E6E] mb-1.5">
                    Email Address <span className="text-[#FF6B00]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditi@example.com"
                    disabled={loading}
                    className="w-full bg-[#FFF8F3] border border-[#E0D5C7] focus:border-[#FF6B00] px-4 py-3 rounded-xl text-[#111111] text-sm outline-none transition-colors placeholder-stone-400 font-medium"
                  />
                </div>
              </div>

              {/* Explicit Unchecked Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={loading}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] accent-[#FF6B00] cursor-pointer"
                  />
                  <span className="text-xs text-[#55504A] leading-relaxed select-none group-hover:text-[#111111]">
                    I agree to receive <strong className="text-[#111111] font-semibold">The Kauseyah Craft Journal</strong> and occasional stories celebrating Indian handloom arts. You can unsubscribe anytime with one click.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Subscribe button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111111] hover:bg-[#FF6B00] text-white py-3.5 px-6 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-none hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-[#111111] disabled:hover:translate-y-0 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-[#FF6B00]" />
                      <span>Join The Craft Journal</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[#8C827A] pt-1">
                Zero spam. Mindful publishing only. Your email address remains private.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

