"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
  sendCraftJournalWelcomeEmail,
  sendNewsletterCampaignEmail,
} from "@/lib/newsletter-email";
import {
  escapeForCsvExport,
  hashClientIp,
  parseCsvRfc4180,
  parseRateLimitRpcResponse,
  validateNewsletterSubscriptionInput,
} from "@/lib/newsletter-utils";
import crypto from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// 0. SECURITY & HELPER UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves an anonymized, salted SHA-256 IP hash for serverless rate-limiting and audit trails.
 * Inspects trusted platform proxy headers (x-real-ip -> x-vercel-forwarded-for -> cf-connecting-ip -> x-forwarded-for first IP).
 * Never stores or exposes raw IP addresses to protect user privacy.
 * Returns empty string if IP cannot be verified (handled as fail-closed downstream).
 */
async function resolveClientIpHash(): Promise<string> {
  try {
    const headerList = await headers();
    const realIp = headerList.get("x-real-ip");
    const vercelIp = headerList.get("x-vercel-forwarded-for");
    const cfIp = headerList.get("cf-connecting-ip");
    const forwarded = headerList.get("x-forwarded-for");
    const rawIp =
      realIp ||
      vercelIp ||
      cfIp ||
      (forwarded ? forwarded.split(",")[0].trim() : "");
    return hashClientIp(rawIp, process.env.SUPABASE_SERVICE_ROLE_KEY);
  } catch (_) {
    return "";
  }
}

/**
 * In-memory sliding window cache to prevent microsecond concurrent burst attacks on the same instance.
 */
interface MemoryRateLimit {
  attempts: number;
  resetAt: number;
}
const inMemoryRateLimits = new Map<string, MemoryRateLimit>();

