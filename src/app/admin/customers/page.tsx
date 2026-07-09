import { createClient } from "@supabase/supabase-js";
import CustomerTableClient from "./CustomerTableClient";

export default async function AdminCustomers() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Fetch profiles where role is not admin (including null which is default for customers)
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .or('role.neq.admin,role.is.null')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-slate-400">
            View and manage customer profiles and activity.
          </p>
        </div>
      </div>

      <CustomerTableClient initialCustomers={customers || []} />
    </div>
  );
}
