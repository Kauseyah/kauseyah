import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Search } from "lucide-react";
import PaymentsTable from "./PaymentsTable";

export default async function AdminPayments() {
  // Use service role key to bypass missing RLS policies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Fetch payments from the orders table since payments are stored on the order record
  const { data: payments } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-slate-400">
            View and manage transaction history and payment statuses.
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <PaymentsTable payments={payments || []} />
    </div>
  );
}
