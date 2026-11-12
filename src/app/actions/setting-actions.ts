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
  const store_name = (formData.get("store_name") as string) || "Kauseyah";
  const contact_email = (formData.get("contact_email") as string) || "support@kauseyah.com";
  const phone = (formData.get("phone") as string) || "";
  const shipping_base_charge = Number(formData.get("shipping_base_charge")) || 200;
  const facebook = (formData.get("facebook") as string) || "";
  const instagram = (formData.get("instagram") as string) || "";
  const youtube = (formData.get("youtube") as string) || "";
  const linkedin = (formData.get("linkedin") as string) || "";

  // Extended features: Gifts, Admin notifications, WhatsApp
  const gift_enabled = formData.get("gift_enabled") === "on" || formData.get("gift_enabled") === "true";
  const gift_charge = Number(formData.get("gift_charge")) || 100;
  const gift_charge_mode = (formData.get("gift_charge_mode") as string) || "per_item";
  const gift_max_message_length = Number(formData.get("gift_max_message_length")) || 250;
  const admin_order_notification_email = (formData.get("admin_order_notification_email") as string) || "shwetarao17@gmail.com";
  
  const whatsapp_enabled = formData.get("whatsapp_enabled") === "on" || formData.get("whatsapp_enabled") === "true";
  const whatsapp_phone_number_id = (formData.get("whatsapp_phone_number_id") as string) || "";
  const whatsapp_business_account_id = (formData.get("whatsapp_business_account_id") as string) || "";

  const updateData: Record<string, any> = {
    store_name,
    contact_email,
    phone,
    shipping_base_charge,
    facebook,
    instagram,
    youtube,
    linkedin,
    gift_enabled,
    gift_charge,
    gift_charge_mode,
    gift_max_message_length,
    admin_order_notification_email,
    whatsapp_enabled,
    whatsapp_phone_number_id,
    whatsapp_business_account_id,
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

  if (result.error) {
    // If some columns are missing from unmigrated table, fallback to core fields
    if (result.error.message.includes("column")) {
      const coreUpdate = {
        store_name,
        contact_email,
        phone,
        shipping_base_charge,
        facebook,
        instagram,
        youtube,
        linkedin,
      };
      if (id) {
        result = await adminClient.from("store_settings").update(coreUpdate).eq("id", id).select();
      } else {
        result = await adminClient.from("store_settings").insert([coreUpdate]).select();
      }
    }
  }

  if (result.error) return { error: result.error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true, data: result.data };
}
