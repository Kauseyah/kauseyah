"use server";

import { createClient } from "@supabase/supabase-js";
import { sendAdminPaymentAlert } from "@/lib/email";

/**
 * Called when a Razorpay payment is verified but the DB order save fails.
 * Logs the payment details to `payment_logs` for manual reconciliation
 * AND sends an urgent alert email to the admin.
 */
export async function logFailedPayment(details: {
  customerEmail: string;
  customerName: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  errorMessage: string;
  cartItems: any[];
  shippingAddress: any;
}) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Try to save to payment_logs table for DB-level reconciliation
  const { error: logError } = await supabaseAdmin.from("payment_logs").insert({
    customer_email: details.customerEmail,
    customer_name: details.customerName,
    razorpay_order_id: details.razorpay_order_id,
    razorpay_payment_id: details.razorpay_payment_id,
    amount: details.amount,
    db_error: details.errorMessage,
    cart_snapshot: details.cartItems,
    shipping_address: details.shippingAddress,
    status: "unreconciled",
    created_at: new Date().toISOString(),
  });

  // 2. Always send admin email regardless of whether DB log succeeded
  //    so there is at least one reliable notification channel
  await sendAdminPaymentAlert({
    customerEmail: details.customerEmail,
    customerName: details.customerName,
    razorpay_order_id: details.razorpay_order_id,
    razorpay_payment_id: details.razorpay_payment_id,
    amount: details.amount,
    errorMessage: details.errorMessage,
  });

  return { logged: !logError, dbError: logError?.message };
}
