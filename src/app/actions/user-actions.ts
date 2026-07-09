"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: { full_name: string, phone: string, access_token: string }) {
  try {
    if (!formData.access_token) {
      return { error: "No access token provided" };
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${formData.access_token}`
          }
        }
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: `GET_USER_ERROR: ${userError?.message || "No user found with token"}` };
    }

    const { full_name, phone } = formData;

    // Update profiles table
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        full_name, 
        phone,
        email: user.email,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { error: `UPSERT_ERROR: ${error.message}` };
    }

    // Update user metadata in auth.users
    // We catch this specifically because updateUser often throws "Auth session missing!" 
    // in Server Actions due to the client lacking an internal session state.
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name }
      });
      if (updateError) {
        console.warn("Could not update auth metadata (safe to ignore):", updateError.message);
      }
    } catch (e: any) {
      console.warn("Caught updateUser exception:", e.message);
    }

    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: "An unexpected error occurred" };
  }
}
