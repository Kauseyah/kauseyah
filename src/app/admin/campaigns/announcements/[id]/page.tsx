import { getAnnouncementById } from "@/app/actions/campaign-actions";
import AnnouncementForm from "../AnnouncementForm";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Edit Announcement - Admin - Kauseyah",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const { data: announcement, error } = await getAnnouncementById(id);

  if (error || !announcement) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-bold text-white">Announcement Not Found</h1>
        <p className="text-sm text-slate-400">
          {error || "The requested announcement could not be found or has been removed."}
        </p>
        <Link
          href="/admin/campaigns/announcements"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <AnnouncementForm initialAnnouncement={announcement} isEdit />
    </div>
  );
}
