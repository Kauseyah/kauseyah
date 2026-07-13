"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  material: z.string().optional(),
  care_instructions: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  discount_price: z.number().nullable().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
  category_id: z.string().uuid("Invalid category").optional().nullable(),
  subcategory: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
});

export async function createProduct(formData: FormData) {
  const adminClient = await getAdminClient();
  
  try {
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      material: formData.get("material"),
      care_instructions: formData.get("care_instructions"),
      price: parseFloat(formData.get("price") as string),
      discount_price: formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null,
      stock: parseInt(formData.get("stock") as string, 10),
      sku: formData.get("sku"),
      category_id: formData.get("category_id") || null,
      subcategory: formData.get("subcategory") || null,
      status: formData.get("status") || "draft",
      featured: formData.get("featured") === "true",
    };

    const validatedData = productSchema.parse(data);

    // Handle Image Upload
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await adminClient.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Automatically register custom subcategory in the global database
    if (validatedData.subcategory && validatedData.category_id) {
      const { data: existingSub } = await adminClient
        .from("subcategories")
        .select("id")
        .eq("category_id", validatedData.category_id)
        .ilike("name", validatedData.subcategory)
        .maybeSingle();
        
      if (!existingSub) {
        const newSlug = validatedData.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await adminClient.from("subcategories").insert({
          name: validatedData.subcategory,
          slug: newSlug,
          category_id: validatedData.category_id
        });
      }
    }

    // Insert Product
    const productInsert = {
      ...validatedData,
      images: imageUrl ? [imageUrl] : [],
    };

    const { error: insertError } = await adminClient
      .from("products")
      .insert([productInsert]);

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    // // console.error("Product creation failed:", error);
    return { error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const adminClient = await getAdminClient();
  
  try {
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      material: formData.get("material"),
      care_instructions: formData.get("care_instructions"),
      price: parseFloat(formData.get("price") as string),
      discount_price: formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null,
      stock: parseInt(formData.get("stock") as string, 10),
      sku: formData.get("sku"),
      category_id: formData.get("category_id") || null,
      subcategory: formData.get("subcategory") || null,
      status: formData.get("status") || "draft",
      featured: formData.get("featured") === "true",
    };
    
    console.log("updateProduct payload:", data);

    const validatedData = productSchema.parse(data);

    // Handle Image Upload (only update if a new image is provided)
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await adminClient.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Automatically register custom subcategory in the global database
    if (validatedData.subcategory && validatedData.category_id) {
      const { data: existingSub } = await adminClient
        .from("subcategories")
        .select("id")
        .eq("category_id", validatedData.category_id)
        .ilike("name", validatedData.subcategory)
        .maybeSingle();
        
      if (!existingSub) {
        const newSlug = validatedData.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await adminClient.from("subcategories").insert({
          name: validatedData.subcategory,
          slug: newSlug,
          category_id: validatedData.category_id
        });
      }
    }

    // Update Product
    const productUpdate: any = { ...validatedData };
    if (imageUrl) {
      // For simplicity, replacing images array with new image
      productUpdate.images = [imageUrl];
    }

    const { error: updateError } = await adminClient
      .from("products")
      .update(productUpdate)
      .eq("id", id);

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    // // console.error("Product update failed:", error);
    return { error: error.message || "Failed to update product" };
  }
}