function checkMemoryBurstLimit(ipHash: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  if (!ipHash || ipHash === "unknown") return false;
  const now = Date.now();
  if (inMemoryRateLimits.size > 10000) {
    for (const [key, val] of inMemoryRateLimits.entries()) {
      if (now > val.resetAt) inMemoryRateLimits.delete(key);
    }
  }
  const entry = inMemoryRateLimits.get(ipHash);
  if (!entry || now > entry.resetAt) {
    inMemoryRateLimits.set(ipHash, { attempts: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.attempts >= limit) {
    return false;
  }
  entry.attempts++;
  return true;
}

/**
 * Checks persistent rate limits in Supabase PostgreSQL across all serverless lambdas.
 * Invokes atomic check_and_record_newsletter_rate_limit RPC as the authoritative gate.
 * Eliminates all unsafe fallbacks and fails closed on errors or missing client identity.
 */
async function checkServerlessRateLimit(
  adminClient: any,
  ipHash: string,
  maxAttempts = 5,
  windowMinutes = 15
): Promise<{ allowed: boolean; error?: string }> {
  // Missing or unverifiable IP: Fail closed without storing or bypassing
  if (!ipHash || ipHash === "unknown") {
    return {
      allowed: false,
      error: "Unable to verify network security. Please refresh the page and try again.",
    };
  }

  // First check in-memory burst shield
  if (!checkMemoryBurstLimit(ipHash, maxAttempts, windowMinutes * 60 * 1000)) {
    return {
      allowed: false,
      error: "Too many subscription attempts from your network. Please wait a few minutes before trying again.",
    };
  }

  // Primary: Atomic PostgreSQL Rate Limiting RPC
  try {
    const { data, error } = await adminClient.rpc("check_and_record_newsletter_rate_limit", {
      p_ip_hash: ipHash,
      p_max_attempts: maxAttempts,
      p_window_minutes: windowMinutes,
    });

    if (error) {
      console.warn("[Newsletter] Persistent rate limit RPC warning:", error.message);
    }

    return parseRateLimitRpcResponse(data, error);
  } catch (err: any) {
    console.warn("[Newsletter] Rate limit RPC execution exception:", err?.message || err);
    return {
      allowed: false,
      error: "Subscription service is temporarily unavailable. Please try again in a few moments.",
    };
  }
}



// ─────────────────────────────────────────────────────────────────────────────
// 1. PUBLIC SUBSCRIPTION ACTION
// ─────────────────────────────────────────────────────────────────────────────

export async function subscribeToNewsletter(payload: {
  email: string;
  firstName?: string;
  consent: boolean;
  honeypot?: string;
  loadTime?: number;
}) {
  const validation = validateNewsletterSubscriptionInput(payload);

  // Bot defenses: Silent drop
  if (validation.isBot) {
    return { success: true, message: "Thank you for subscribing to The Kauseyah Craft Journal." };
  }

  if (!validation.valid || !validation.normalizedEmail) {
    return { error: validation.error || "Please enter a valid email address." };
  }

  const normalizedEmail = validation.normalizedEmail;
  const cleanFirstName = validation.cleanFirstName || "";

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Server-Side Distributed Rate Limiting (Dual-Layer)
  const clientIpHash = await resolveClientIpHash();
  const rateLimitCheck = await checkServerlessRateLimit(adminClient, clientIpHash, 5, 15);
  if (!rateLimitCheck.allowed) {
    return { error: rateLimitCheck.error || "Too many attempts. Please try again later." };
  }

  try {
    const { data: existing, error: fetchError } = await adminClient
      .from("newsletter_subscribers")
      .select("id, status, unsubscribe_token, consent_given, first_name, unsubscribed_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (fetchError) {
      if (fetchError.message.includes("Could not find the table")) {
        console.warn("newsletter_subscribers table not yet created in Supabase. Migration pending.");
        return {
          error: "Newsletter service is temporarily undergoing scheduled database setup. Please try again shortly.",
        };
      }
      return { error: "Unable to verify subscription status. Please try again later." };
    }

    const token = existing?.unsubscribe_token || crypto.randomUUID();

    if (existing) {
      if (existing.status === "active") {
        return {
          success: true,
          message: "You are already subscribed to The Kauseyah Craft Journal.",
        };
      } else {
        // Re-activate previously unsubscribed subscriber
        const { error: updateError } = await adminClient
          .from("newsletter_subscribers")
          .update({
            status: "active",
            consent_given: true,
            consent_timestamp: new Date().toISOString(),
            first_name: cleanFirstName || undefined,
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Failed to re-activate subscriber:", updateError);
          return { error: "Unable to update subscription. Please try again later." };
        }

        // Audit Trail: Record re-activation consent event with strict error handling
        const { error: consentAuditError } = await adminClient
          .from("marketing_consent_records")
          .insert({
            email: normalizedEmail,
            consent_type: "craft_journal_reactivation",
            consent_text: "I would like to re-subscribe to The Kauseyah Craft Journal and stories on indigenous craft heritage.",
            ip_hash: clientIpHash && clientIpHash !== "unknown" ? clientIpHash : null,
            source: "craft_journal_section",
            consent_given: true,
            timestamp: new Date().toISOString(),
          });

        if (consentAuditError) {
          console.error("Failed to record reactivation marketing consent audit record:", consentAuditError);
          // Non-destructive compensation: revert to exact prior subscriber state
          const { error: rollbackError } = await adminClient
            .from("newsletter_subscribers")
            .update({
              status: existing.status,
              consent_given: existing.consent_given ?? false,
              first_name: existing.first_name ?? null,
              unsubscribed_at: existing.unsubscribed_at ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
          if (rollbackError) {
            console.error("Failed to restore previous subscriber state during compensation:", rollbackError);
          }
          return { error: "Failed to securely record subscription consent audit. Please try again." };
        }
      }
    } else {
      // New subscriber
      const { data: newSub, error: insertError } = await adminClient
        .from("newsletter_subscribers")
        .insert({
          email: normalizedEmail,
          first_name: cleanFirstName || null,
          status: "active",
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
          source: "craft_journal_section",
          unsubscribe_token: token,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Failed to insert subscriber:", insertError);
        return { error: "Unable to process subscription right now. Please try again later." };
      }

      // Audit Trail: Record initial subscription consent event with strict error handling
      const { error: consentAuditError } = await adminClient
        .from("marketing_consent_records")
        .insert({
          email: normalizedEmail,
          consent_type: "craft_journal_newsletter",
          consent_text: "I would like to receive The Kauseyah Craft Journal and stories on indigenous craft heritage.",
          ip_hash: clientIpHash && clientIpHash !== "unknown" ? clientIpHash : null,
          source: "craft_journal_section",
          consent_given: true,
          timestamp: new Date().toISOString(),
        });

      if (consentAuditError) {
        console.error("Failed to record initial marketing consent audit record:", consentAuditError);
        // Non-destructive compensation: mark unsubscribed strictly targeting the newly generated record ID (never delete by email)
        if (newSub?.id) {
          const { error: rollbackError } = await adminClient
            .from("newsletter_subscribers")
            .update({ status: "unsubscribed", consent_given: false, updated_at: new Date().toISOString() })
            .eq("id", newSub.id);
          if (rollbackError) {
            console.error("Failed to update new subscriber during compensation:", rollbackError);
          }
        }
        return { error: "Failed to securely record subscription consent audit. Please try again." };
      }
    }

    // Reliable Welcome Email Dispatch: Await to keep serverless socket alive
    try {
      const welcomeResult = await sendCraftJournalWelcomeEmail(normalizedEmail, cleanFirstName, token);
      if (!welcomeResult.success) {
        console.warn("[Newsletter] Welcome email dispatch error:", welcomeResult.error);
      }
    } catch (e: any) {
      console.warn("[Newsletter] Welcome email dispatch exception:", e?.message || e);
    }

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

// ─────────────────────────────────────────────────────────────────────────────
// 2. ADMIN AUTHENTICATION GATE
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 3. ADMIN: GET SUBSCRIBERS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADMIN: EXPORT SUBSCRIBERS CSV (WITH FORMULA INJECTION SHIELD)
// ─────────────────────────────────────────────────────────────────────────────

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

    const headers = [
      escapeForCsvExport("Email"),
      escapeForCsvExport("First Name"),
      escapeForCsvExport("Status"),
      escapeForCsvExport("Consent Given"),
      escapeForCsvExport("Consent Timestamp"),
      escapeForCsvExport("Source"),
      escapeForCsvExport("Subscribed Date"),
    ];

    const rows = (data || []).map((row) => [
      escapeForCsvExport(row.email),
      escapeForCsvExport(row.first_name || ""),
      escapeForCsvExport(row.status),
      escapeForCsvExport(row.consent_given ? "Yes" : "No"),
      escapeForCsvExport(row.consent_timestamp || ""),
      escapeForCsvExport(row.source || ""),
      escapeForCsvExport(row.created_at || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return { success: true, csv: csvContent };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ADMIN: IMPORT SUBSCRIBERS FROM CSV (RFC 4180 COMPLIANT WITH STRICT CONSENT)
// ─────────────────────────────────────────────────────────────────────────────

export async function importSubscribersFromCSV(csvText: string, confirmImport = false) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const parsedRows = parseCsvRfc4180(csvText);
  if (parsedRows.length < 2) {
    return { error: "CSV is empty or contains no data rows." };
  }

  const headers = parsedRows[0].map((h) => h.toLowerCase());
  const emailIdx = headers.findIndex((h) => h.includes("email"));
  const nameIdx = headers.findIndex((h) => h.includes("name") || h.includes("first"));
  const consentIdx = headers.findIndex((h) => h.includes("consent") || h.includes("opt"));

  if (emailIdx === -1) {
    return { error: "CSV must contain an 'email' column header." };
  }

  // Requirement 5: Do NOT treat missing consent column or missing values as affirmative consent!
  if (consentIdx === -1) {
    return {
      error: "CSV must contain an explicit 'consent' column (e.g. 'consent', 'opt_in') to ensure affirmative consent compliance.",
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const seenInCsv = new Set<string>();
  const validRecords: Array<{ email: string; firstName?: string; consent: boolean }> = [];
  const invalidRows: Array<{ row: number; email: string; reason: string }> = [];

  for (let i = 1; i < parsedRows.length; i++) {
    const cols = parsedRows[i];
    const rawEmail = (cols[emailIdx] || "").toLowerCase().trim();
    const rawName = nameIdx !== -1 ? (cols[nameIdx] || "").trim() : "";
    const rawConsent = (cols[consentIdx] || "").toLowerCase().trim();

    if (
      !rawEmail ||
      !emailRegex.test(rawEmail) ||
      rawEmail.includes("..") ||
      rawEmail.endsWith(".") ||
      rawEmail.length > 254
    ) {
      invalidRows.push({ row: i + 1, email: rawEmail, reason: "Invalid email syntax" });
      continue;
    }

    if (seenInCsv.has(rawEmail)) {
      invalidRows.push({ row: i + 1, email: rawEmail, reason: "Duplicate in file" });
      continue;
    }

    // Strict Affirmative Consent Evaluation
    const isAffirmativeConsent = ["yes", "true", "1", "opted_in", "y"].includes(rawConsent);
    if (!isAffirmativeConsent) {
      invalidRows.push({
        row: i + 1,
        email: rawEmail,
        reason: "Missing affirmative consent (expected 'yes', 'true', or '1')",
      });
      continue;
    }

    seenInCsv.add(rawEmail);
    validRecords.push({
      email: rawEmail,
      firstName: rawName || undefined,
      consent: true,
    });
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let existingInDb = new Set<string>();
  if (validRecords.length > 0) {
    try {
      // Chunk lookups to respect Postgres parameter limits
      const emails = validRecords.map((r) => r.email);
      for (let i = 0; i < emails.length; i += 200) {
        const chunk = emails.slice(i, i + 200);
        const { data: existingRows } = await adminClient
          .from("newsletter_subscribers")
          .select("email")
          .in("email", chunk);
        if (existingRows) {
          existingRows.forEach((r) => existingInDb.add(r.email.toLowerCase()));
        }
      }
    } catch (_) {}
  }

  const readyToImport = validRecords.filter((r) => !existingInDb.has(r.email));
  const duplicatesCount = validRecords.filter((r) => existingInDb.has(r.email)).length;

  // Return preview metrics before committing
  if (!confirmImport) {
    const missingConsentCount = invalidRows.filter((r) => r.reason.toLowerCase().includes("consent")).length;
    return {
      preview: true,
      totalRows: parsedRows.length - 1,
      validCount: validRecords.length,
      readyToImportCount: readyToImport.length,
      existingDuplicates: duplicatesCount,
      missingConsentCount,
      invalidCount: invalidRows.length,
      invalidSample: invalidRows.slice(0, 5),
      sample: readyToImport.slice(0, 5),
    };
  }

  // Execute import
  try {
    const timestamp = new Date().toISOString();
    const recordsToInsert = readyToImport.map((r) => ({
      email: r.email,
      first_name: r.firstName || null,
      status: "active",
      consent_given: true,
      consent_timestamp: timestamp,
      source: "csv_import",
      unsubscribe_token: crypto.randomUUID(),
    }));

    if (recordsToInsert.length > 0) {
      // Insert subscribers in batches of 100
      for (let i = 0; i < recordsToInsert.length; i += 100) {
        const chunk = recordsToInsert.slice(i, i + 100);
        const { error } = await adminClient.from("newsletter_subscribers").insert(chunk);
        if (error) return { error: error.message };
      }

      // Audit Trail: Record consent audit records for all imported contacts
      const consentAuditRows = readyToImport.map((r) => ({
        email: r.email,
        consent_type: "csv_import",
        consent_text: "Explicit affirmative consent verified from administrative CSV import.",
        source: "csv_import",
        consent_given: true,
        timestamp,
      }));

      for (let i = 0; i < consentAuditRows.length; i += 100) {
        try {
          await adminClient.from("marketing_consent_records").insert(consentAuditRows.slice(i, i + 100));
        } catch (_) {}
      }
    }

    revalidatePath("/admin/newsletter");
    return {
      success: true,
      importedCount: recordsToInsert.length,
      skippedDuplicates: duplicatesCount,
      skippedInvalid: invalidRows.length,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ADMIN: CAMPAIGN CREATION, ATOMIC CLAIMING & BOUNDED BATCH DISPATCH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a campaign and pre-seeds candidate recipient records into newsletter_campaign_logs
 * as 'pending' with attempt_count = 0.
 */
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
    // Fetch all active subscribers who provided affirmative consent
    const { data: eligibleSubscribers, error: subError } = await adminClient
      .from("newsletter_subscribers")
      .select("id, email")
      .eq("status", "active")
      .eq("consent_given", true);

    if (subError) {
      if (subError.message.includes("Could not find the table")) {
        return { error: "Database migration not yet applied in Supabase." };
      }
      return { error: subError.message };
    }

    if (!eligibleSubscribers || eligibleSubscribers.length === 0) {
      return { error: "No active subscribers with explicit marketing consent found." };
    }

    // 1. Create the campaign header record in 'draft' status
    const { data: campaign, error: campaignError } = await adminClient
      .from("newsletter_campaigns")
      .insert({
        title: title || subject,
        subject,
        preview_text: previewText || null,
        content_html: contentHtml,
        status: "draft",
        recipient_count: eligibleSubscribers.length,
        sent_count: 0,
        failed_count: 0,
      })
      .select()
      .single();

    if (campaignError || !campaign) {
      return { error: campaignError?.message || "Failed to create campaign header." };
    }

    // 2. Pre-seed recipient logs in chunks of 200 with status: 'pending', attempt_count: 0
    const logRows = eligibleSubscribers.map((s) => ({
      campaign_id: campaign.id,
      subscriber_id: s.id,
      email: s.email,
      status: "pending",
      attempt_count: 0,
    }));

    for (let i = 0; i < logRows.length; i += 200) {
      const chunk = logRows.slice(i, i + 200);
      const { error: seedError } = await adminClient
        .from("newsletter_campaign_logs")
        .insert(chunk);
      if (seedError) {
        console.error("[Newsletter] Recipient log seeding error:", seedError.message);
        // Abort and delete draft campaign header and any seeded logs
        await adminClient.from("newsletter_campaign_logs").delete().eq("campaign_id", campaign.id);
        await adminClient.from("newsletter_campaigns").delete().eq("id", campaign.id);
        return { error: `Failed to seed recipient logs: ${seedError.message}. Campaign aborted.` };
      }
    }

    // 3. Verify seeded recipient count matches eligible subscribers exactly
    const { count: seededCount, error: countErr } = await adminClient
      .from("newsletter_campaign_logs")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaign.id);

    if (countErr || seededCount !== eligibleSubscribers.length) {
      await adminClient.from("newsletter_campaign_logs").delete().eq("campaign_id", campaign.id);
      await adminClient.from("newsletter_campaigns").delete().eq("id", campaign.id);
      return {
        error: `Recipient seeding verification mismatch (expected ${eligibleSubscribers.length}, found ${seededCount || 0}). Campaign creation aborted.`,
      };
    }

    // 4. Activate campaign to 'sending' status now that recipient seeding is guaranteed complete
    const { error: activateErr } = await adminClient
      .from("newsletter_campaigns")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", campaign.id);

    if (activateErr) {
      return { error: `Failed to activate campaign: ${activateErr.message}` };
    }

    return {
      success: true,
      campaignId: campaign.id,
      totalRecipients: eligibleSubscribers.length,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Processes a single bounded batch of recipients with atomic claiming (FOR UPDATE SKIP LOCKED)
 * and safe retry handling.
 * Strict: Never dispatches through non-atomic or unverified fallback claiming.
 */
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

    // Prevent duplicate re-processing of already completed campaigns
    if (campaign.status === "sent" || campaign.status === "partially_failed") {
      return {
        done: true,
        campaignId,
        sentCount: campaign.sent_count,
        failedCount: campaign.failed_count,
        totalRecipients: campaign.recipient_count,
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ATOMIC RECIPIENT CLAIMING (PostgreSQL FOR UPDATE SKIP LOCKED)
    // Strict requirement: Fail closed if RPC is unavailable. Never fall back to
    // non-atomic application select-update races.
    // ─────────────────────────────────────────────────────────────────────────
    const safeBatchSize =
      typeof batchSize === "number" && !isNaN(batchSize)
        ? Math.min(Math.max(Math.floor(batchSize), 1), 100)
        : 15;

    const { data: rpcClaimed, error: rpcError } = await adminClient.rpc(
      "claim_campaign_recipients",
      {
        p_campaign_id: campaignId,
        p_batch_size: safeBatchSize,
        p_timeout_seconds: 300,
      }
    );

    if (rpcError) {
      console.error("[Newsletter] Atomic claim RPC error:", rpcError.message);
      return {
        error: `Campaign claiming RPC failed or is unavailable (${rpcError.message}). Please ensure database migration 20261114_newsletter_only.sql is applied.`,
      };
    }

    const claimedRecipients: Array<{
      log_id: string;
      subscriber_id?: string;
      email: string;
      first_name?: string;
      unsubscribe_token?: string;
      attempt_count: number;
    }> = Array.isArray(rpcClaimed) ? rpcClaimed : [];

    // ─────────────────────────────────────────────────────────────────────────
    // IF NO RECIPIENTS CLAIMED IN THIS BATCH: CHECK FOR REMAINING ACTIVE WORKERS
    // ─────────────────────────────────────────────────────────────────────────
    if (claimedRecipients.length === 0) {
      // 1. Try atomic database reconciliation RPC
      try {
        const { data: reconData, error: reconErr } = await adminClient.rpc(
          "reconcile_campaign_status",
          { p_campaign_id: campaignId }
        );

        if (!reconErr && Array.isArray(reconData) && reconData.length > 0) {
          const r = reconData[0];
          if (r.is_complete) {
            revalidatePath("/admin/newsletter");
            return {
              done: true,
              campaignId,
              sentCount: r.sent_count,
              failedCount: r.failed_count,
              totalRecipients: campaign.recipient_count,
              status: r.status,
            };
          } else {
            // Still active workers or pending items being processed
            return {
              done: false,
              campaignId,
              sentCount: r.sent_count,
              failedCount: r.failed_count,
              remainingCount: (r.pending_count || 0) + (r.processing_count || 0),
              totalRecipients: campaign.recipient_count,
              status: r.status,
            };
          }
        }
      } catch (_) {}

      // 2. Safe fallback count directly from newsletter_campaign_logs
      const { count: sentTotal } = await adminClient
        .from("newsletter_campaign_logs")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "sent");

      const { count: failedTotal } = await adminClient
        .from("newsletter_campaign_logs")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "failed");

      const { count: processingTotal } = await adminClient
        .from("newsletter_campaign_logs")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "processing");

      const { count: pendingTotal } = await adminClient
        .from("newsletter_campaign_logs")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "pending");

      const activeRemaining = (processingTotal || 0) + (pendingTotal || 0);

      if (activeRemaining > 0) {
        // Active workers or unexpired processing claims still exist; do not finalize campaign prematurely
        return {
          done: false,
          campaignId,
          sentCount: sentTotal || 0,
          failedCount: failedTotal || 0,
          remainingCount: activeRemaining,
          totalRecipients: campaign.recipient_count,
          status: "sending",
        };
      }

      const finalStatus = (failedTotal || 0) > 0 ? "partially_failed" : "sent";

      await adminClient
        .from("newsletter_campaigns")
        .update({
          status: finalStatus,
          sent_count: sentTotal || 0,
          failed_count: failedTotal || 0,
          sent_at: campaign.sent_at || new Date().toISOString(),
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", campaignId);

      revalidatePath("/admin/newsletter");
      return {
        done: true,
        campaignId,
        sentCount: sentTotal || 0,
        failedCount: failedTotal || 0,
        totalRecipients: campaign.recipient_count || (sentTotal || 0) + (failedTotal || 0),
        status: finalStatus,
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PROCESS CLAIMED BATCH THROUGH RESEND
    // ─────────────────────────────────────────────────────────────────────────
    let batchSent = 0;
    let batchFailed = 0;

    for (const recipient of claimedRecipients) {
      const sendRes = await sendNewsletterCampaignEmail({
        to: recipient.email,
        recipientName: recipient.first_name || undefined,
        subject: campaign.subject,
        previewText: campaign.preview_text || undefined,
        contentHtml: campaign.content_html,
        campaignId: campaign.id,
        unsubscribeToken: recipient.unsubscribe_token || crypto.randomUUID(),
      });

      const nowIso = new Date().toISOString();

      if (sendRes.success) {
        batchSent++;
        await adminClient
          .from("newsletter_campaign_logs")
          .update({
            status: "sent",
            sent_at: nowIso,
            error_message: null,
            attempt_count: recipient.attempt_count,
            updated_at: nowIso,
          })
          .eq("id", recipient.log_id);
      } else {
        batchFailed++;
        await adminClient
          .from("newsletter_campaign_logs")
          .update({
            status: "failed",
            error_message: String(sendRes.error || "Delivery failure"),
            attempt_count: recipient.attempt_count,
            last_attempt_at: nowIso,
            updated_at: nowIso,
          })
          .eq("id", recipient.log_id);
      }

      // Respect API rate limits with polite 200ms throttle between dispatches
      await new Promise((r) => setTimeout(r, 200));
    }

    // Reconcile status after batch dispatch using atomic RPC if available
    try {
      const { data: reconData } = await adminClient.rpc("reconcile_campaign_status", {
        p_campaign_id: campaignId,
      });

      if (Array.isArray(reconData) && reconData.length > 0) {
        const r = reconData[0];
        if (r.is_complete) {
          revalidatePath("/admin/newsletter");
        }
        return {
          done: r.is_complete,
          campaignId,
          processedInBatch: claimedRecipients.length,
          sentInBatch: batchSent,
          failedInBatch: batchFailed,
          totalSent: r.sent_count,
          totalFailed: r.failed_count,
          remainingCount: (r.pending_count || 0) + (r.processing_count || 0),
          totalRecipients: campaign.recipient_count,
          status: r.status,
        };
      }
    } catch (_) {}

    // Fallback reconciliation count from logs
    const { count: currentSent } = await adminClient
      .from("newsletter_campaign_logs")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", "sent");

    const { count: currentFailed } = await adminClient
      .from("newsletter_campaign_logs")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", "failed");

    const { count: pendingRemaining } = await adminClient
      .from("newsletter_campaign_logs")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .or("status.eq.pending,status.eq.processing");

    await adminClient
      .from("newsletter_campaigns")
      .update({
        sent_count: currentSent || 0,
        failed_count: currentFailed || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    const isComplete = (pendingRemaining || 0) === 0;
    if (isComplete) {
      const finalStatus = (currentFailed || 0) > 0 ? "partially_failed" : "sent";
      await adminClient
        .from("newsletter_campaigns")
        .update({
          status: finalStatus,
          sent_at: campaign.sent_at || new Date().toISOString(),
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", campaignId);
      revalidatePath("/admin/newsletter");
    }

    return {
      done: isComplete,
      campaignId,
      processedInBatch: claimedRecipients.length,
      sentInBatch: batchSent,
      failedInBatch: batchFailed,
      totalSent: currentSent || 0,
      totalFailed: currentFailed || 0,
      remainingCount: pendingRemaining || 0,
      totalRecipients: campaign.recipient_count,
      status: isComplete ? ((currentFailed || 0) > 0 ? "partially_failed" : "sent") : "sending",
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Resets failed recipients for a campaign to 'pending' so they can be retried safely.
 */
export async function retryCampaignFailedRecipients(campaignId: string) {
  const auth = await verifyAdmin();
  if (!auth.authorized) return { error: auth.error };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { count: failedCount } = await adminClient
      .from("newsletter_campaign_logs")
      .select("id", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", "failed");

    if (!failedCount || failedCount === 0) {
      return { error: "No failed recipients found for this campaign." };
    }

    const { error: resetError } = await adminClient
      .from("newsletter_campaign_logs")
      .update({
        status: "pending",
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("campaign_id", campaignId)
      .eq("status", "failed");

    if (resetError) return { error: resetError.message };

    await adminClient
      .from("newsletter_campaigns")
      .update({
        status: "sending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    revalidatePath("/admin/newsletter");
    return {
      success: true,
      retriedCount: failedCount,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Initiates campaign creation and runs an initial bounded batch without runaway loops.
 */
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

  // Execute initial batch (15 recipients); client-side continues remaining batches
  const initialBatch = await sendNewsletterCampaignBatch(created.campaignId, 15);
  return {
    success: true,
    campaignId: created.campaignId,
    initialBatch,
  };
}
