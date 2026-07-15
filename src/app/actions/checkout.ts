"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt } from "@/lib/email";
import { calculateSecureOrderTotals } from "@/utils/order-utils";

export async function createOrder(orderData: any, cartItems: any[]) {
  const supabaseAuth = await createServerClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to place an order" };
  }

  // Create an admin client to bypass RLS for inserting the order
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Calculate totals securely on the server
  let calculatedSubtotal, calculatedShipping, calculatedTotal, verifiedCartItems;
  try {
    const totals = await calculateSecureOrderTotals(cartItems);
    calculatedSubtotal = totals.calculatedSubtotal;
    calculatedShipping = totals.calculatedShipping;
    calculatedTotal = totals.calculatedTotal;
    verifiedCartItems = totals.verifiedCartItems;
  } catch (error: any) {
    return { error: error.message };
  }

  // 2. Insert Order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: user.id,
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
    })
    .select()
    .single();

  if (orderError) {
    // // console.error("Failed to insert order:", orderError);
    return { error: `Failed to create order: ${orderError.message}` };
  }

  // 3. Insert Order Items
  const orderItemsData = verifiedCartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_time: item.verifiedPrice,
    variant_details: { size: item.variant.size, color: item.variant.color, colorHex: item.variant.colorHex }
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    // // console.error("Failed to insert order items:", itemsError);
    return { error: `Order created but failed to add items: ${itemsError.message}` };
  }

  // 4. Update Product Stock
  for (const item of verifiedCartItems) {
    try {
      // Fetch current stock to avoid setting to negative if something goes wrong
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
      // // console.error(`Failed to update stock for product ${item.product.id}:`, err);
    }
  }

  // 5. Send HTML Email Receipt
  // Fire and forget so it doesn't block the checkout response
  if (user.email) {
    // Override orderData with verified totals for the email receipt
    const verifiedOrderData = {
      ...orderData,
      subtotal: calculatedSubtotal,
      shipping_charge: calculatedShipping,
      total_amount: calculatedTotal,
    };
    sendOrderReceipt(user.email, order.id, verifiedOrderData, verifiedCartItems).catch(() => {});
  }

  return { success: true, orderId: order.id };
}
