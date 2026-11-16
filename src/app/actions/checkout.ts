"use server";

import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt, sendAdminOrderNotification } from "@/lib/email";
import { calculateSecureOrderTotals } from "@/utils/order-utils";

interface ReservedItemRecord {
  productId: string;
  quantity: number;
  variantSize?: string | null;
  variantColor?: string | null;
}

/**
 * Reverts any reserved product or variant inventory in the event of an
 * order insertion failure or mid-cart reservation conflict.
 * Restores relative quantities rather than overwriting with stale snapshots,
 * ensuring concurrent purchases during the rollback window are never lost.
 */
async function rollbackReservedInventory(
  supabaseAdmin: any,
  reservedList: ReservedItemRecord[]
) {
  for (const item of reservedList) {
    let retries = 3;
    while (retries > 0) {
      retries--;
      try {
        const { data: current, error: fetchErr } = await supabaseAdmin
          .from("products")
          .select("id, stock, variants")
          .eq("id", item.productId)
          .single();

        if (fetchErr || !current) break;

        const isVariant = Boolean(item.variantSize || item.variantColor);
        if (isVariant && Array.isArray(current.variants) && current.variants.length > 0) {
          const variants = [...current.variants];
          const vIdx = variants.findIndex((v: any) => {
            const matchColor = item.variantColor ? v.color === item.variantColor : true;
            const matchSize = item.variantSize ? v.size === item.variantSize : true;
            return matchColor && matchSize;
          });

          if (vIdx !== -1) {
            const currentVarStock = typeof variants[vIdx].stock === "number" ? variants[vIdx].stock : 0;
            variants[vIdx] = {
              ...variants[vIdx],
              stock: currentVarStock + item.quantity,
            };
          }

          const newParentStock = variants.reduce(
            (sum: number, v: any) => sum + (typeof v.stock === "number" ? v.stock : 0),
            0
          );

          const { data: updated } = await supabaseAdmin
            .from("products")
            .update({ stock: newParentStock, variants })
            .eq("id", item.productId)
            .eq("stock", current.stock)
            .select("id");

          if (updated && updated.length > 0) break; // Rollback applied successfully
        } else {
          const newStock = (typeof current.stock === "number" ? current.stock : 0) + item.quantity;
          const { data: updated } = await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.productId)
            .eq("stock", current.stock)
            .select("id");

          if (updated && updated.length > 0) break; // Rollback applied successfully
        }
      } catch (_) {
        break;
      }
    }
  }
}

