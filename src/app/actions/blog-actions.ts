"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBlog(formData: FormData) {
  const supabase = await createClient();
  
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
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blogs')
      .upload(`covers/${fileName}`, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('blogs')
      .getPublicUrl(`covers/${fileName}`);
      
    cover_image = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
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
  const supabase = await createClient();
  
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
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blogs')
      .upload(`covers/${fileName}`, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('blogs')
      .getPublicUrl(`covers/${fileName}`);
      
    cover_image = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
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
  const supabase = await createClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true };
}

export async function toggleBlogStatus(id: string, published: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("blogs").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true };
}
