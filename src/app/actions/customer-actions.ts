"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function toggleCustomerStatus(customerId: string, currentStatus: boolean | null) {
  const supabase = await createClient();
  
  // 1. Secure Authorization Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized. Please log in." };

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  if (roleData?.role !== 'admin') {
    return { error: "Unauthorized. Admin privileges required." };
  }

  // 2. Use Admin Client to bypass RLS for the actual update
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Default to true if null, so toggle means set to false
  const newStatus = currentStatus === false ? true : false;
  
  // 1. Update the profile flag in the database
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ is_active: newStatus })
    .eq("id", customerId);

  if (profileError) {
    return { error: profileError.message };
  }

  // 2. Ban or Unban the user in Supabase Auth to physically prevent login
  const { error: authError } = await adminClient.auth.admin.updateUserById(customerId, {
    ban_duration: newStatus === false ? "876000h" : "none" // Ban for 100 years if blocked, otherwise remove ban
  });

  if (authError) {
    console.error("Auth ban error:", authError);
    // Don't fail the whole request if they just don't have an auth account yet, 
    // but log it for debugging.
  }

  // Revalidate the customer details page and the main list
  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/admin/customers");
  
  return { success: true, is_active: newStatus };
}
