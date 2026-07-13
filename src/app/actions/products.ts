"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Helper to ensure user is admin and return the admin client
async function getAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  if (roleData?.role !== 'admin') {
    throw new Error("Unauthorized. Admin privileges required.");
  }
  
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function deleteProduct(id: string) {
  try {
    const adminClient = await getAdminClient();

    const { data, error } = await adminClient
      .from("products")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Delete product error:", error);
      return { error: error.message || "Failed to delete from database" };
    }
    
    if (!data || data.length === 0) {
      return { error: "Product not found or permission denied" };
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
