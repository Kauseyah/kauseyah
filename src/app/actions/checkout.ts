"use server";

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt } from "@/lib/email";

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

  // 1. Insert Order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id: user.id,
      order_status: "processing",
      shipping_name: orderData.shipping_name,
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      state: "Not Specified", // Default state if missing
      pincode: orderData.pincode,
      shipping_phone: orderData.shipping_phone,
      subtotal: orderData.subtotal,
      shipping_charge: orderData.shipping_charge,
      payment_status: orderData.payment_status,
      total_amount: orderData.total_amount,
      razorpay_order_id: orderData.razorpay_order_id || null,
      razorpay_payment_id: orderData.razorpay_payment_id || null,
    })
    .select()
    .single();

  if (orderError) {
    // // console.error("Failed to insert order:", orderError);
    return { error: `Failed to create order: ${orderError.message}` };
  }

  // 2. Insert Order Items
  const orderItemsData = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_time: item.variant.price,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    // // console.error("Failed to insert order items:", itemsError);
    return { error: `Order created but failed to add items: ${itemsError.message}` };
  }

  // 3. Update Product Stock
  for (const item of cartItems) {
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

  // 4. Send HTML Email Receipt
  // Fire and forget so it doesn't block the checkout response
  if (user.email) {
    sendOrderReceipt(user.email, order.id, orderData, cartItems).catch(() => {});
  }

  return { success: true, orderId: order.id };
}
