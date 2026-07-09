import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!blog) notFound();

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <article className="max-w-[800px] mx-auto px-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-stone-500 hover:text-[#FF6B00] transition-colors mb-8 text-sm font-body"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        <header className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-[#111111] leading-tight mb-6">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-4 text-stone-500 font-body text-sm border-b border-[#FF6B00]/10 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#FF6B00]/70" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-[#FF6B00]/70" />
              {blog.author || "Kauseyah Editorial"}
            </span>
          </div>
        </header>

        {blog.cover_image && (
          <div className="relative w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden bg-stone-100">
            <Image 
              src={blog.cover_image} 
              alt={blog.title} 
              fill 
              className="object-cover" 
            />
          </div>
        )}

        <div 
          className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-headings:text-[#111111] prose-p:font-body prose-p:text-stone-600 prose-a:text-[#FF6B00] hover:prose-a:text-[#FF6B00]/80"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </article>
    </main>
  );
}