export async function createOrder(orderData: any, cartItems: any[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 0. Idempotency Check (Prevents duplicate order creation & double stock decrement)
  const paymentId = orderData.razorpay_payment_id || orderData.payment_id;
  if (paymentId) {
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("payment_id", paymentId)
      .maybeSingle();

    if (existingOrder) {
      return { success: true, orderId: existingOrder.id };
    }
  }

  // 1. Calculate totals securely on the server
  let calculatedSubtotal: number;
  let calculatedShipping: number;
  let calculatedGiftCharge: number;
  let calculatedTotal: number;
  let verifiedCartItems: any[];

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

  // 2. Atomic Inventory Reservation (Executed BEFORE order creation)
  const reservedList: ReservedItemRecord[] = [];
  let reservationFailed = false;
  let reservationErrorMessage = "";

  // Strategy A: Check for database-level atomic RPC function (reserve_cart_inventory)
  const rpcPayload = verifiedCartItems.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
    size: item.variant?.size || null,
    color: item.variant?.color || null,
  }));

  let reservedViaRpc = false;
  try {
    const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc("reserve_cart_inventory", {
      p_items: rpcPayload,
    });

    if (!rpcErr && rpcRes) {
      if (rpcRes.success) {
        reservedViaRpc = true;
      } else {
        reservationFailed = true;
        reservationErrorMessage = rpcRes.error || "Insufficient inventory for one or more items.";
      }
    }
  } catch (_) {
    // If RPC is unavailable or raises network issue, fallback to Strategy B
  }

  // Strategy B: Application-level optimistic conditional reservation with retry loop
  if (!reservedViaRpc && !reservationFailed) {
    for (const item of verifiedCartItems) {
      let itemReserved = false;
      let attempts = 3; // Up to 3 optimistic retry attempts per item

      while (attempts > 0 && !itemReserved) {
        attempts--;
        try {
          const { data: product, error: fetchErr } = await supabaseAdmin
            .from("products")
            .select("id, name, stock, variants")
            .eq("id", item.product.id)
            .single();

          if (fetchErr || !product) {
            reservationFailed = true;
            reservationErrorMessage = `Product "${item.product.name}" could not be retrieved for inventory reservation.`;
            break;
          }

          const isVariantItem = Boolean(item.variant?.size || item.variant?.color);
          const currentVariants = Array.isArray(product.variants) ? [...product.variants] : null;

          if (isVariantItem && currentVariants && currentVariants.length > 0) {
            // Variant-level atomic validation & update
            const vIndex = currentVariants.findIndex((v: any) => {
              const matchColor = item.variant?.color ? v.color === item.variant.color : true;
              const matchSize = item.variant?.size ? v.size === item.variant.size : true;
              return matchColor && matchSize;
            });

            if (vIndex === -1) {
              reservationFailed = true;
              reservationErrorMessage = `Variant "${item.variant?.size || item.variant?.color}" is not available on "${product.name}".`;
              break;
            }

            // Exact variant stock check (strict 0 default, never silently creating inventory)
            const varStock = typeof currentVariants[vIndex].stock === "number" ? currentVariants[vIndex].stock : 0;

            if (varStock < item.quantity) {
              reservationFailed = true;
              reservationErrorMessage = `Insufficient stock for "${product.name} (${item.variant?.size || item.variant?.color})". Available: ${varStock}, Requested: ${item.quantity}.`;
              break;
            }

            // Decrement exact variant
            currentVariants[vIndex] = {
              ...currentVariants[vIndex],
              stock: varStock - item.quantity,
            };

            // Parent stock MUST equal sum of all variant stocks
            const newParentStock = currentVariants.reduce(
              (sum: number, v: any) => sum + (typeof v.stock === "number" ? v.stock : 0),
              0
            );

            // Optimistic lock on parent stock to detect concurrent modifications
            const { data: updatedRow, error: updateErr } = await supabaseAdmin
              .from("products")
              .update({ stock: newParentStock, variants: currentVariants })
              .eq("id", item.product.id)
              .eq("stock", product.stock)
              .select("id");

            if (!updateErr && updatedRow && updatedRow.length > 0) {
              itemReserved = true;
              reservedList.push({
                productId: product.id,
                quantity: item.quantity,
                variantSize: item.variant?.size || null,
                variantColor: item.variant?.color || null,
              });
            } else if (attempts === 0) {
              reservationFailed = true;
              reservationErrorMessage = `Stock for "${product.name}" was modified by another concurrent purchase. Please review your cart and try again.`;
            }
          } else {
            // Simple product conditional stock update
            const parentStock = typeof product.stock === "number" ? product.stock : 0;

            if (parentStock < item.quantity) {
              reservationFailed = true;
              reservationErrorMessage = `Insufficient stock for "${product.name}". Available: ${parentStock}, Requested: ${item.quantity}.`;
              break;
            }

            const newStock = parentStock - item.quantity;

            const { data: updatedRow, error: updateErr } = await supabaseAdmin
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product.id)
              .eq("stock", product.stock)
              .gte("stock", item.quantity)
              .select("id");

            if (!updateErr && updatedRow && updatedRow.length > 0) {
              itemReserved = true;
              reservedList.push({
                productId: product.id,
                quantity: item.quantity,
              });
            } else if (attempts === 0) {
              reservationFailed = true;
              reservationErrorMessage = `Stock for "${product.name}" was modified by another concurrent purchase. Please review your cart and try again.`;
            }
          }
        } catch (err: any) {
          if (attempts === 0) {
            reservationFailed = true;
            reservationErrorMessage = `Inventory reservation failed: ${err.message || "Unknown error"}`;
          }
        }
      }

      if (reservationFailed) {
        break;
      }
    }
  }

  // Handle Inventory Reservation Failure
  if (reservationFailed) {
    // 1. Immediately compensate / roll back any reserved stock items from this cart
    await rollbackReservedInventory(supabaseAdmin, reservedList);

    // 2. Specific handling for Razorpay vs COD
    if (orderData.payment_status === "paid" && paymentId) {
      // Payment was already captured via Razorpay, but inventory was claimed concurrently.
      // Record an explicit order with order_status = 'failed_inventory' and payment_status = 'needs_refund'
      const { data: failedOrder } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: null,
          order_status: "failed_inventory",
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
          payment_status: "needs_refund",
          total_amount: calculatedTotal,
          payment_id: paymentId,
        })
        .select()
        .single();

      return {
        error: `Payment was received (${paymentId}), but inventory was exhausted by another simultaneous purchase. Your order was flagged for an immediate refund (Reference: ${failedOrder?.id || "N/A"}).`,
        orderId: failedOrder?.id,
      };
    }

    // For COD: Return error cleanly without creating any orphan order record
    return { error: reservationErrorMessage || "One or more items in your cart is out of stock." };
  }

  // 3. Insert Order (Stock is already secured and decremented)
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
      payment_id: paymentId || null,
    })
    .select()
    .single();

  if (orderError) {
    // If order creation fails, roll back the reserved inventory!
    await rollbackReservedInventory(supabaseAdmin, reservedList);
    return { error: `Failed to create order: ${orderError.message}` };
  }

  // 4. Insert Order Items (persisting gift metadata safely inside variant_details JSONB)
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
    // Roll back reserved inventory
    await rollbackReservedInventory(supabaseAdmin, reservedList);
    return { error: `Order created but failed to add items: ${itemsError.message}` };
  }

  // 5. Send Customer Email Receipt
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
