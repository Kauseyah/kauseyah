"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { createBlog } from "@/app/actions/blog-actions";
import toast from "react-hot-toast";

export default function AddBlog() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(event.currentTarget);
    const result = await createBlog(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else {
      toast.success("Blog published successfully!");
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1500);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/blogs"
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Add Blog Post</h1>
          <p className="mt-1 text-sm text-slate-400">
            Create a new blog article for your store.
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
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Content</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                <input 
                  type="text" name="title" required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Slug *</label>
                <input 
                  type="text" name="slug" required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Excerpt</label>
                <textarea 
                  name="excerpt" rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Content *</label>
                <textarea 
                  name="content" rows={15} required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                  placeholder="Markdown or HTML content..."
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">SEO Meta</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Meta Title</label>
                <input 
                  type="text" name="meta_title"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Meta Description</label>
                <textarea 
                  name="meta_description" rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Publishing</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select name="published" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white transition-all">
                  <option value="false">Draft</option>
                  <option value="true">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Author</label>
                <input 
                  type="text" name="author"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Cover Image</h2>
              
              <div className="border-2 border-dashed border-slate-700 hover:border-slate-600 bg-slate-950/50 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer">
                <ImagePlus className="text-slate-500 mb-2" size={32} />
                <p className="text-sm text-slate-300 mb-1">Upload a cover image</p>
                <p className="text-xs text-slate-500 mb-4">PNG, JPG up to 5MB</p>
                <input type="file" name="image" accept="image/*" className="text-xs w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer" />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Link href="/admin/blogs" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
