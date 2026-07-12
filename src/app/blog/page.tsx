import { createClient } from "@/utils/supabase/server";
import { mapSupabaseBlogToFrontend } from "@/utils/supabase/mapper";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: sbBlogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const blogs = (sbBlogs || []).map(mapSupabaseBlogToFrontend);

  return <BlogClient initialBlogs={blogs} />;
}
