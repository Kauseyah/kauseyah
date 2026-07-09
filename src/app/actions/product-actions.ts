"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
  const supabase = await createClient();
  
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
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Insert Product
    const productInsert = {
      ...validatedData,
      images: imageUrl ? [imageUrl] : [],
    };

    const { error: insertError } = await supabase
      .from("products")
      .insert([productInsert]);

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Product creation failed:", error);
    return { error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  
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

    // Handle Image Upload (only update if a new image is provided)
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Update Product
    const productUpdate: any = { ...validatedData };
    if (imageUrl) {
      // For simplicity, replacing images array with new image
      productUpdate.images = [imageUrl];
    }

    const { error: updateError } = await supabase
      .from("products")
      .update(productUpdate)
      .eq("id", id);

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Product update failed:", error);
    return { error: error.message || "Failed to update product" };
  }
}

