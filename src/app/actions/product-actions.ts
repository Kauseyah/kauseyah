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
  subtitle: z.string().optional().nullable(),
  description: z.string().optional(),
  short_description: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  care_instructions: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  specifications: z.any().optional(),
  video_url: z.string().optional().nullable(),
  video_poster_url: z.string().optional().nullable(),
  public_notes: z.string().optional().nullable(),
  internal_notes: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be non-negative"),
  compare_at_price: z.number().nullable().optional(),
  discount_price: z.number().nullable().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional().nullable(),
  category_id: z.string().uuid("Invalid category").optional().nullable(),
  subcategory: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
});

export async function createProduct(formData: FormData) {
  try {
    const adminClient = await getAdminClient();

    // Canonical price resolution:
    // price = selling price
    // compare_at_price = original list price (MSRP)
    const rawPrice = parseFloat(formData.get("price") as string);
    const rawCompareAt = formData.get("compare_at_price") ? parseFloat(formData.get("compare_at_price") as string) : null;
    const rawDiscount = formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null;

    // Validate that compare_at_price > price when provided
    const validatedCompareAt = rawCompareAt && rawCompareAt > rawPrice ? rawCompareAt : (rawDiscount && rawDiscount > rawPrice ? rawDiscount : null);

    const data = {
      name: (formData.get("name") as string)?.trim(),
      slug: (formData.get("slug") as string)?.trim().toLowerCase(),
      subtitle: (formData.get("subtitle") as string)?.trim() || null,
      description: (formData.get("description") as string) || "",
      short_description: (formData.get("short_description") as string)?.trim() || null,
      material: (formData.get("material") as string)?.trim() || null,
      care_instructions: (formData.get("care_instructions") as string)?.trim() || null,
      dimensions: (formData.get("dimensions") as string)?.trim() || null,
      specifications: formData.get("specifications") ? JSON.parse(formData.get("specifications") as string) : [],
      video_url: (formData.get("video_url") as string)?.trim() || null,
      video_poster_url: (formData.get("video_poster_url") as string)?.trim() || null,
      public_notes: (formData.get("public_notes") as string)?.trim() || null,
      internal_notes: (formData.get("internal_notes") as string)?.trim() || null,
      seo_title: (formData.get("seo_title") as string)?.trim() || null,
      seo_description: (formData.get("seo_description") as string)?.trim() || null,
      price: rawPrice,
      compare_at_price: validatedCompareAt,
      discount_price: validatedCompareAt, // Keep legacy field synchronized
      stock: parseInt(formData.get("stock") as string, 10) || 0,
      sku: (formData.get("sku") as string)?.trim() || null,
      category_id: formData.get("category_id") || null,
      subcategory: (formData.get("subcategory") as string)?.trim() || null,
      status: formData.get("status") || "draft",
      featured: formData.get("featured") === "true",
    };

    const validatedData = productSchema.parse(data);

    // Parse variants if provided
    const rawVariants = formData.get("variants") as string;
    let variants: any[] | null = null;
    if (rawVariants) {
      try {
        const parsed = JSON.parse(rawVariants);
        if (Array.isArray(parsed)) {
          variants = parsed.map((v: any, idx: number) => ({
            id: v.id || `var-${Date.now()}-${idx}`,
            size: v.size?.trim() || undefined,
            color: v.color?.trim() || undefined,
            colorHex: v.colorHex || undefined,
            imageUrl: v.imageUrl?.trim() || undefined,
            stock: Math.max(0, parseInt(v.stock, 10) || 0),
            price: typeof v.price === "number" && v.price > 0 ? v.price : undefined,
          }));
        }
      } catch (e) {}
    }

    // If variants with individual stock exist, synchronize parent stock
    if (variants && variants.length > 0 && variants.some((v: any) => typeof v.stock === "number")) {
      const sumVariantStock = variants.reduce(
        (sum: number, v: any) => sum + (typeof v.stock === "number" ? v.stock : 0),
        0
      );
      validatedData.stock = Math.max(0, sumVariantStock);
    }

    // Handle Image Upload & Preservation (supports reordered existing images + new uploads)
    const rawExisting = formData.getAll("existing_images") as string[];
    const existingImages: string[] = [];
    for (const item of rawExisting) {
      if (typeof item === "string" && item.startsWith("[")) {
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) existingImages.push(...parsed);
        } catch (_) {
          existingImages.push(item);
        }
      } else if (item) {
        existingImages.push(item);
      }
    }
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [...existingImages.filter(Boolean)];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        // Enforce maximum 10MB per image
        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error(`Image ${imageFile.name} exceeds maximum allowed size of 10MB`);
        }
        const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || "jpg";
        const fileName = `img_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await adminClient.storage
          .from("product-images")
          .upload(fileName, imageFile, {
            contentType: imageFile.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = adminClient.storage
          .from("product-images")
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Handle Video Upload (subject to 50MB limit and MP4/WebM MIME allowlist)
    const videoFile = formData.get("video_file") as File | null;
    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > 50 * 1024 * 1024) {
        throw new Error("Video file exceeds the maximum allowed limit of 50MB");
      }
      const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedVideoTypes.includes(videoFile.type)) {
        throw new Error("Invalid video format. Supported formats: MP4, WebM.");
      }

      const vidExt = videoFile.name.split('.').pop()?.toLowerCase() || "mp4";
      const vidFileName = `vid_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${vidExt}`;

      const { error: vidUploadErr } = await adminClient.storage
        .from("product-images")
        .upload(vidFileName, videoFile, {
          contentType: videoFile.type,
          upsert: false,
        });

      if (vidUploadErr) {
        throw new Error(`Failed to upload product video: ${vidUploadErr.message}`);
      }

      const { data: vidUrlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(vidFileName);

      validatedData.video_url = vidUrlData.publicUrl;
    }

    // Handle Video Poster Image Upload
    const posterFile = formData.get("video_poster_file") as File | null;
    if (posterFile && posterFile.size > 0) {
      const posterExt = posterFile.name.split('.').pop()?.toLowerCase() || "jpg";
      const posterFileName = `poster_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${posterExt}`;

      const { error: posterErr } = await adminClient.storage
        .from("product-images")
        .upload(posterFileName, posterFile, {
          contentType: posterFile.type || "image/jpeg",
          upsert: false,
        });

      if (!posterErr) {
        const { data: posterUrlData } = adminClient.storage
          .from("product-images")
          .getPublicUrl(posterFileName);
        validatedData.video_poster_url = posterUrlData.publicUrl;
      }
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

    // Insert Product Record
    const productInsert: any = {
      ...validatedData,
      images: imageUrls.length > 0 ? imageUrls : [],
    };
    
    if (variants && variants.length > 0) {
      productInsert.variants = variants;
    }

    const { data: createdProduct, error: insertError } = await adminClient
      .from("products")
      .insert([productInsert])
      .select("id, slug")
      .single();

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath("/collections");
    revalidatePath("/products");
    return { success: true, product: createdProduct };
  } catch (error: any) {
    return { error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const adminClient = await getAdminClient();

    const rawPrice = parseFloat(formData.get("price") as string);
    const rawCompareAt = formData.get("compare_at_price") ? parseFloat(formData.get("compare_at_price") as string) : null;
    const rawDiscount = formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null;

    // Validate that compare_at_price > price when provided
    const validatedCompareAt = rawCompareAt && rawCompareAt > rawPrice ? rawCompareAt : (rawDiscount && rawDiscount > rawPrice ? rawDiscount : null);

    const data = {
      name: (formData.get("name") as string)?.trim(),
      slug: (formData.get("slug") as string)?.trim().toLowerCase(),
      subtitle: (formData.get("subtitle") as string)?.trim() || null,
      description: (formData.get("description") as string) || "",
      short_description: (formData.get("short_description") as string)?.trim() || null,
      material: (formData.get("material") as string)?.trim() || null,
      care_instructions: (formData.get("care_instructions") as string)?.trim() || null,
      dimensions: (formData.get("dimensions") as string)?.trim() || null,
      specifications: formData.get("specifications") ? JSON.parse(formData.get("specifications") as string) : [],
      video_url: (formData.get("video_url") as string)?.trim() || null,
      video_poster_url: (formData.get("video_poster_url") as string)?.trim() || null,
      public_notes: (formData.get("public_notes") as string)?.trim() || null,
      internal_notes: (formData.get("internal_notes") as string)?.trim() || null,
      seo_title: (formData.get("seo_title") as string)?.trim() || null,
      seo_description: (formData.get("seo_description") as string)?.trim() || null,
      price: rawPrice,
      compare_at_price: validatedCompareAt,
      discount_price: validatedCompareAt,
      stock: parseInt(formData.get("stock") as string, 10) || 0,
      sku: (formData.get("sku") as string)?.trim() || null,
      category_id: formData.get("category_id") || null,
      subcategory: (formData.get("subcategory") as string)?.trim() || null,
      status: formData.get("status") || "draft",
      featured: formData.get("featured") === "true",
    };

    // Video removal flag check
    if (formData.get("remove_video") === "true") {
      data.video_url = null;
      data.video_poster_url = null;
    }

    const validatedData = productSchema.parse(data);

    // Parse variants if provided
    const rawVariants = formData.get("variants") as string;
    let variants: any[] | null = null;
    if (rawVariants) {
      try {
        const parsed = JSON.parse(rawVariants);
        if (Array.isArray(parsed)) {
          variants = parsed.map((v: any, idx: number) => ({
            id: v.id || `var-${Date.now()}-${idx}`,
            size: v.size?.trim() || undefined,
            color: v.color?.trim() || undefined,
            colorHex: v.colorHex || undefined,
            imageUrl: v.imageUrl?.trim() || undefined,
            stock: Math.max(0, parseInt(v.stock, 10) || 0),
            price: typeof v.price === "number" && v.price > 0 ? v.price : undefined,
          }));
        }
      } catch (e) {}
    }

    // If variants with individual stock exist, synchronize parent stock
    if (variants && variants.length > 0 && variants.some((v: any) => typeof v.stock === "number")) {
      const sumVariantStock = variants.reduce(
        (sum: number, v: any) => sum + (typeof v.stock === "number" ? v.stock : 0),
        0
      );
      validatedData.stock = Math.max(0, sumVariantStock);
    }

    // Handle Image Upload & Reordering (preserves ordered array)
    const existingImages = formData.getAll("existing_images") as string[];
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [...existingImages.filter(Boolean)];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 10 * 1024 * 1024) {
          throw new Error(`Image ${imageFile.name} exceeds maximum allowed size of 10MB`);
        }
        const fileExt = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `img_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await adminClient.storage
          .from("product-images")
          .upload(fileName, imageFile, {
            contentType: imageFile.type || "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        const { data: publicUrlData } = adminClient.storage
          .from("product-images")
          .getPublicUrl(fileName);
          
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // Handle Video Upload (subject to 50MB limit)
    const videoFile = formData.get("video_file") as File | null;
    if (videoFile && videoFile.size > 0) {
      if (videoFile.size > 50 * 1024 * 1024) {
        throw new Error("Video file exceeds the maximum allowed limit of 50MB");
      }
      const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedVideoTypes.includes(videoFile.type)) {
        throw new Error("Invalid video format. Supported formats: MP4, WebM.");
      }

      const vidExt = videoFile.name.split('.').pop()?.toLowerCase() || "mp4";
      const vidFileName = `vid_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${vidExt}`;

      const { error: vidUploadErr } = await adminClient.storage
        .from("product-images")
        .upload(vidFileName, videoFile, {
          contentType: videoFile.type,
          upsert: false,
        });

      if (vidUploadErr) {
        throw new Error(`Failed to upload product video: ${vidUploadErr.message}`);
      }

      const { data: vidUrlData } = adminClient.storage
        .from("product-images")
        .getPublicUrl(vidFileName);

      validatedData.video_url = vidUrlData.publicUrl;
    }

    // Handle Video Poster Image Upload
    const posterFile = formData.get("video_poster_file") as File | null;
    if (posterFile && posterFile.size > 0) {
      const posterExt = posterFile.name.split('.').pop()?.toLowerCase() || "jpg";
      const posterFileName = `poster_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${posterExt}`;

      const { error: posterErr } = await adminClient.storage
        .from("product-images")
        .upload(posterFileName, posterFile, {
          contentType: posterFile.type || "image/jpeg",
          upsert: false,
        });

      if (!posterErr) {
        const { data: posterUrlData } = adminClient.storage
          .from("product-images")
          .getPublicUrl(posterFileName);
        validatedData.video_poster_url = posterUrlData.publicUrl;
      }
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

    // Prepare Update payload
    const productUpdate: any = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    };

    if (imageUrls.length > 0) {
      productUpdate.images = imageUrls;
    } else if (existingImages.length === 0 && imageFiles.some(f => f.size > 0) === false) {
      productUpdate.images = [];
    }
    
    if (variants) {
      productUpdate.variants = variants;
    }

    const { error: updateError } = await adminClient
      .from("products")
      .update(productUpdate)
      .eq("id", id);

    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/collections");
    revalidatePath("/products");
    if (validatedData.slug) {
      revalidatePath(`/products/${validatedData.slug}`);
    }
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update product" };
  }
}
