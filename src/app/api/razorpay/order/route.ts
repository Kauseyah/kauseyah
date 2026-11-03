import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { calculateSecureOrderTotals } from "@/utils/order-utils";

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    let calculatedTotal = 0;
    try {
      const totals = await calculateSecureOrderTotals(cartItems);
      calculatedTotal = totals.calculatedTotal;
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Check environment variables — use private keys only (no NEXT_PUBLIC_)
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ 
        error: "Razorpay credentials not configured. Please contact support." 
      }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(calculatedTotal * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await instance.orders.create(options);

    // Return key_id alongside the order so the client never needs to hold it
    // as a NEXT_PUBLIC_ env var (which would expose it in the JS bundle)
    return NextResponse.json({ ...order, key_id });
  } catch (error: any) {
    // console.error("Razorpay error full object:", JSON.stringify(error, null, 2));
    
    // Razorpay often wraps the message in error.error.description
    const errorMsg = error?.error?.description || error?.description || error?.message || "Failed to create order";
    
    return NextResponse.json(
      { error: errorMsg }, 
      { status: 500 }
    );
  }
}
