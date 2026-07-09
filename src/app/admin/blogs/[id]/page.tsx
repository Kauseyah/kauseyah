"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { updateBlog } from "@/app/actions/blog-actions";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { use } from "react";

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
        
      if (data) {
        setBlog(data);
      } else if (error) {
        setErrorMsg(error.message);
      }
      setIsLoading(false);
    }
    loadBlog();
  }, [resolvedParams.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(event.currentTarget);
    formData.append("existing_image", blog.cover_image || "");
    const result = await updateBlog(resolvedParams.id, formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      toast.success("Blog updated successfully!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6 text-center text-gray-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/blogs"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Edit Blog Post</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your blog article content and settings.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input 
                  type="text" name="title" required defaultValue={blog.title}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input 
                  type="text" name="slug" required defaultValue={blog.slug}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea 
                  name="excerpt" rows={3} defaultValue={blog.excerpt || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content *</label>
                <textarea 
                  name="content" rows={15} required defaultValue={blog.content}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">SEO Meta</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input 
                  type="text" name="meta_title" defaultValue={blog.meta_title || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea 
                  name="meta_description" rows={3} defaultValue={blog.meta_description || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Publishing</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="published" 
                  defaultValue={blog.published ? "true" : "false"}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                >
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input 
                  type="text" name="author" defaultValue={blog.author || ""}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Cover Image</h2>
              
              {blog.cover_image && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={blog.cover_image} alt="Cover" fill className="object-cover" />
                </div>
              )}

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <ImagePlus className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 mb-1">Upload new cover image</p>
                <p className="text-xs text-gray-400 mb-4">PNG, JPG up to 5MB</p>
                <input type="file" name="image" accept="image/*" className="text-xs w-full" />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/blogs" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}