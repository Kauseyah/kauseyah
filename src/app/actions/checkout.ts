"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt, sendAdminOrderNotification } from "@/lib/email";
import { sendWhatsAppOrderNotification } from "@/lib/whatsapp";
import { calculateSecureOrderTotals } from "@/utils/order-utils";

export async function createOrder(orderData: any, cartItems: any[]) {
  // Create an admin client to bypass RLS for inserting the order
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Calculate totals securely on the server
  let calculatedSubtotal, calculatedShipping, calculatedGiftCharge, calculatedTotal, verifiedCartItems;
  try {
    const totals = await calculateSecureOrderTotals(cartItems);
    calculatedSubtotal = totals.calculatedSubtotal;
    calculatedShipping = totals.calculatedShipping;
    calculatedGiftCharge = totals.calculatedGiftCharge || 0;
    calculatedTotal = totals.calculatedTotal;
    verifiedCartItems = totals.verifiedCartItems;
  } catch (error: any) {
    return { error: error.message };
  }

  const giftCount = verifiedCartItems.filter((i: any) => i.giftDetails?.isGift).length;

  // 2. Insert Order (with fallback if gift_charge column is not yet migrated)
  let order: any = null;
  const baseOrderInsert = {
    user_id: null,
    order_status: "processing",
    subtotal: calculatedSubtotal,
    shipping_charge: calculatedShipping,
    shipping_address: {
      name: orderData.shipping_name,
      phone: orderData.shipping_phone,
      address: orderData.shipping_address,
      city: orderData.city,
      state: orderData.state || "Not Specified",
      pincode: orderData.pincode
    },
    payment_status: orderData.payment_status,
    total_amount: calculatedTotal,
    payment_id: orderData.razorpay_payment_id || null,
  };

  // Try inserting with gift columns
  const { data: orderWithGift, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      ...baseOrderInsert,
      gift_charge: calculatedGiftCharge,
      gift_count: giftCount
    })
    .select()
    .single();

  if (orderError) {
    // If gift_charge column doesn't exist yet, retry with base columns
    if (orderError.message.includes("gift_charge") || orderError.message.includes("column")) {
      const { data: baseOrder, error: retryError } = await supabaseAdmin
        .from("orders")
        .insert(baseOrderInsert)
        .select()
        .single();

      if (retryError) {
        return { error: retryError.message };
      }
      order = baseOrder;
    } else {
      return { error: orderError.message };
    }
  } else {
    order = orderWithGift;
  }

  // 3. Insert Order Items (with item-level gift details)
  const itemsToInsert = verifiedCartItems.map((item: any) => {
    const isGift = Boolean(item.giftDetails?.isGift);
    const giftMessage = isGift ? (item.giftDetails?.message || "") : null;
    const giftPackaging = isGift ? Boolean(item.giftDetails?.packaging ?? true) : false;
    const itemGiftFee = isGift ? (item.giftDetails?.fee || 0) : 0;

    return {
      order_id: order.id,
      product_id: item.product.id,
      variant_details: {
        size: item.variant?.size,
        color: item.variant?.color,
        colorHex: item.variant?.colorHex,
        is_gift: isGift,
        gift_packaging: giftPackaging,
        gift_message: giftMessage,
        gift_charge: itemGiftFee,
      },
      quantity: item.quantity,
      price_at_time: item.verifiedPrice,
      is_gift: isGift,
      gift_packaging: giftPackaging,
      gift_message: giftMessage,
      gift_charge: itemGiftFee,
    };
  });

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // If order_items table lacks the new columns, insert with variant_details JSONB only
    if (itemsError.message.includes("column") || itemsError.message.includes("is_gift")) {
      const fallbackItems = itemsToInsert.map(i => ({
        order_id: i.order_id,
        product_id: i.product_id,
        variant_details: i.variant_details,
        quantity: i.quantity,
        price_at_time: i.price_at_time,
      }));
      await supabaseAdmin.from("order_items").insert(fallbackItems);
    }
  }

  // 4. Update Product Stocks
  for (const item of verifiedCartItems) {
    try {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.product.id)
        .single();

      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - item.quantity);
        await supabaseAdmin
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product.id);
      }
    } catch (err) {
      // Stock update error caught without failing order
    }
  }

  // 5. Send Customer HTML Email Receipt
  const verifiedOrderData = {
    ...orderData,
    subtotal: calculatedSubtotal,
    shipping_charge: calculatedShipping,
    gift_charge: calculatedGiftCharge,
    total_amount: calculatedTotal,
  };

  if (orderData.email) {
    sendOrderReceipt(orderData.email, order.id, verifiedOrderData, verifiedCartItems).catch(() => {});
  }

  // 6. Send Automatic Admin Order Email Notification
  sendAdminOrderNotification(order.id, verifiedOrderData, verifiedCartItems).catch(() => {});

  // 7. Dispatch WhatsApp notification (strictly disabled by default until client configures credentials)
  if (orderData.shipping_phone) {
    sendWhatsAppOrderNotification({
      orderId: order.id,
      customerPhone: orderData.shipping_phone,
      customerName: orderData.shipping_name,
      totalAmount: calculatedTotal,
      eventType: "order_received",
    }).catch(() => {});
  }

  return { success: true, orderId: order.id };
}
