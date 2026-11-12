import { createClient } from "@supabase/supabase-js";

interface WhatsAppOrderNotificationParams {
  orderId: string;
  customerPhone: string;
  customerName: string;
  totalAmount: number;
  eventType: "order_received" | "payment_confirmed";
}

/**
 * Checks whether WhatsApp order notifications are enabled.
 * Strictly DISABLED by default until client provides verified Meta Business API credentials.
 */
export async function isWhatsAppEnabled(): Promise<boolean> {
  const envEnabled = process.env.WHATSAPP_ENABLED === "true";
  const hasCredentials = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.WHATSAPP_PHONE_NUMBER_ID
  );

  if (!envEnabled || !hasCredentials) {
    return false;
  }

  // Also verify store_settings database toggle if available
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabaseAdmin
      .from("store_settings")
      .select("whatsapp_enabled")
      .limit(1)
      .maybeSingle();

    return Boolean(data?.whatsapp_enabled);
  } catch {
    return false;
  }
}

/**
 * Sends WhatsApp order notification via Meta WhatsApp Cloud API.
 * Safely guards against premature invocation when disabled.
 */
export async function sendWhatsAppOrderNotification(params: WhatsAppOrderNotificationParams) {
  const { orderId, customerPhone, customerName, totalAmount, eventType } = params;

  // 1. Strict Disabled Guardrail
  const enabled = await isWhatsAppEnabled();
  if (!enabled) {
    return {
      success: false,
      disabled: true,
      reason: "WhatsApp notifications are currently disabled pending Meta Business credentials.",
    };
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const idempotencyKey = `whatsapp_${orderId}_${eventType}`;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Check notification_logs to prevent duplicate notifications
  try {
    const { data: logged } = await supabaseAdmin
      .from("notification_logs")
      .select("id")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (logged) {
      return { success: true, skipped: true, reason: "Notification already sent for this event." };
    }
  } catch (_) {}

  // 3. Format phone number (E.164: must start with country code, default to India +91)
  let formattedPhone = customerPhone.replace(/\D/g, "");
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`;
  }

  // 4. Dispatch Meta Cloud API request
  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: eventType === "payment_confirmed" ? "kauseyah_order_confirmed" : "kauseyah_order_received",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: customerName || "Customer" },
                { type: "text", text: orderId.split("-")[0] },
                { type: "text", text: `₹${totalAmount}` },
              ],
            },
          ],
        },
      }),
    });

    const result = await response.json();

    // 5. Log dispatch in notification_logs
    try {
      await supabaseAdmin.from("notification_logs").insert({
        channel: "whatsapp",
        recipient: formattedPhone,
        idempotency_key: idempotencyKey,
        status: response.ok ? "delivered" : "failed",
        payload: { eventType, orderId, totalAmount, response: result },
      });
    } catch (_) {}

    return { success: response.ok, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

