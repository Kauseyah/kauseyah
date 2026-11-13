import { Resend } from 'resend';

export async function sendOrderReceipt(
  customerEmail: string,
  orderId: string,
  orderData: any,
  cartItems: any[]
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, reason: "No RESEND credentials" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kauseyah Store <orders@kauseyah.com>';

    // Generate HTML for cart items
    const itemsHtml = cartItems.map((item) => {
      const gift = item.giftDetails;
      const isGift = Boolean(gift?.isGift);
      return `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #E5DFD5;">
          <strong style="color: #2D2825; font-size: 16px; font-weight: 700;">${item.product?.name || "Product"}</strong><br/>
          <span style="color: #666666; font-size: 14px; font-weight: 600;">Qty: ${item.quantity}</span>
          ${item.variant?.size || item.variant?.color ? `<br/><span style="color: #888888; font-size: 13px;">${[item.variant?.size, item.variant?.color].filter(Boolean).join(" / ")}</span>` : ""}
          ${isGift ? `
            <div style="margin-top: 6px; padding: 6px 10px; background-color: #FFF8F3; border-left: 3px solid #FF6B00; border-radius: 4px;">
              <span style="color: #FF6B00; font-size: 12px; font-weight: 700;">🎁 Gift Wrapped</span>
              ${gift?.message ? `<p style="margin: 3px 0 0 0; color: #555555; font-size: 12px; font-style: italic;">"${gift.message}"</p>` : ""}
            </div>
          ` : ""}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #E5DFD5; text-align: right; color: #2D2825; font-size: 16px; font-weight: 700; vertical-align: top;">
          ₹${(item.quantity * (item.verifiedPrice || item.variant?.price || 0)).toFixed(2)}
        </td>
      </tr>
      `;
    }).join('');

    const shortOrderId = orderId.split('-')[0];

    const htmlContent = `
      <div style="background-color: #F9F6F0; padding: 40px 20px; width: 100%; box-sizing: border-box;">
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5DFD5; border-radius: 16px; overflow: hidden; color: #2D2825; line-height: 1.6; box-shadow: 0 8px 24px rgba(0,0,0,0.04);">
          
          <!-- Header -->
          <div style="text-align: center; padding: 40px 20px 30px 20px; background-color: #FFFFFF; border-bottom: 3px solid #FF6B00;">
            <img src="https://www.kauseyah.com/images/logo1.png" alt="KAUSEYAH" style="height: 60px; width: auto; display: inline-block;" />
            <p style="color: #666666; margin-top: 15px; margin-bottom: 0; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Thank you for your purchase</p>
          </div>

          <div style="padding: 40px 30px;">
            <p style="color: #2D2825; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Hi <strong style="color: #FF6B00;">${orderData.shipping_name || "Customer"}</strong>,<br/><br/>
              We are thrilled to let you know that your order has been successfully placed! 
              Every purchase helps support and empower traditional handloom weavers across the country. 
              Below is the official receipt for your records.
            </p>

            <!-- Order Details Box -->
            <div style="background-color: #FDFBF8; border: 1px solid #E5DFD5; border-left: 4px solid #FF6B00; border-radius: 8px; padding: 24px; margin-bottom: 35px;">
              <h2 style="margin: 0 0 15px 0; color: #2D2825; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">Order Receipt: <span style="color: #FF6B00;">#${shortOrderId}</span></h2>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Date:</strong> <span style="color: #2D2825; font-weight: 700;">${new Date().toLocaleDateString("en-IN")}</span></p>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Shipping To:</strong> <span style="color: #2D2825; font-weight: 700;">${orderData.shipping_name || ""}, ${orderData.city || ""}</span></p>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Payment Status:</strong> <span style="color: #FF6B00; font-weight: 800;">${(orderData.payment_status || "PAID").toUpperCase()}</span></p>
            </div>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 35px;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 16px 12px; border-bottom: 2px solid #E5DFD5; color: #FF6B00; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Item</th>
                  <th style="text-align: right; padding: 16px 12px; border-bottom: 2px solid #E5DFD5; color: #FF6B00; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 24px 12px 8px 12px; text-align: right; color: #666666; font-size: 15px; font-weight: 600;">Subtotal</td>
                  <td style="padding: 24px 12px 8px 12px; text-align: right; color: #2D2825; font-size: 16px; font-weight: 700;">₹${orderData.subtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; text-align: right; color: #666666; font-size: 15px; font-weight: 600;">Shipping</td>
                  <td style="padding: 8px 12px; text-align: right; color: #2D2825; font-size: 16px; font-weight: 700;">${orderData.shipping_charge === 0 ? "FREE" : `₹${orderData.shipping_charge}`}</td>
                </tr>
                ${orderData.gift_charge > 0 ? `
                <tr>
                  <td style="padding: 8px 12px; text-align: right; color: #FF6B00; font-size: 15px; font-weight: 600;">🎁 Gift Packaging</td>
                  <td style="padding: 8px 12px; text-align: right; color: #FF6B00; font-size: 16px; font-weight: 700;">₹${orderData.gift_charge}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 20px 12px; text-align: right; font-weight: 800; font-size: 18px; color: #2D2825; border-top: 2px solid #E5DFD5;">Total</td>
                  <td style="padding: 20px 12px; text-align: right; font-weight: 800; font-size: 24px; color: #FF6B00; border-top: 2px solid #E5DFD5;">₹${orderData.total_amount}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Business Details & Signature -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 40px; border-top: 1px solid #E5DFD5;">
              <tr>
                <td style="padding-top: 24px; text-align: left; color: #666666; font-size: 13px; font-weight: 500; line-height: 1.6; vertical-align: bottom;">
                  <strong style="color: #2D2825; font-size: 15px; font-weight: 800;">KAUSEYAH</strong><br/>
                  PAIDIGHANTOM SHWETA<br/>
                  OFFICER COLONY, POST-SAKTI, TAH-SAKTI<br/>
                  Janjgir Champa, Chhattisgarh, 495689<br/>
                  <strong style="color: #2D2825;">GSTIN:</strong> 22GNTPS0943E1ZR
                </td>
                <td style="padding-top: 24px; text-align: right; color: #666666; font-size: 13px; font-weight: 500; vertical-align: bottom;">
                  <img src="https://www.kauseyah.com/sign.png" alt="Authorized Signatory" style="height: 60px; width: auto; margin-bottom: 8px; display: inline-block;" /><br/>
                  Authorized Signatory
                </td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5DFD5;">
              <p style="color: #888888; font-size: 13px; font-weight: 500; line-height: 1.6;">If you have any questions about this receipt, simply reply to this email or contact our support team.<br/>&copy; ${new Date().getFullYear()} Kauseyah Store. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [customerEmail],
      subject: `Your Kauseyah Order Receipt (#${shortOrderId})`,
      html: htmlContent,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Sends automatic new-order notifications to the store owner / administrator.
 */
export async function sendAdminOrderNotification(
  orderId: string,
  orderData: any,
  cartItems: any[]
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, reason: "No RESEND credentials" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "shwetarao17@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Kauseyah Orders <orders@kauseyah.com>";

    const shortOrderId = orderId.split("-")[0];

    const itemsRows = cartItems.map((item) => {
      const gift = item.giftDetails;
      const isGift = Boolean(gift?.isGift);
      return `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 8px; vertical-align: top;">
            <strong style="color: #111;">${item.product?.name || "Product"}</strong><br/>
            <span style="color: #666; font-size: 13px;">Qty: ${item.quantity} × ₹${item.verifiedPrice || item.variant?.price || 0}</span>
            ${item.variant?.size || item.variant?.color ? `<br/><span style="color: #888; font-size: 12px;">Variant: ${[item.variant?.size, item.variant?.color].filter(Boolean).join(" / ")}</span>` : ""}
            ${isGift ? `
              <div style="margin-top: 6px; padding: 6px 8px; background: #fff8f3; border-left: 3px solid #FF6B00; border-radius: 4px;">
                <span style="color: #FF6B00; font-weight: 700; font-size: 12px;">🎁 Gift Order ${gift?.packaging ? "(Gift Packaging Included)" : ""}</span>
                ${gift?.message ? `<p style="margin: 3px 0 0 0; color: #444; font-size: 12px; font-style: italic;">"${gift.message}"</p>` : ""}
              </div>
            ` : ""}
          </td>
          <td style="padding: 12px 8px; text-align: right; vertical-align: top; font-weight: 700; color: #111;">
            ₹${(item.quantity * (item.verifiedPrice || item.variant?.price || 0)).toFixed(2)}
          </td>
        </tr>
      `;
    }).join("");

    const html = `
      <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; color: #111;">
        <div style="background: #111111; padding: 24px 30px; border-bottom: 4px solid #FF6B00;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">🛍️ New Customer Order: #${shortOrderId}</h1>
          <p style="color: #FF6B00; margin: 6px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Kauseyah Store Notification</p>
        </div>

        <div style="padding: 30px;">
          <!-- Order Summary Badge -->
          <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #666;"><strong>Order Date:</strong></td>
                <td style="padding: 4px 0; text-align: right; color: #111;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666;"><strong>Payment Status:</strong></td>
                <td style="padding: 4px 0; text-align: right;"><span style="color: #10b981; font-weight: 700; text-transform: uppercase;">${(orderData.payment_status || "PAID").toUpperCase()}</span></td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666;"><strong>Payment ID:</strong></td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #111;">${orderData.razorpay_payment_id || orderData.payment_id || "N/A"}</td>
              </tr>
            </table>
          </div>

          <!-- Customer & Shipping Details -->
          <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #FF6B00; margin-bottom: 10px;">Customer &amp; Delivery Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px; background: #fff8f3; border-radius: 8px; padding: 16px;">
            <tr><td style="padding: 6px 12px; color: #666;">Name:</td><td style="padding: 6px 12px; font-weight: 600;">${orderData.shipping_name || orderData.shipping_address?.name || "N/A"}</td></tr>
            <tr><td style="padding: 6px 12px; color: #666;">Email:</td><td style="padding: 6px 12px; font-weight: 600;"><a href="mailto:${orderData.email}" style="color: #FF6B00;">${orderData.email}</a></td></tr>
            <tr><td style="padding: 6px 12px; color: #666;">Phone:</td><td style="padding: 6px 12px; font-weight: 600;">${orderData.shipping_phone || orderData.shipping_address?.phone || "N/A"}</td></tr>
            <tr><td style="padding: 6px 12px; color: #666;">Address:</td><td style="padding: 6px 12px; font-weight: 600;">${orderData.shipping_address?.address || orderData.shipping_address || ""}, ${orderData.city || orderData.shipping_address?.city || ""}, ${orderData.pincode || orderData.shipping_address?.pincode || ""}</td></tr>
          </table>

          <!-- Line Items -->
          <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #FF6B00; margin-bottom: 10px;">Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e5e5; color: #888; font-size: 12px; text-transform: uppercase;">
                <th style="text-align: left; padding: 8px;">Product</th>
                <th style="text-align: right; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px 8px 4px 8px; text-align: right; color: #666;">Subtotal:</td>
                <td style="padding: 12px 8px 4px 8px; text-align: right; font-weight: 600;">₹${orderData.subtotal}</td>
              </tr>
              <tr>
                <td style="padding: 4px 8px; text-align: right; color: #666;">Shipping:</td>
                <td style="padding: 4px 8px; text-align: right; font-weight: 600;">${orderData.shipping_charge === 0 ? "FREE" : `₹${orderData.shipping_charge}`}</td>
              </tr>
              ${orderData.gift_charge > 0 ? `
              <tr>
                <td style="padding: 4px 8px; text-align: right; color: #FF6B00; font-weight: 600;">🎁 Gift Packaging:</td>
                <td style="padding: 4px 8px; text-align: right; font-weight: 600; color: #FF6B00;">₹${orderData.gift_charge}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 12px 8px; text-align: right; font-weight: 700; font-size: 16px; border-top: 2px solid #111;">Total Amount:</td>
                <td style="padding: 12px 8px; text-align: right; font-weight: 800; font-size: 18px; color: #FF6B00; border-top: 2px solid #111;">₹${orderData.total_amount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <a href="https://www.kauseyah.com/admin/orders/${orderId}" style="display: inline-block; background: #FF6B00; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 14px;">View Order in Admin Panel &rarr;</a>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `🛍️ New Order #${shortOrderId} — ₹${orderData.total_amount} (${orderData.shipping_name || "Customer"})`,
      html,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Sends an alert to the admin when payment is confirmed by Razorpay
 * but the order failed to save to the database.
 * This allows manual reconciliation so the customer is not left stranded.
 */
export async function sendAdminPaymentAlert(details: {
  customerEmail: string;
  customerName: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  errorMessage: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) return { success: false };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL || "shwetarao17@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Kauseyah Alerts <orders@kauseyah.com>";

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 2px solid #FF6B00; border-radius: 12px; overflow: hidden;">
        <div style="background: #FF6B00; padding: 20px 30px;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">⚠️ ACTION REQUIRED — Payment Without Order</h1>
        </div>
        <div style="padding: 30px;">
          <p style="color: #111; font-size: 15px; margin-top: 0;">
            A customer's payment was <strong>successfully verified by Razorpay</strong> but the order
            <strong>failed to save in the database</strong>. You must manually create this order or issue a refund.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; font-weight: 600;">Customer Name</td>
              <td style="padding: 10px 0; color: #111; font-weight: 700;">${details.customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; font-weight: 600;">Customer Email</td>
              <td style="padding: 10px 0; color: #111; font-weight: 700;">${details.customerEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; font-weight: 600;">Amount Paid</td>
              <td style="padding: 10px 0; color: #FF6B00; font-weight: 800; font-size: 16px;">₹${details.amount.toFixed(2)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; font-weight: 600;">Razorpay Order ID</td>
              <td style="padding: 10px 0; color: #111; font-family: monospace;">${details.razorpay_order_id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #666; font-weight: 600;">Razorpay Payment ID</td>
              <td style="padding: 10px 0; color: #111; font-family: monospace;">${details.razorpay_payment_id}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: 600;">DB Error</td>
              <td style="padding: 10px 0; color: #c0392b; font-weight: 700;">${details.errorMessage}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; background: #fff8f3; border-left: 4px solid #FF6B00; padding: 16px; border-radius: 4px;">
            <p style="margin: 0; color: #555; font-size: 13px;">
              <strong>Next steps:</strong> Log into the Razorpay dashboard to confirm the payment, then manually create 
              the order in the admin panel or contact the customer at <a href="mailto:${details.customerEmail}">${details.customerEmail}</a>.
            </p>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `⚠️ URGENT: Payment received but order not saved — ${details.razorpay_payment_id}`,
      html,
    });

    if (error) return { success: false, error };
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
