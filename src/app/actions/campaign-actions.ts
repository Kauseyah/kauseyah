"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Type definitions
export type CampaignStatus = "draft" | "active" | "inactive";
export type CampaignType = "festive" | "seasonal" | "promotional" | "product_launch" | "special_collection" | "general";

export interface HomepageBanner {
  id: string;
  campaign_name: string;
  campaign_type: CampaignType;
  heading: string;
  subtitle?: string | null;
  description?: string | null;
  desktop_image_url: string;
  mobile_image_url?: string | null;
  image_alt?: string | null;
  offer_text?: string | null;
  discount_label?: string | null;
  offer_code?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  status: CampaignStatus;
  start_at?: string | null;
  end_at?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementBarItem {
  id: string;
  internal_name: string;
  message: string;
  cta_text?: string | null;
  cta_url?: string | null;
  background_color: string;
  text_color: string;
  status: CampaignStatus;
  start_at?: string | null;
  end_at?: string | null;
  priority: number;
  display_order: number;
  is_dismissible: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── ADMIN AUTHORIZATION GUARD ──────────────────────────────────────────────

async function verifyAdminAuth() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized: Authentication required");
  }

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || roleData?.role !== "admin") {
    throw new Error("Forbidden: Administrator access required");
  }

  return { user, supabase };
}

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── SANITIZATION & VALIDATION HELPERS ──────────────────────────────────────

function validateUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Disallow dangerous schemes
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    throw new Error("Invalid URL: Unsafe URL scheme detected");
  }

  // Allow relative paths (e.g. /collections/sarees) or absolute http/https
  if (trimmed.startsWith("/") || trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  // If path doesn't start with slash or http, normalize to relative path
  return `/${trimmed}`;
}

function validateColorHex(color?: string | null, defaultColor: string = "#851A36"): string {
  if (!color || typeof color !== "string") return defaultColor;
  const trimmed = color.trim();
  // Validates standard 3, 6 or 8 character hex codes
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  if (hexRegex.test(trimmed)) {
    return trimmed;
  }
  return defaultColor;
}

function validateDateRange(start?: string | null, end?: string | null) {
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (start && start.trim()) {
    startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      throw new Error("Invalid start date format");
    }
  }

  if (end && end.trim()) {
    endDate = new Date(end);
    if (isNaN(endDate.getTime())) {
      throw new Error("Invalid end date format");
    }
  }

  if (startDate && endDate && endDate <= startDate) {
    throw new Error("End date must be later than start date");
  }

  return {
    start_at: startDate ? startDate.toISOString() : null,
    end_at: endDate ? endDate.toISOString() : null,
  };
}

// ─── STORAGE HELPER ─────────────────────────────────────────────────────────

async function uploadCampaignImage(file: File, folder: string = "campaign-banners"): Promise<string> {
  // Validate file type
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    throw new Error(`Invalid file type (${file.type}). Allowed formats: JPG, PNG, WebP, AVIF`);
  }

  // Validate size (max 5 MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds 5 MB limit`);
  }

  const adminClient = getAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

  const { error: uploadError } = await adminClient.storage
    .from("product-images")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: publicData } = adminClient.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}

// ============================================================================
// FEATURE A: HOMEPAGE BANNERS
// ============================================================================

/**
 * Public: Fetch currently eligible, active banners for the storefront.
 * Gracefully returns empty array if tables are pending migration.
 */
export async function getEligibleBanners(): Promise<HomepageBanner[]> {
  try {
    const adminClient = getAdminClient();
    const nowIso = new Date().toISOString();

    const { data, error } = await adminClient
      .from("homepage_banners")
      .select("*")
      .eq("status", "active")
      .or(`start_at.is.null,start_at.lte.${nowIso}`)
      .or(`end_at.is.null,end_at.gte.${nowIso}`)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist yet, fail gracefully without breaking homepage
      return [];
    }

    return (data || []) as HomepageBanner[];
  } catch (_) {
    return [];
  }
}

/**
 * Admin: Fetch all banners regardless of status.
 */
