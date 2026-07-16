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
    let verifiedVariant: any = {}; // We will only populate this with SAFE, database-verified data

    // Check if the specific variant exists in the database
    if (dbProduct.variants && Array.isArray(dbProduct.variants) && dbProduct.variants.length > 0) {
      const dbVariant = dbProduct.variants.find((v: any) => {
        const matchColor = item.variant?.color ? v.color === item.variant.color : true;
        const matchSize = item.variant?.size ? v.size === item.variant.size : true;
        return matchColor && matchSize;
      });
      
      if (dbVariant) {
        if (dbVariant.price !== undefined) {
          itemPrice = dbVariant.price;
        }
        // ONLY copy fields that actually exist on the database variant
        verifiedVariant = {
          color: dbVariant.color,
          colorHex: dbVariant.colorHex,
          size: dbVariant.size
        };
      } else if (item.variant?.color || item.variant?.size) {
        // The user tried to send a color or size that does not exist in the database!
        throw new Error(`Invalid variant selected for product ${dbProduct.name}. Please remove it from your cart and try again.`);
      }
    } else if (item.variant?.color || item.variant?.size) {
       // The product has no variants in the DB, but the user tried to send fake ones
       throw new Error(`Variants are not available for product ${dbProduct.name}.`);
    }

    calculatedSubtotal += itemPrice * item.quantity;
    
    // Completely overwrite the user's potentially untrusted variant object with our verified one
    verifiedCartItems.push({
      ...item,
      variant: verifiedVariant,
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
