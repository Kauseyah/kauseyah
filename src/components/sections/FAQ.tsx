"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: "faq-1",
    q: "Are all your products handwoven by artisans?",
    a: "Yes, absolutely. Every piece in the Kauseyah collection is handcrafted by skilled artisan families across India's tribal and weaving communities — from the Ikat weavers of Odisha to the Banarasi silk masters of Varanasi. No machine replication. Each piece carries the fingerprint of the hand that made it.",
  },
  {
    id: "faq-2",
    q: "How do I know my purchase is ethically sourced?",
    a: "We work directly with artisan cooperatives, bypassing intermediaries entirely. Every artisan family we partner with receives fair wages well above market rates, and we invest a portion of every sale back into community welfare programs. We are committed to transparent, traceable sourcing.",
  },
  {
    id: "faq-3",
    q: "How should I care for my handloom textile?",
    a: "Handloom fabrics are delicate and deserve gentle care. We recommend dry cleaning for silk pieces, and hand washing in cold water with mild detergent for cotton and linen weaves. Avoid wringing — lay flat to dry in shade. Store folded in a breathable cotton bag, away from direct sunlight.",
  },
  {
    id: "faq-4",
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. International orders are carefully packaged to protect the textile during transit. Delivery typically takes 7–14 business days depending on destination. Customs duties, if applicable, are the responsibility of the buyer and vary by country.",
  },
  {
    id: "faq-5",
    q: "Can I return or exchange a product?",
    a: "We accept returns within 14 days of delivery, provided the product is unused, unwashed, and in its original packaging. Custom or pre-order pieces are non-returnable. To initiate a return, please reach out to us via our contact page and our team will guide you through the process.",
  },
  {
    id: "faq-6",
    q: "Are the colours in the photos true to the actual product?",
    a: "We photograph every product under natural light to capture colours as accurately as possible. However, slight variations may occur due to monitor calibration differences and the natural character of hand-dyed textiles — no two pieces are ever exactly alike, which is part of what makes each one special.",
  },
];

// ─── ACCORDION ITEM ───────────────────────────────────────────────────────────
function AccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof FAQS)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-[#C8892A]/15"
    >
      <button
        onClick={onToggle}
        id={item.id}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        {/* Number + Question */}
        <div className="flex items-start gap-5">
          <span
            className="font-body text-[12px] font-medium tracking-[0.2em] pt-[1px] flex-shrink-0 transition-colors duration-300"
            style={{ color: isOpen ? "#C8892A" : "rgba(26,20,16,0.5)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="font-display text-[1.2rem] md:text-[1.35rem] leading-snug transition-colors duration-300"
            style={{ color: isOpen ? "#6B3A2A" : "#1A1410" }}
          >
            {item.q}
          </span>
        </div>

        {/* +/– icon */}
        <span
          className="flex-shrink-0 w-6 h-6 mt-[2px] flex items-center justify-center border transition-all duration-300"
          style={{
            borderColor: isOpen ? "#C8892A" : "rgba(26,20,16,0.18)",
            color: isOpen ? "#C8892A" : "#1A1410",
            background: isOpen ? "rgba(200,137,42,0.06)" : "transparent",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transition: "transform 0.35s ease",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="1.4" />
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="font-body text-[15px] md:text-[16px] leading-relaxed pb-6 pl-10 text-[#1A1410]/85"
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="w-full bg-[#F9F5EE] py-20 lg:py-28">
      <div className="max-w-[1100px] mx-auto px-8 lg:px-16">

        {/* ── Grid: heading left, accordion right ── */}
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-12 xl:gap-20 items-start">

          {/* LEFT — heading block */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <span className="font-body text-[12px] font-bold tracking-[0.3em] text-[#1A1410]/60 uppercase block mb-4">
              Got Questions?
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#1A1410] mb-6">
              Frequently Asked
            </h2>
            <div className="w-10 h-[1.5px] bg-[#C8892A] mb-7" />
            <p className="font-body text-lg lg:text-xl text-[#1A1410]/70 leading-relaxed mb-8">
              Everything you need to know about our handloom collections, ethical sourcing,
              care instructions, and how we bring India's artisan legacy to your door.
            </p>
            <p className="font-body text-[15px] leading-relaxed text-[#1A1410]/70 mb-10">
              Can't find your answer? We're always happy to help — reach out to us directly
              and our team will get back to you within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-4 group"
            >
              <span className="w-8 h-px bg-[#C8892A] transition-all duration-300 group-hover:w-12" />
              <span className="font-body text-[11px] tracking-[0.28em] uppercase text-[#1A1410] transition-colors duration-300 group-hover:text-[#C8892A]">
                Contact Us
              </span>
            </a>
          </motion.div>

          {/* RIGHT — accordion */}
          <div>
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
