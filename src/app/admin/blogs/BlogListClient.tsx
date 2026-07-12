"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, Eye, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { deleteBlog, toggleBlogStatus } from "@/app/actions/blog-actions";
import { useRouter } from "next/navigation";

import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (blog.author && blog.author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === "Published") return matchesSearch && blog.published;
    if (statusFilter === "Drafts") return matchesSearch && !blog.published;
    return matchesSearch;
  });

  const requestDelete = (id: string) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    
    setProcessingId(blogToDelete);
    const result = await deleteBlog(blogToDelete);
    
    if (result.error) {
      toast.error(`Failed to delete: ${result.error}`);
      setProcessingId(null);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } else {
      toast.success("Blog deleted successfully!");
      setBlogs(blogs.filter(b => b.id !== blogToDelete));
      setProcessingId(null);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
      router.refresh();
    }
  };

  const handleToggleStatus = async (blog: any) => {
    setProcessingId(blog.id);
    const newStatus = !blog.published;
    const result = await toggleBlogStatus(blog.id, newStatus);
    
    if (result.error) {
      toast.error(`Failed to update status: ${result.error}`);
      setProcessingId(null);
    } else {
      toast.success(newStatus ? "Blog published!" : "Blog moved to drafts");
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, published: newStatus } : b));
      setProcessingId(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search blogs by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm text-white placeholder-slate-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 font-bold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-sm"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Drafts</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Post Details</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Author</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog: any) => (
                  <tr key={blog.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-800 flex items-center justify-center text-slate-500 shadow-sm">
                          {blog.cover_image ? (
                            <Image 
                              src={blog.cover_image} 
                              alt={blog.title} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <FileText size={24} />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-base text-white line-clamp-1 mb-1">{blog.title}</div>
                          <div className="text-xs font-medium text-slate-400 truncate w-48 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md inline-block">/{blog.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-300">
                      {blog.author || '—'}
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleToggleStatus(blog)}
                        disabled={processingId === blog.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                          blog.published 
                            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50" 
                            : "bg-amber-900/30 text-amber-400 border border-amber-500/30 hover:bg-amber-900/50"
                        }`}
                      >
                        {processingId === blog.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : blog.published ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {blog.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-400">
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-5 flex justify-end gap-3">
                      <Link 
                        href={`/blog/${blog.slug}`} 
                        target="_blank"
                        className="p-2 text-slate-400 bg-slate-950 border border-slate-800 shadow-sm hover:text-white hover:border-slate-700 hover:bg-slate-800 rounded-lg transition-all"
                        title="View Public Page"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        href={`/admin/blogs/${blog.id}`} 
                        className="p-2 text-slate-400 bg-slate-950 border border-slate-800 shadow-sm hover:text-white hover:border-slate-700 hover:bg-slate-800 rounded-lg transition-all"
                        title="Edit Post"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button 
                        onClick={() => requestDelete(blog.id)}
                        disabled={processingId === blog.id}
                        className="p-2 text-slate-400 bg-slate-950 border border-slate-800 shadow-sm hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/30 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Post"
                      >
                        {processingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800">
                        <FileText size={28} className="text-slate-500" />
                      </div>
                      <p className="font-medium text-slate-300 text-lg">No blog posts found.</p>
                      <Link href="/admin/blogs/new" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">
                        Create your first post
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setBlogToDelete(null); }}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isPending={processingId !== null}
      />
    </div>
  );
}
