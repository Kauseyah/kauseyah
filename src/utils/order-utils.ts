import { createClient } from "@supabase/supabase-js";
import { 
  FREE_SHIPPING_THRESHOLD, 
  STANDARD_SHIPPING_FEE, 
  calculateShipping, 
  calculateGiftCharge, 
  DEFAULT_GIFT_CHARGE, 
  DEFAULT_MAX_GIFT_MESSAGE_LENGTH 
} from "@/constants";

export async function calculateSecureOrderTotals(cartItems: any[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch Store Settings for Gifting Rules
  let giftEnabled = true;
  let configuredGiftCharge = DEFAULT_GIFT_CHARGE;
  let giftChargeMode: "per_item" | "per_order" = "per_item";
  let maxGiftMessageLength = DEFAULT_MAX_GIFT_MESSAGE_LENGTH;

  try {
    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("gift_enabled, gift_charge, gift_charge_mode, gift_max_message_length")
      .limit(1)
      .maybeSingle();

    if (settings) {
      if (typeof settings.gift_enabled === "boolean") giftEnabled = settings.gift_enabled;
      if (typeof settings.gift_charge === "number") configuredGiftCharge = Number(settings.gift_charge);
      if (settings.gift_charge_mode === "per_order" || settings.gift_charge_mode === "per_item") {
        giftChargeMode = settings.gift_charge_mode;
      }
      if (typeof settings.gift_max_message_length === "number") {
        maxGiftMessageLength = Number(settings.gift_max_message_length);
      }
    }
  } catch (err) {
    // If settings columns don't exist yet, graceful fallback to defaults
  }

  // 2. Fetch and verify products from Database
  const productIds = cartItems.map((item: any) => item.product.id);
  const { data: dbProducts, error: dbProductsError } = await supabaseAdmin
    .from("products")
    .select("id, name, price, variants")
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
    let verifiedVariant: any = {};

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
        verifiedVariant = {
          color: dbVariant.color,
          colorHex: dbVariant.colorHex,
          size: dbVariant.size
        };
      } else if (item.variant?.color || item.variant?.size) {
        throw new Error(`Invalid variant selected for product ${dbProduct.name}. Please remove it from your cart and try again.`);
      }
    } else if (item.variant?.color || item.variant?.size) {
       throw new Error(`Variants are not available for product ${dbProduct.name}.`);
    }

    calculatedSubtotal += itemPrice * item.quantity;
    
    // Process Gift Details per item
    const rawGift = item.giftDetails;
    const isGift = Boolean(giftEnabled && rawGift?.isGift);
    let sanitizedMessage = "";
    if (isGift && typeof rawGift?.message === "string") {
      // Basic sanitization and truncation to prevent XSS and limit length
      sanitizedMessage = rawGift.message
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .substring(0, maxGiftMessageLength);
    }

    const verifiedGiftDetails = {
      isGift,
      packaging: isGift ? Boolean(rawGift?.packaging ?? true) : false,
      message: sanitizedMessage,
      charge: isGift ? configuredGiftCharge : 0
    };

    // Store verified data
    verifiedCartItems.push({
      ...item,
      variant: verifiedVariant,
      verifiedPrice: itemPrice,
      giftDetails: verifiedGiftDetails
    });
  }

  const calculatedShipping = calculateShipping(calculatedSubtotal, cartItems.length);
  const calculatedGiftCharge = giftEnabled 
    ? calculateGiftCharge(verifiedCartItems, giftChargeMode, configuredGiftCharge) 
    : 0;
  const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedGiftCharge;

  return {
    calculatedSubtotal,
    calculatedShipping,
    calculatedGiftCharge,
    calculatedTotal,
    verifiedCartItems
  };
}
