import { createClient } from "@supabase/supabase-js";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/constants";

export async function calculateSecureOrderTotals(cartItems: any[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const productIds = cartItems.map((item: any) => item.product.id);
  const { data: dbProducts, error: dbProductsError } = await supabaseAdmin
    .from("products")
    .select("id, price, variants")
    .in("id", productIds);

  if (dbProductsError || !dbProducts) {
    throw new Error("Failed to verify products.");
  }

  let calculatedSubtotal = 0;
  const verifiedCartItems = [];

  for (const item of cartItems) {
    const dbProduct = dbProducts.find((p: any) => p.id === item.product.id);
    if (!dbProduct) {
      throw new Error(`Product ${item.product.name} not found.`);
    }

    let itemPrice = dbProduct.price;

    // Check if the specific variant has a custom price
    if (dbProduct.variants && Array.isArray(dbProduct.variants)) {
      const dbVariant = dbProduct.variants.find((v: any) => 
        (item.variant?.color ? v.color === item.variant.color : true) && 
        (item.variant?.size ? v.size === item.variant.size : true)
      );
      if (dbVariant && dbVariant.price !== undefined) {
        itemPrice = dbVariant.price;
      }
    }

    calculatedSubtotal += itemPrice * item.quantity;
    verifiedCartItems.push({
      ...item,
      verifiedPrice: itemPrice
    });
  }

  const calculatedShipping = calculatedSubtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const calculatedTotal = calculatedSubtotal + calculatedShipping;

  return {
    calculatedSubtotal,
    calculatedShipping,
    calculatedTotal,
    verifiedCartItems
  };
}
