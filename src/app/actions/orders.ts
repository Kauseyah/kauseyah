"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = formData.get("order_status") as string;
  const paymentStatus = formData.get("payment_status") as string;
  
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Check if the user is an admin
  const { data: roleData } = await supabaseAuth
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  if (roleData?.role !== 'admin') {
    return { error: "Unauthorized. Admin privileges required." };
  }

  // Use service role key to bypass missing RLS policies
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ 
      order_status: status,
      payment_status: paymentStatus
    })
    .eq("id", orderId);

  if (error) {
    // // console.error("Error updating order:", error);
    return { error: error.message };
  }

  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
