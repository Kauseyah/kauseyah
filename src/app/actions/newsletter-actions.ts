"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { sendCraftJournalWelcomeEmail, sendNewsletterCampaignEmail } from "@/lib/email";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

// 1. PUBLIC SUBSCRIPTION ACTION
export async function subscribeToNewsletter(payload: {
  email: string;
  firstName?: string;
  consent: boolean;
  honeypot?: string;
  loadTime?: number;
}) {
  const { email, firstName, consent, honeypot, loadTime } = payload;

  // Honeypot trap: bots fill hidden fields
  if (honeypot && honeypot.trim().length > 0) {
    return { success: true, message: "Thank you for subscribing to The Kauseyah Craft Journal." };
  }

  // Rate limiting / fast bot trap: humans take > 700ms to load & fill form
  if (loadTime && Date.now() - loadTime < 700) {
    return { success: true, message: "Thank you for subscribing to The Kauseyah Craft Journal." };
  }

  // Marketing consent check
  if (!consent) {
    return { error: "Please agree to receive updates to subscribe to the Journal." };
  }

  // Email format validation & normalization
  const normalizedEmail = (email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail) || normalizedEmail.length > 254) {
    return { error: "Please enter a valid email address." };
  }

  const cleanFirstName = firstName ? firstName.trim().slice(0, 100) : "";

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Check if table exists / fetch subscriber
    const { data: existing, error: fetchError } = await adminClient
      .from("newsletter_subscribers")
      .select("id, status, unsubscribe_token")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (fetchError && fetchError.message.includes("Could not find the table")) {
      // Table migration not yet applied in Supabase: log diagnostic and return friendly response
      console.warn("newsletter_subscribers table not yet created in Supabase. Migration pending.");
      // Attempt welcome email directly
      sendCraftJournalWelcomeEmail(normalizedEmail, cleanFirstName).catch(() => {});
      return {
        success: true,
        message: "Welcome to The Kauseyah Craft Journal! Check your inbox for our latest stories.",
      };
    }

    let token = existing?.unsubscribe_token || crypto.randomUUID();

    if (existing) {
      if (existing.status === "active") {
        return {
          success: true,
          message: "You are already subscribed to The Kauseyah Craft Journal.",
        };
      } else {
        // Re-activate previously unsubscribed contact
        await adminClient
          .from("newsletter_subscribers")
          .update({
            status: "active",
            consent_given: true,
            consent_timestamp: new Date().toISOString(),
            first_name: cleanFirstName || undefined,
            unsubscribed_at: null,
          })
          .eq("id", existing.id);
      }
    } else {
      // New subscription
      await adminClient.from("newsletter_subscribers").insert({
        email: normalizedEmail,
        first_name: cleanFirstName || null,
        status: "active",
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        source: "craft_journal_section",
        unsubscribe_token: token,
      });

      // Also record in marketing_consent_records
      try {
        await adminClient.from("marketing_consent_records").insert({
          email: normalizedEmail,
          consent_type: "craft_journal_newsletter",
          consent_text: "I would like to receive The Kauseyah Craft Journal and stories on indigenous craft heritage.",
          consent_given: true,
          timestamp: new Date().toISOString(),
        });
      } catch (_) {}
    }

    // Send welcome email via Resend
    sendCraftJournalWelcomeEmail(normalizedEmail, cleanFirstName, token).catch((e) => {
      console.error("Failed to send welcome email:", e);
    });

    return {
      success: true,
      message: "Welcome to The Kauseyah Craft Journal! Your welcome note is on its way to your inbox.",
    };
  } catch (error: any) {
    console.error("Subscription error:", error);
    return {
      error: "Unable to process subscription right now. Please try again later.",
    };
  }
}

// 2. ADMIN AUTH HELPER
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { authorized: false, error: "Unauthorized. Please log in." };

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleData?.role !== "admin") {
    return { authorized: false, error: "Unauthorized. Admin privileges required." };
  }

  return { authorized: true, user };
}

