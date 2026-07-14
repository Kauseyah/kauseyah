import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import Link from "next/link";
import BlogListClient from "./BlogListClient";

export default async function AdminBlogs() {
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: blogs } = await adminClient
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">Blogs</h1>
          <p className="mt-1 text-sm text-slate-400 font-medium">
            Manage your blog posts, articles, and news.
          </p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-500 transition-all shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create Post
        </Link>
      </div>

      <BlogListClient initialBlogs={blogs || []} />
    </div>
  );
}
