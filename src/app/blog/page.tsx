import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <main className="container-site py-20 space-y-20">
      <h1 className="font-display text-5xl text-center mb-16">Blog & Insights</h1>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar for Categories */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm tracking-wider text-stone-500">Categories</h3>
          <ul className="space-y-2 text-stone-600">
            <li><a href="#industry" className="hover:text-[var(--color-earth)]">Industry Insights (1)</a></li>
            <li><a href="#education" className="hover:text-[var(--color-earth)]">Educational Content (2)</a></li>
            <li><a href="#updates" className="hover:text-[var(--color-earth)]">Latest Updates (3)</a></li>
            <li><a href="#seo" className="hover:text-[var(--color-earth)]">Articles (4)</a></li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-12">
          {/* Post Placeholder 1 */}
          <article className="border-b border-stone-200 pb-8">
            <span className="text-sm text-[var(--color-ochre)] font-semibold uppercase tracking-wider mb-2 block">Educational</span>
            <h2 className="font-display text-3xl mb-3">Understanding Ikat Weaving</h2>
            <p className="text-stone-600 mb-4">A deep dive into the painstaking process of resist dyeing and weaving that creates the blurred, beautiful patterns of Ikat...</p>
            <a href="#" className="font-semibold text-stone-800 hover:text-[var(--color-earth)]">Read more →</a>
          </article>

          {/* Post Placeholder 2 */}
          <article className="border-b border-stone-200 pb-8">
            <span className="text-sm text-[var(--color-ochre)] font-semibold uppercase tracking-wider mb-2 block">Insights</span>
            <h2 className="font-display text-3xl mb-3">The Future of Tribal Arts in Modern Fashion</h2>
            <p className="text-stone-600 mb-4">How contemporary designs are integrating ancient motifs while maintaining cultural sensitivity...</p>
            <a href="#" className="font-semibold text-stone-800 hover:text-[var(--color-earth)]">Read more →</a>
          </article>
        </div>
      </div>
    </main>
  );
}