// 3. ADMIN: GET SUBSCRIBERS
export async function getNewsletterSubscribers(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = adminClient
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    if (params?.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    if (params?.search) {
      const q = params.search.trim().toLowerCase();
      query = query.or(`email.ilike.%${q}%,first_name.ilike.%${q}%`);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      if (error.message.includes("Could not find the table")) {
        return {
          subscribers: [],
          total: 0,
          stats: { active: 0, unsubscribed: 0, bounced: 0, total: 0 },
          migrationNeeded: true,
        };
      }
      return { error: error.message };
    }

    // Get status breakdown counts
    const { count: activeCount } = await adminClient
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: unsubCount } = await adminClient
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "unsubscribed");

    return {
      subscribers: data || [],
      total: count || 0,
      stats: {
        active: activeCount || 0,
        unsubscribed: unsubCount || 0,
        bounced: 0,
        total: (activeCount || 0) + (unsubCount || 0),
      },
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

// 4. ADMIN: EXPORT SUBSCRIBERS CSV
export async function exportSubscribersCSV() {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await adminClient
      .from("newsletter_subscribers")
      .select("email, first_name, status, consent_given, consent_timestamp, source, created_at")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };

    const headers = ["Email", "First Name", "Status", "Consent Given", "Consent Timestamp", "Source", "Subscribed Date"];
    const rows = (data || []).map((row) => [
      `"${row.email}"`,
      `"${row.first_name || ""}"`,
      `"${row.status}"`,
      `"${row.consent_given ? "Yes" : "No"}"`,
      `"${row.consent_timestamp || ""}"`,
      `"${row.source || ""}"`,
      `"${row.created_at || ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, csv: csvContent };
  } catch (err: any) {
    return { error: err.message };
  }
}

// 5. ADMIN: IMPORT SUBSCRIBERS FROM CSV
export async function importSubscribersFromCSV(csvText: string, confirmImport = false) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { error: "CSV is empty or contains no data rows." };
  }

  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(",").map((h) => h.replace(/["']/g, "").trim());
  const emailIdx = headers.findIndex((h) => h.includes("email"));
  const nameIdx = headers.findIndex((h) => h.includes("name") || h.includes("first"));
  const consentIdx = headers.findIndex((h) => h.includes("consent") || h.includes("opt"));

  if (emailIdx === -1) {
    return { error: "CSV must contain an 'email' column." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seenInCsv = new Set<string>();
  const validRecords: Array<{ email: string; firstName?: string; consent: boolean }> = [];
  const invalidRows: Array<{ row: number; email: string; reason: string }> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(",").map((c) => c.replace(/^["']|["']$/g, "").trim());
    const rawEmail = (rawCols[emailIdx] || "").toLowerCase().trim();
    const rawName = nameIdx !== -1 ? rawCols[nameIdx] : "";
    const rawConsent = consentIdx !== -1 ? (rawCols[consentIdx] || "").toLowerCase() : "true";

    if (!rawEmail || !emailRegex.test(rawEmail)) {
      invalidRows.push({ row: i, email: rawEmail, reason: "Invalid email syntax" });
      continue;
    }

    if (seenInCsv.has(rawEmail)) {
      invalidRows.push({ row: i, email: rawEmail, reason: "Duplicate in file" });
      continue;
    }

    // Consent evaluation: values like 'yes', 'true', '1', 'opted-in', or default
    const hasConsent = ["yes", "true", "1", "opted_in", "y"].includes(rawConsent) || consentIdx === -1;

    seenInCsv.add(rawEmail);
    validRecords.push({
      email: rawEmail,
      firstName: rawName || undefined,
      consent: hasConsent,
    });
  }

  // Check against DB for existing subscribers
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let existingInDb = new Set<string>();
  try {
    const { data: existingRows } = await adminClient
      .from("newsletter_subscribers")
      .select("email")
      .in(
        "email",
        validRecords.map((r) => r.email)
      );
    if (existingRows) {
      existingInDb = new Set(existingRows.map((r) => r.email.toLowerCase()));
    }
  } catch (_) {}

  const readyToImport = validRecords.filter((r) => !existingInDb.has(r.email) && r.consent);
  const duplicatesCount = validRecords.filter((r) => existingInDb.has(r.email)).length;
  const noConsentCount = validRecords.filter((r) => !r.consent).length;

  // If preview only, return preview metrics
  if (!confirmImport) {
    return {
      preview: true,
      totalRows: lines.length - 1,
      validCount: validRecords.length,
      readyToImportCount: readyToImport.length,
      existingDuplicates: duplicatesCount,
      missingConsentCount: noConsentCount,
      invalidCount: invalidRows.length,
      sample: readyToImport.slice(0, 5),
    };
  }

  // Execute import
  try {
    const recordsToInsert = readyToImport.map((r) => ({
      email: r.email,
      first_name: r.firstName || null,
      status: "active",
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      source: "csv_import",
      unsubscribe_token: crypto.randomUUID(),
    }));

    if (recordsToInsert.length > 0) {
      const { error } = await adminClient.from("newsletter_subscribers").insert(recordsToInsert);
      if (error) return { error: error.message };
    }

    revalidatePath("/admin/newsletter");
    return {
      success: true,
      importedCount: recordsToInsert.length,
      skippedDuplicates: duplicatesCount,
      skippedNoConsent: noConsentCount,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

// 6A. ADMIN: CREATE CAMPAIGN
export async function createNewsletterCampaign(data: {
  title: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
}) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const { title, subject, previewText, contentHtml } = data;
  if (!subject || !contentHtml) {
    return { error: "Subject line and email content are required." };
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { count: eligibleCount, error: countError } = await adminClient
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("consent_given", true);

    if (countError && countError.message.includes("Could not find the table")) {
      return { error: "Database migration not yet applied in Supabase." };
    }

    if (!eligibleCount || eligibleCount === 0) {
      return { error: "No active subscribers with explicit marketing consent found." };
    }

    const { data: campaign, error: campaignError } = await adminClient
      .from("newsletter_campaigns")
      .insert({
        title: title || subject,
        subject,
        preview_text: previewText || null,
        content_html: contentHtml,
        status: "sending",
        recipient_count: eligibleCount,
        sent_count: 0,
        failed_count: 0,
      })
      .select()
      .single();

    if (campaignError) return { error: campaignError.message };

    return {
      success: true,
      campaignId: campaign.id,
      totalRecipients: eligibleCount,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

// 6B. ADMIN: PROCESS CAMPAIGN BATCH (SAFE FOR SERVERLESS TIMEOUTS & RATE LIMITS)
export async function sendNewsletterCampaignBatch(campaignId: string, batchSize = 15) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: campaign, error: campError } = await adminClient
      .from("newsletter_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campError || !campaign) return { error: "Campaign not found." };

    // Get list of emails already logged for this campaign to prevent duplicates
    const { data: sentLogs } = await adminClient
      .from("newsletter_campaign_logs")
      .select("email")
      .eq("campaign_id", campaignId);

    const sentEmails = new Set((sentLogs || []).map((l) => l.email.toLowerCase()));

    // Fetch next eligible batch of recipients who haven't been sent to yet
    const { data: allActive, error: subError } = await adminClient
      .from("newsletter_subscribers")
      .select("id, email, first_name, unsubscribe_token")
      .eq("status", "active")
      .eq("consent_given", true);

    if (subError) return { error: subError.message };

    const remainingRecipients = (allActive || []).filter(
      (r) => !sentEmails.has(r.email.toLowerCase())
    );

    if (remainingRecipients.length === 0) {
      // All recipients processed! Complete the campaign
      await adminClient
        .from("newsletter_campaigns")
        .update({
          status: "sent",
          sent_at: campaign.sent_at || new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq("id", campaignId);

      revalidatePath("/admin/newsletter");
      return {
        done: true,
        campaignId,
        sentCount: campaign.sent_count,
        failedCount: campaign.failed_count,
        totalRecipients: campaign.recipient_count || campaign.total_recipients,
      };
    }

    const batch = remainingRecipients.slice(0, batchSize);
    let batchSent = 0;
    let batchFailed = 0;

    for (const recipient of batch) {
      const sendRes = await sendNewsletterCampaignEmail({
        to: recipient.email,
        recipientName: recipient.first_name || undefined,
        subject: campaign.subject,
        previewText: campaign.preview_text || undefined,
        contentHtml: campaign.content_html,
        campaignId: campaign.id,
        unsubscribeToken: recipient.unsubscribe_token || crypto.randomUUID(),
      });

      if (sendRes.success) {
        batchSent++;
        await adminClient.from("newsletter_campaign_logs").insert({
          campaign_id: campaignId,
          subscriber_id: recipient.id,
          email: recipient.email,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
      } else {
        batchFailed++;
        await adminClient.from("newsletter_campaign_logs").insert({
          campaign_id: campaignId,
          subscriber_id: recipient.id,
          email: recipient.email,
          status: "failed",
          error_message: String(sendRes.error || "Delivery failure"),
        });
      }

      // Small 200ms throttle between individual requests
      await new Promise((r) => setTimeout(r, 200));
    }

    const newSentCount = (campaign.sent_count || 0) + batchSent;
    const newFailedCount = (campaign.failed_count || 0) + batchFailed;

    await adminClient
      .from("newsletter_campaigns")
      .update({
        sent_count: newSentCount,
        failed_count: newFailedCount,
      })
      .eq("id", campaignId);

    const isNowDone = remainingRecipients.length - batch.length === 0;
    if (isNowDone) {
      await adminClient
        .from("newsletter_campaigns")
        .update({
          status: "sent",
          sent_at: campaign.sent_at || new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq("id", campaignId);
      revalidatePath("/admin/newsletter");
    }

    return {
      done: isNowDone,
      campaignId,
      processedInBatch: batch.length,
      sentInBatch: batchSent,
      failedInBatch: batchFailed,
      totalSent: newSentCount,
      totalFailed: newFailedCount,
      remainingCount: Math.max(0, remainingRecipients.length - batch.length),
      totalRecipients: campaign.recipient_count || campaign.total_recipients,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

// 6C. ADMIN: SEND NEWSLETTER CAMPAIGN WRAPPER
export async function sendNewsletterCampaign(data: {
  title: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
}) {
  const created = await createNewsletterCampaign(data);
  if (created.error || !created.campaignId) {
    return { error: created.error };
  }

  let isDone = false;
  let lastRes: any = null;
  while (!isDone) {
    const batchRes = await sendNewsletterCampaignBatch(created.campaignId, 20);
    if (batchRes.error) {
      return { error: batchRes.error };
    }
    lastRes = batchRes;
    isDone = Boolean(batchRes.done);
  }

  return {
    success: true,
    sentCount: lastRes?.totalSent || 0,
    failedCount: lastRes?.totalFailed || 0,
    totalRecipients: lastRes?.totalRecipients || 0,
  };
}
