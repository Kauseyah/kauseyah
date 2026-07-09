import { createClient as createAdminClient } from "@supabase/supabase-js";
import SettingsForm from "./SettingsForm";

export default async function AdminSettings() {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Fetch the single settings row
  const { data: settings } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .single();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Store Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your global store configurations, contact information, and social links.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
