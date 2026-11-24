import BannerForm from "../BannerForm";

export const metadata = {
  title: "Create Homepage Banner - Admin - Kauseyah",
};

export default function NewHomepageBannerPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <BannerForm />
    </div>
  );
}