export async function getAllBanners(): Promise<{ data: HomepageBanner[]; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("homepage_banners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data || []) as HomepageBanner[] };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
}

/**
 * Admin: Fetch single banner by ID.
 */
export async function getBannerById(id: string): Promise<{ data: HomepageBanner | null; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("homepage_banners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as HomepageBanner };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

/**
 * Admin: Create a new homepage banner.
 */
export async function createBanner(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { user } = await verifyAdminAuth();
    const adminClient = getAdminClient();

    const campaign_name = String(formData.get("campaign_name") || "").trim();
    const campaign_type = (String(formData.get("campaign_type") || "general").trim()) as CampaignType;
    const heading = String(formData.get("heading") || "").trim();
    const subtitle = String(formData.get("subtitle") || "").trim() || null;
    const description = String(formData.get("description") || "").trim() || null;
    const image_alt = String(formData.get("image_alt") || heading).trim() || null;
    const offer_text = String(formData.get("offer_text") || "").trim() || null;
    const discount_label = String(formData.get("discount_label") || "").trim() || null;
    const offer_code = String(formData.get("offer_code") || "").trim() || null;
    const cta_text = String(formData.get("cta_text") || "").trim() || null;
    const cta_url = validateUrl(formData.get("cta_url") as string);
    const status = (String(formData.get("status") || "draft").trim()) as CampaignStatus;
    const display_order = parseInt(String(formData.get("display_order") || "0"), 10) || 0;

    if (!campaign_name) {
      return { success: false, error: "Campaign name is required" };
    }
    if (!heading) {
      return { success: false, error: "Main heading is required" };
    }

    // Scheduling
    const rawStart = formData.get("start_at") as string;
    const rawEnd = formData.get("end_at") as string;
    const { start_at, end_at } = validateDateRange(rawStart, rawEnd);

    // Desktop Image handling
    let desktop_image_url = String(formData.get("desktop_image_url") || "").trim();
    const desktopFile = formData.get("desktop_image_file") as File | null;
    if (desktopFile && desktopFile.size > 0) {
      desktop_image_url = await uploadCampaignImage(desktopFile, "campaign-banners/desktop");
    }

    if (!desktop_image_url) {
      return { success: false, error: "Desktop banner image is required" };
    }

    // Mobile Image handling (optional)
    let mobile_image_url = String(formData.get("mobile_image_url") || "").trim() || null;
    const mobileFile = formData.get("mobile_image_file") as File | null;
    if (mobileFile && mobileFile.size > 0) {
      mobile_image_url = await uploadCampaignImage(mobileFile, "campaign-banners/mobile");
    }

    const payload = {
      campaign_name,
      campaign_type,
      heading,
      subtitle,
      description,
      desktop_image_url,
      mobile_image_url,
      image_alt,
      offer_text,
      discount_label,
      offer_code,
      cta_text,
      cta_url,
      status,
      start_at,
      end_at,
      display_order,
      created_by: user.id,
    };

    const { data, error } = await adminClient
      .from("homepage_banners")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to create banner: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/banners");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Update an existing banner.
 */
export async function updateBanner(id: string, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const campaign_name = String(formData.get("campaign_name") || "").trim();
    const campaign_type = (String(formData.get("campaign_type") || "general").trim()) as CampaignType;
    const heading = String(formData.get("heading") || "").trim();
    const subtitle = String(formData.get("subtitle") || "").trim() || null;
    const description = String(formData.get("description") || "").trim() || null;
    const image_alt = String(formData.get("image_alt") || heading).trim() || null;
    const offer_text = String(formData.get("offer_text") || "").trim() || null;
    const discount_label = String(formData.get("discount_label") || "").trim() || null;
    const offer_code = String(formData.get("offer_code") || "").trim() || null;
    const cta_text = String(formData.get("cta_text") || "").trim() || null;
    const cta_url = validateUrl(formData.get("cta_url") as string);
    const status = (String(formData.get("status") || "draft").trim()) as CampaignStatus;
    const display_order = parseInt(String(formData.get("display_order") || "0"), 10) || 0;

    if (!campaign_name) {
      return { success: false, error: "Campaign name is required" };
    }
    if (!heading) {
      return { success: false, error: "Main heading is required" };
    }

    const rawStart = formData.get("start_at") as string;
    const rawEnd = formData.get("end_at") as string;
    const { start_at, end_at } = validateDateRange(rawStart, rawEnd);

    // Desktop Image handling
    let desktop_image_url = String(formData.get("desktop_image_url") || "").trim();
    const desktopFile = formData.get("desktop_image_file") as File | null;
    if (desktopFile && desktopFile.size > 0) {
      desktop_image_url = await uploadCampaignImage(desktopFile, "campaign-banners/desktop");
    }

    if (!desktop_image_url) {
      return { success: false, error: "Desktop banner image is required" };
    }

    // Mobile Image handling
    let mobile_image_url = String(formData.get("mobile_image_url") || "").trim() || null;
    const mobileFile = formData.get("mobile_image_file") as File | null;
    if (mobileFile && mobileFile.size > 0) {
      mobile_image_url = await uploadCampaignImage(mobileFile, "campaign-banners/mobile");
    }

    const payload = {
      campaign_name,
      campaign_type,
      heading,
      subtitle,
      description,
      desktop_image_url,
      mobile_image_url,
      image_alt,
      offer_text,
      discount_label,
      offer_code,
      cta_text,
      cta_url,
      status,
      start_at,
      end_at,
      display_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await adminClient
      .from("homepage_banners")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to update banner: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/banners");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Duplicate an existing banner (starts as Draft).
 */
export async function duplicateBanner(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { user } = await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data: source, error: fetchErr } = await adminClient
      .from("homepage_banners")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !source) {
      return { success: false, error: "Source banner not found" };
    }

    const duplicatePayload = {
      ...source,
      id: undefined,
      campaign_name: `Copy of ${source.campaign_name}`,
      status: "draft" as CampaignStatus,
      display_order: (source.display_order || 0) + 1,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    delete duplicatePayload.id;

    const { data, error } = await adminClient
      .from("homepage_banners")
      .insert(duplicatePayload)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to duplicate banner: ${error.message}` };
    }

    revalidatePath("/admin/campaigns/banners");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Toggle banner status.
 */
export async function updateBannerStatus(id: string, status: CampaignStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from("homepage_banners")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/banners");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Reorder banners.
 */
export async function reorderBanners(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await adminClient
        .from("homepage_banners")
        .update({ display_order: index, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/banners");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Delete a banner.
 */
export async function deleteBanner(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from("homepage_banners")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/banners");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================================================
// FEATURE B: PROMOTIONAL ANNOUNCEMENT BAR
// ============================================================================

/**
 * Public: Fetch currently eligible announcements for the storefront.
 * Gracefully returns empty array if tables are pending migration.
 */
export async function getEligibleAnnouncements(): Promise<AnnouncementBarItem[]> {
  try {
    const adminClient = getAdminClient();
    const nowIso = new Date().toISOString();

    const { data, error } = await adminClient
      .from("announcement_bars")
      .select("*")
      .eq("status", "active")
      .or(`start_at.is.null,start_at.lte.${nowIso}`)
      .or(`end_at.is.null,end_at.gte.${nowIso}`)
      .order("priority", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data || []) as AnnouncementBarItem[];
  } catch (_) {
    return [];
  }
}

/**
 * Admin: Fetch all announcements.
 */
export async function getAllAnnouncements(): Promise<{ data: AnnouncementBarItem[]; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("announcement_bars")
      .select("*")
      .order("priority", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data || []) as AnnouncementBarItem[] };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
}

/**
 * Admin: Fetch announcement by ID.
 */
export async function getAnnouncementById(id: string): Promise<{ data: AnnouncementBarItem | null; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("announcement_bars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as AnnouncementBarItem };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

/**
 * Admin: Create an announcement.
 */
export async function createAnnouncement(formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { user } = await verifyAdminAuth();
    const adminClient = getAdminClient();

    const internal_name = String(formData.get("internal_name") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const cta_text = String(formData.get("cta_text") || "").trim() || null;
    const cta_url = validateUrl(formData.get("cta_url") as string);
    const background_color = validateColorHex(formData.get("background_color") as string, "#851A36");
    const text_color = validateColorHex(formData.get("text_color") as string, "#FFFFFF");
    const status = (String(formData.get("status") || "draft").trim()) as CampaignStatus;
    const priority = parseInt(String(formData.get("priority") || "0"), 10) || 0;
    const display_order = parseInt(String(formData.get("display_order") || "0"), 10) || 0;
    const is_dismissible = formData.get("is_dismissible") === "true";

    if (!internal_name) {
      return { success: false, error: "Internal announcement name is required" };
    }
    if (!message) {
      return { success: false, error: "Visible announcement message is required" };
    }

    const rawStart = formData.get("start_at") as string;
    const rawEnd = formData.get("end_at") as string;
    const { start_at, end_at } = validateDateRange(rawStart, rawEnd);

    const payload = {
      internal_name,
      message,
      cta_text,
      cta_url,
      background_color,
      text_color,
      status,
      start_at,
      end_at,
      priority,
      display_order,
      is_dismissible,
      created_by: user.id,
    };

    const { data, error } = await adminClient
      .from("announcement_bars")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to create announcement: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/announcements");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Update announcement.
 */
export async function updateAnnouncement(id: string, formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const internal_name = String(formData.get("internal_name") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const cta_text = String(formData.get("cta_text") || "").trim() || null;
    const cta_url = validateUrl(formData.get("cta_url") as string);
    const background_color = validateColorHex(formData.get("background_color") as string, "#851A36");
    const text_color = validateColorHex(formData.get("text_color") as string, "#FFFFFF");
    const status = (String(formData.get("status") || "draft").trim()) as CampaignStatus;
    const priority = parseInt(String(formData.get("priority") || "0"), 10) || 0;
    const display_order = parseInt(String(formData.get("display_order") || "0"), 10) || 0;
    const is_dismissible = formData.get("is_dismissible") === "true";

    if (!internal_name) {
      return { success: false, error: "Internal announcement name is required" };
    }
    if (!message) {
      return { success: false, error: "Visible announcement message is required" };
    }

    const rawStart = formData.get("start_at") as string;
    const rawEnd = formData.get("end_at") as string;
    const { start_at, end_at } = validateDateRange(rawStart, rawEnd);

    const payload = {
      internal_name,
      message,
      cta_text,
      cta_url,
      background_color,
      text_color,
      status,
      start_at,
      end_at,
      priority,
      display_order,
      is_dismissible,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await adminClient
      .from("announcement_bars")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to update announcement: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/announcements");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Duplicate announcement (starts as Draft).
 */
export async function duplicateAnnouncement(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { user } = await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { data: source, error: fetchErr } = await adminClient
      .from("announcement_bars")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !source) {
      return { success: false, error: "Source announcement not found" };
    }

    const duplicatePayload = {
      ...source,
      id: undefined,
      internal_name: `Copy of ${source.internal_name}`,
      status: "draft" as CampaignStatus,
      display_order: (source.display_order || 0) + 1,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    delete duplicatePayload.id;

    const { data, error } = await adminClient
      .from("announcement_bars")
      .insert(duplicatePayload)
      .select()
      .single();

    if (error) {
      return { success: false, error: `Failed to duplicate announcement: ${error.message}` };
    }

    revalidatePath("/admin/campaigns/announcements");
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Toggle announcement status.
 */
export async function updateAnnouncementStatus(id: string, status: CampaignStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from("announcement_bars")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/announcements");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Reorder announcements.
 */
export async function reorderAnnouncements(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await adminClient
        .from("announcement_bars")
        .update({ display_order: index, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/announcements");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin: Delete announcement.
 */
export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdminAuth();
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from("announcement_bars")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/campaigns/announcements");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
