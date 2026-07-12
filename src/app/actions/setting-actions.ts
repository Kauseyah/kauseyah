"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
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
  
  const id = formData.get("id") as string;
  const store_name = formData.get("store_name") as string;
  const contact_email = formData.get("contact_email") as string;
  const phone = formData.get("phone") as string;
  const shipping_base_charge = formData.get("shipping_base_charge") ? parseFloat(formData.get("shipping_base_charge") as string) : 0;
  
  const facebook = formData.get("facebook") as string;
  const instagram = formData.get("instagram") as string;
  const youtube = formData.get("youtube") as string;
  const linkedin = formData.get("linkedin") as string;

  const updateData = {
    store_name,
    contact_email,
    phone,
    shipping_base_charge,
    facebook,
    instagram,
    youtube,
    linkedin
  };

  let result;
  
  if (id) {
    result = await adminClient
      .from("store_settings")
      .update(updateData)
      .eq("id", id)
      .select();
  } else {
    // Fallback if no settings exist yet
    result = await adminClient
      .from("store_settings")
      .insert([updateData])
      .select();
  }

  if (result.error) return { error: result.error.message };

  revalidatePath("/admin/settings");
  // Also revalidate main layout paths if they use settings
  revalidatePath("/", "layout");
  return { success: true, data: result.data };
}
