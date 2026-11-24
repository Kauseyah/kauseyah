import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Escapes untrusted text for safe HTML interpolation to prevent injection.
 */
export function escapeHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes admin-controlled campaign HTML to ensure email compatibility while
 * stripping dangerous executable vectors (scripts, object tags, iframes, inline event handlers).
 */
export function sanitizeEmailHtml(rawHtml: string): string {
  if (!rawHtml) return "";
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "table",
      "tbody",
      "thead",
      "tfoot",
      "tr",
      "td",
      "th",
      "div",
      "span",
      "hr",
      "center",
    ]),
    allowedAttributes: {
      "*": ["style", "class", "align", "valign", "width", "height", "bgcolor", "color"],
      a: ["href", "name", "target", "rel", "style"],
      img: ["src", "alt", "title", "width", "height", "style"],
      table: ["cellpadding", "cellspacing", "border", "width", "style", "align"],
      td: ["colspan", "rowspan", "align", "valign", "width", "style"],
      th: ["colspan", "rowspan", "align", "valign", "width", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    disallowedTagsMode: "discard",
  });
}

/**
 * Returns an initialized Resend client, or null if RESEND_API_KEY is not configured.
 */
function getResendClient(): { client: Resend | null; error?: string } {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      client: null,
      error: "RESEND_API_KEY environment variable is not configured.",
    };
  }
  return { client: new Resend(apiKey.trim()) };
}

/**
 * Resolves the sender email address from environment variables with a professional fallback.
 */
function getSenderAddress(): string {
  return (
    process.env.NEWSLETTER_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "The Kauseyah Craft Journal <newsletter@kauseyah.com>"
  );
}

/**
 * Resolves the canonical website URL for unsubscribe and legal links.
 */
function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kauseyah.com";
  return envUrl.replace(/\/$/, "");
}

/**
 * Generates an RFC 8058 compliant unsubscribe URL for a subscriber token.
 */
