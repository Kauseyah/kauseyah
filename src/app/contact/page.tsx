import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <main className="container-site py-20">
      <h1 className="font-display text-5xl text-center mb-16">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <h2 className="font-display text-3xl mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">Name</label>
              <input type="text" className="w-full border border-stone-300 p-2 rounded" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">Email</label>
              <input type="email" className="w-full border border-stone-300 p-2 rounded" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">Message</label>
              <textarea className="w-full border border-stone-300 p-2 rounded h-32" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="btn btn-primary w-full">Submit Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-stone-500 uppercase tracking-wider mb-2">Phone Number</h3>
            <p className="text-xl">+91 98765 43210</p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-500 uppercase tracking-wider mb-2">Email Address</h3>
            <p className="text-xl">hello@kauseyah.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-stone-500 uppercase tracking-wider mb-2">Social Media</h3>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-[var(--color-earth)] hover:text-[var(--color-ochre)] font-semibold">Instagram</a>
              <a href="#" className="text-[var(--color-earth)] hover:text-[var(--color-ochre)] font-semibold">Facebook</a>
              <a href="#" className="text-[var(--color-earth)] hover:text-[var(--color-ochre)] font-semibold">Pinterest</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
