import AnnouncementForm from "../AnnouncementForm";

export const metadata = {
  title: "Create Announcement - Admin - Kauseyah",
};

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <AnnouncementForm />
    </div>
  );
}