export function buildUnsubscribeUrl(token: string): string {
  return `${getSiteUrl()}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * Sends a welcome email to a new or re-activated Craft Journal subscriber.
 */
export async function sendCraftJournalWelcomeEmail(
  subscriberEmail: string,
  firstName?: string,
  unsubscribeToken?: string
): Promise<SendEmailResult> {
  const { client, error: clientError } = getResendClient();
  if (!client) {
    console.warn("[Newsletter] Welcome email skipped:", clientError);
    return { success: false, error: clientError };
  }

  const fromAddress = getSenderAddress();
  const token = unsubscribeToken || "preview";
  const unsubscribeUrl = buildUnsubscribeUrl(token);
  const siteUrl = getSiteUrl();
  const recipientDisplayName = firstName && firstName.trim().length > 0 
    ? escapeHtml(firstName.trim()) 
    : "Fellow Patron of Handloom";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Kauseyah Craft Journal</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FFF8F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1412; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; outline: none; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FFF8F3; padding: 32px 16px; }
    .main { background-color: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid #EADDCF; overflow: hidden; box-shadow: 0 10px 30px rgba(45, 40, 37, 0.04); }
    .header { padding: 40px 32px 24px; text-align: center; border-bottom: 2px solid #FF6B00; background-color: #FFFFFF; }
    .content { padding: 36px 32px; font-size: 15px; line-height: 1.7; color: #4A4540; }
    .quote-box { background-color: #FFF9F4; border-left: 3px solid #D95D1E; border-radius: 8px; padding: 18px 20px; margin: 24px 0; font-style: italic; color: #2D2825; }
    .cta-btn { display: inline-block; background-color: #111111; color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0; }
    .footer { padding: 28px 32px; background-color: #FAF4ED; border-top: 1px solid #EADDCF; font-size: 12px; line-height: 1.6; color: #8C827A; text-align: center; }
    .footer a { color: #D95D1E; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Preheader preview text -->
    <div style="display: none; font-size: 1px; color: #FFF8F3; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
      Stories of living Indian tribal heritage, wild Kosa silk, and generational loom masters.
    </div>

    <table class="main" width="100%" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <img src="${siteUrl}/images/logo1.png" alt="KAUSEYAH" width="180" style="margin: 0 auto 12px auto; max-width: 180px; height: auto;" />
          <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #D95D1E;">
            The Craft Journal
          </p>
        </td>
      </tr>

      <tr>
        <td class="content">
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #111111; font-weight: normal; margin-top: 0; line-height: 1.3;">
            Welcome, ${recipientDisplayName}.
          </h1>
          <p>
            Thank you for joining <strong>The Kauseyah Craft Journal</strong>. By subscribing, you become part of a conscious community dedicated to preserving India’s rarest tribal textile traditions.
          </p>
          <p>
            In every edition, we bring you unhurried chronicles directly from the loom houses of Chhattisgarh:
          </p>
          <ul style="padding-left: 20px; margin: 16px 0;">
            <li style="margin-bottom: 8px;"><strong>Untamed Kosa Silk:</strong> The sacred lifecycle of wild forest silk harvested naturally in tribal heartlands.</li>
            <li style="margin-bottom: 8px;"><strong>Master Weaver Profiles:</strong> Generational knowledge handed down through songs, motifs, and memory.</li>
            <li style="margin-bottom: 8px;"><strong>Private Previews:</strong> Early access to limited-edition handloom drops and heirloom saree collections before public release.</li>
          </ul>

          <div class="quote-box">
            &ldquo;Every warp and weft woven by human hands carries the soul of the artisan, bridging ancient folklore with modern conscious luxury.&rdquo;
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${siteUrl}/collections" class="cta-btn" target="_blank">
              Explore Living Handlooms
            </a>
          </div>
        </td>
      </tr>

      <tr>
        <td class="footer">
          <p style="margin: 0 0 10px 0;">
            You are receiving this note because you subscribed at <a href="${siteUrl}">${siteUrl}</a>.
          </p>
          <p style="margin: 0 0 10px 0;">
            Kauseyah Handlooms &amp; Crafts &bull; Ethical Luxury &bull; Zero Waste
          </p>
          <p style="margin: 0;">
            <a href="${unsubscribeUrl}" target="_blank">Unsubscribe with one click</a> &bull;
            <a href="${siteUrl}/privacy" target="_blank">Privacy Policy</a> &bull;
            <a href="${siteUrl}/contact" target="_blank">Contact Us</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;

  try {
    const { data, error } = await client.emails.send({
      from: fromAddress,
      to: [subscriberEmail],
      subject: "Welcome to The Kauseyah Craft Journal",
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error) {
      console.error("[Newsletter] Resend send error for welcome email:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Newsletter] Unexpected error sending welcome email:", err?.message || err);
    return { success: false, error: err?.message || "Failed to dispatch welcome email" };
  }
}

/**
 * Sends a marketing campaign email to an individual subscriber.
 */
export async function sendNewsletterCampaignEmail(params: {
  to: string;
  recipientName?: string;
  subject: string;
  previewText?: string;
  contentHtml: string;
  campaignId: string;
  unsubscribeToken: string;
}): Promise<SendEmailResult> {
  const { client, error: clientError } = getResendClient();
  if (!client) {
    return { success: false, error: clientError };
  }

  const { to, subject, previewText, contentHtml, unsubscribeToken } = params;
  const fromAddress = getSenderAddress();
  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);
  const siteUrl = getSiteUrl();

  const safeSubject = escapeHtml(subject);
  const safePreview = escapeHtml(previewText);
  const sanitizedBody = sanitizeEmailHtml(contentHtml);

  const previewSnippet = safePreview
    ? `<div style="display: none; font-size: 1px; color: #FFF8F3; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${safePreview}</div>`
    : "";

  const wrappedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FFF8F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1412; }
    table { border-collapse: collapse; }
    img { border: 0; display: block; outline: none; max-width: 100%; height: auto; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #FFF8F3; padding: 32px 16px; }
    .main { background-color: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid #EADDCF; overflow: hidden; box-shadow: 0 10px 30px rgba(45, 40, 37, 0.04); }
    .header { padding: 36px 32px 20px; text-align: center; border-bottom: 2px solid #FF6B00; background-color: #FFFFFF; }
    .body-content { padding: 36px 32px; font-size: 15px; line-height: 1.7; color: #4A4540; }
    .footer { padding: 28px 32px; background-color: #FAF4ED; border-top: 1px solid #EADDCF; font-size: 12px; line-height: 1.6; color: #8C827A; text-align: center; }
    .footer a { color: #D95D1E; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    ${previewSnippet}
    <table class="main" width="100%" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td class="header">
          <a href="${siteUrl}" target="_blank">
            <img src="${siteUrl}/images/logo1.png" alt="KAUSEYAH" width="180" style="margin: 0 auto 10px auto; max-width: 180px; height: auto;" />
          </a>
          <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #D95D1E;">
            The Craft Journal
          </p>
        </td>
      </tr>

      <tr>
        <td class="body-content">
          ${sanitizedBody}
        </td>
      </tr>

      <tr>
        <td class="footer">
          <p style="margin: 0 0 10px 0;">
            You received this newsletter as a subscriber to The Kauseyah Craft Journal.
          </p>
          <p style="margin: 0 0 10px 0;">
            Kauseyah Handlooms &bull; Chhattisgarh &bull; India
          </p>
          <p style="margin: 0;">
            <a href="${unsubscribeUrl}" target="_blank">Unsubscribe instantly</a> &bull;
            <a href="${siteUrl}/privacy" target="_blank">Privacy Policy</a> &bull;
            <a href="${siteUrl}/contact" target="_blank">Support</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;

  try {
    const { data, error } = await client.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html: wrappedHtml,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error) {
      console.error(`[Newsletter] Campaign send failure for ${to}:`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error(`[Newsletter] Unexpected exception sending campaign to ${to}:`, err?.message || err);
    return { success: false, error: err?.message || "Failed to dispatch campaign email" };
  }
}
