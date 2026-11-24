import { getAllAnnouncements } from "@/app/actions/campaign-actions";
import Link from "next/link";
import { Plus, Megaphone, Sparkles } from "lucide-react";
import AnnouncementsClientList from "./AnnouncementsClientList";

export const metadata = {
  title: "Announcement Bar - Admin - Kauseyah",
};

export default async function AdminAnnouncementsPage() {
  const { data: announcements, error } = await getAllAnnouncements();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Megaphone size={18} />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Announcement Bar</h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Create, schedule, color-brand, and prioritize top-bar promotional notices, sale tickers, and delivery alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns/banners"
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-colors shadow-sm"
          >
            <Sparkles size={16} />
            Homepage Banners
          </Link>
          <Link
            href="/admin/campaigns/announcements/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-500 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Create Announcement
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <p className="font-bold flex items-center gap-2">
            Database Schema Status:
          </p>
          <p className="mt-1 text-amber-300/80">
            {error}
          </p>
          <p className="mt-2 text-xs text-amber-400">
            Run the prepared migration <code className="bg-amber-950 px-1 py-0.5 rounded font-mono">20261116_create_announcement_bars.sql</code> in your Supabase SQL editor to create the announcement table.
          </p>
        </div>
      ) : null}

      <AnnouncementsClientList initialAnnouncements={announcements || []} />
    </div>
  );
}
