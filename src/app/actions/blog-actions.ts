"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createAdminClient } from "@supabase/supabase-js";

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

export async function createBlog(formData: FormData) {
  const adminClient = await getAdminClient();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;
  const author = formData.get("author") as string;
  const published = formData.get("published") === "true";
  
  const imageFile = formData.get("image") as File;
  let cover_image = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('blogs')
      .upload(`covers/${fileName}`, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }
    
    const { data: publicUrlData } = adminClient.storage
      .from('blogs')
      .getPublicUrl(`covers/${fileName}`);
      
    cover_image = publicUrlData.publicUrl;
  }

  const { data, error } = await adminClient
    .from("blogs")
    .insert([{
      title, slug, excerpt, content, meta_title, meta_description, author, published, cover_image
    }])
    .select();

  if (error) return { error: error.message };

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true, data };
}

export async function updateBlog(id: string, formData: FormData) {
  const adminClient = await getAdminClient();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;
  const author = formData.get("author") as string;
  const published = formData.get("published") === "true";
  
  const imageFile = formData.get("image") as File;
  let cover_image = formData.get("existing_image") as string;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('blogs')
      .upload(`covers/${fileName}`, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }
    
    const { data: publicUrlData } = adminClient.storage
      .from('blogs')
      .getPublicUrl(`covers/${fileName}`);
      
    cover_image = publicUrlData.publicUrl;
  }

  const { data, error } = await adminClient
    .from("blogs")
    .update({
      title, slug, excerpt, content, meta_title, meta_description, author, published, cover_image
    })
    .eq("id", id)
    .select();

  if (error) return { error: error.message };

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true, data };
}

export async function deleteBlog(id: string) {
  const adminClient = await getAdminClient();
  const { error } = await adminClient.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true };
}

export async function toggleBlogStatus(id: string, published: boolean) {
  const adminClient = await getAdminClient();
  const { error } = await adminClient.from("blogs").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true };
}
