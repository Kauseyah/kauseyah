"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Helper to ensure user is admin and return the admin client
async function getAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");
  
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createSubcategory(formData: FormData) {
  const name = formData.get("name") as string;
  const category_id = formData.get("category_id") as string;
  let slug = formData.get("slug") as string;
  
  if (!name) {
    return { error: "Name is required" };
  }
  
  if (!category_id) {
    return { error: "Category is required" };
  }
  
  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  try {
    const adminClient = await getAdminClient();

    const { error } = await adminClient
      .from("subcategories")
      .insert([{ name, slug, category_id }]);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/products/subcategories");
    revalidatePath("/admin/products/new");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteSubcategory(id: string) {
  try {
    const adminClient = await getAdminClient();

    const { error } = await adminClient
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/products/subcategories");
    revalidatePath("/admin/products/new");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
