import { createClient } from "@supabase/supabase-js";
import CustomerTableClient from "./CustomerTableClient";
import Pagination from "@/components/admin/Pagination";

export default async function AdminCustomers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch profiles where role is not admin (including null which is default for customers)
  const { data: customers, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .or('role.neq.admin,role.is.null')
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / limit);

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
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
