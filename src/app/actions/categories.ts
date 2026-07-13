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

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  
  if (!name) {
    return { error: "Name is required" };
  }
  
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const adminClient = await getAdminClient();

    const { error } = await adminClient
      .from("categories")
      .insert([{ name, slug }]);

    if (error) {
      // // console.error("Failed to insert category:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/products/categories");
    revalidatePath("/admin/products/new");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const adminClient = await getAdminClient();

    const { error } = await adminClient
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      // // console.error("Failed to delete category:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/products/categories");
    revalidatePath("/admin/products/new");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
