import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { Search } from "lucide-react";
import PaymentsTable from "./PaymentsTable";

import Pagination from "@/components/admin/Pagination";

export default async function AdminPayments({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Use service role key to bypass missing RLS policies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch payments from the orders table since payments are stored on the order record
  const { data: payments, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / limit);

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
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
