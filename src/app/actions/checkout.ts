"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt, sendAdminOrderNotification } from "@/lib/email";
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

  // 2. Insert Order (relying strictly on existing database columns)
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
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
        pincode: orderData.pincode,
      },
      payment_status: orderData.payment_status,
      total_amount: calculatedTotal,
      payment_id: orderData.razorpay_payment_id || null,
    })
    .select()
    .single();

  if (orderError) {
    return { error: `Failed to create order: ${orderError.message}` };
  }

  // 3. Insert Order Items (persisting gift metadata safely inside variant_details JSONB)
  const orderItemsData = verifiedCartItems.map((item) => {
    const isGift = Boolean(item.giftDetails?.isGift);
    const packaging = isGift ? Boolean(item.giftDetails?.packaging) : false;
    const message = isGift ? (item.giftDetails?.message || "") : "";
    const itemGiftCharge = packaging ? (100 * item.quantity) : 0;

    return {
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_time: item.verifiedPrice,
      variant_details: {
        size: item.variant?.size,
        color: item.variant?.color,
        colorHex: item.variant?.colorHex,
        is_gift: isGift,
        gift_packaging: packaging,
        gift_message: message,
        gift_charge: itemGiftCharge,
      },
    };
  });

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    return { error: `Order created but failed to add items: ${itemsError.message}` };
  }

  // 4. Update Product Stock
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

  // 5. Send Customer Email Receipt
  // Fire and forget so it doesn't block the checkout response
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

  return { success: true, orderId: order.id };
}
