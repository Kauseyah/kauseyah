import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminLayoutWrapper from "./AdminLayoutWrapper";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel - Kauseyah",
  description: "Admin dashboard for Kauseyah",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  // Handle logout action
  const handleLogout = async () => {
    "use server"
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  };

  let isAdmin = false;
  
  if (user) {
    const { data: roleData } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
      
    if (roleData?.role === 'admin') {
      isAdmin = true;
    }
  }

  // If no user or not admin, it's likely the login page or middleware hasn't redirected yet.
  if (!isAdmin) {
    return <>{children}</>;
  }

  // Fetch dynamic notification counts using service role to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { count: totalOrdersCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { count: totalPaymentsCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid');

  const { count: totalCustomersCount } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .or('role.neq.admin,role.is.null');

  return (
    <div className={inter.className}>
      <AdminLayoutWrapper 
        sidebar={
          <AdminSidebar 
            totalOrders={totalOrdersCount || 0}
            totalPayments={totalPaymentsCount || 0}
            totalCustomers={totalCustomersCount || 0}
            handleLogout={handleLogout}
          />
        }
      >
        {children}
      </AdminLayoutWrapper>
    </div>
  );
}
