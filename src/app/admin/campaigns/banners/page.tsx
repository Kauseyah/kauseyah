import { getAllBanners } from "@/app/actions/campaign-actions";
import Link from "next/link";
import { Plus, Sparkles, Layers } from "lucide-react";
import BannersClientList from "./BannersClientList";

export const metadata = {
  title: "Homepage Banners - Admin - Kauseyah",
};

export default async function AdminHomepageBannersPage() {
  const { data: banners, error } = await getAllBanners();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sparkles size={18} />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Homepage Banners</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Create, schedule, and reorder full-width promotional campaign banners for the homepage hero carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/announcements"
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-colors shadow-sm"
          >
            <Layers size={16} />
            Announcement Bar
          </Link>
          <Link
            href="/admin/campaigns/banners/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create Banner
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <p className="font-bold flex items-center gap-2">
            Database Schema Status:
          </p>
          <p className="mt-1 text-xs text-amber-300/80 leading-relaxed">
            The <code className="font-mono bg-black/30 px-1 py-0.5 rounded">homepage_banners</code> table has not been created yet in the database. 
            Migration script is prepared at <code className="font-mono bg-black/30 px-1 py-0.5 rounded">supabase/migrations/20261116_create_homepage_banners.sql</code>.
            Once executed, created banners will automatically appear here.
          </p>
        </div>
      ) : null}

      {/* Client List with Search, Filter, Reorder, Preview Modal */}
      <BannersClientList initialBanners={banners || []} />
    </div>
  );
}
