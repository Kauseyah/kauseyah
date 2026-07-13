"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete product error:", error);
    return { error: error.message || "Failed to delete from database" };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
