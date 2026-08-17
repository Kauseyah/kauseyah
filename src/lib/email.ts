import { Resend } from 'resend';

export async function sendOrderReceipt(
  customerEmail: string,
  orderId: string,
  orderData: any,
  cartItems: any[]
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      // console.warn("RESEND API key not configured. Email receipt generated but not sent.");
      return { success: false, reason: "No RESEND credentials" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generate HTML for cart items
    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #E5DFD5;">
          <strong style="color: #2D2825; font-size: 16px; font-weight: 700;">${item.product.name}</strong><br/>
          <span style="color: #666666; font-size: 14px; font-weight: 600;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #E5DFD5; text-align: right; color: #2D2825; font-size: 16px; font-weight: 700;">
          ₹${(item.quantity * item.variant.price).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const shortOrderId = orderId.split('-')[0];
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kauseyah.com'; // Replace with your production URL

    const htmlContent = `
      <div style="background-color: #F9F6F0; padding: 40px 20px; width: 100%; box-sizing: border-box;">
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E5DFD5; border-radius: 16px; overflow: hidden; color: #2D2825; line-height: 1.6; box-shadow: 0 8px 24px rgba(0,0,0,0.04);">
          
          <!-- Header -->
          <div style="text-align: center; padding: 40px 20px 30px 20px; background-color: #FFFFFF; border-bottom: 3px solid #FF6B00;">
            <img src="https://kauseyah.com/images/logo1.png" alt="KAUSEYAH" style="height: 60px; width: auto; display: inline-block;" />
            <p style="color: #666666; margin-top: 15px; margin-bottom: 0; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Thank you for your purchase</p>
          </div>

          <div style="padding: 40px 30px;">
            <p style="color: #2D2825; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Hi <strong style="color: #FF6B00;">${orderData.shipping_name}</strong>,<br/><br/>
              We are thrilled to let you know that your order has been successfully placed! 
              Every purchase helps support and empower traditional handloom weavers across the country. 
              Below is the official receipt for your records.
            </p>

            <!-- Order Details Box -->
            <div style="background-color: #FDFBF8; border: 1px solid #E5DFD5; border-left: 4px solid #FF6B00; border-radius: 8px; padding: 24px; margin-bottom: 35px;">
              <h2 style="margin: 0 0 15px 0; color: #2D2825; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">Order Receipt: <span style="color: #FF6B00;">#${shortOrderId}</span></h2>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Date:</strong> <span style="color: #2D2825; font-weight: 700;">${new Date().toLocaleDateString()}</span></p>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Shipping To:</strong> <span style="color: #2D2825; font-weight: 700;">${orderData.shipping_name}, ${orderData.city}</span></p>
              <p style="margin: 8px 0; color: #666666; font-size: 15px; font-weight: 500;"><strong>Payment Status:</strong> <span style="color: #FF6B00; font-weight: 800;">${orderData.payment_status.toUpperCase()}</span></p>
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
                  <td style="padding: 8px 12px; text-align: right; color: #2D2825; font-size: 16px; font-weight: 700;">₹${orderData.shipping_charge}</td>
                </tr>
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
                  <img src="https://kauseyah.com/sign.png" alt="Authorized Signatory" style="height: 60px; width: auto; margin-bottom: 8px; display: inline-block;" /><br/>
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
      from: 'Kauseyah Store <orders@kauseyah.com>',
      to: [customerEmail],
      subject: `Your Kauseyah Order Receipt (#${shortOrderId})`,
      html: htmlContent,
    });

    if (error) {
      // console.error("Resend API error:", error);
      return { success: false, error };
    }

    // console.log("Email Receipt sent via Resend API: %s", data?.id);
    return { success: true };
  } catch (error) {
    // console.error("Error sending email receipt:", error);
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
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) return { success: false, reason: "No ADMIN_EMAIL configured" };

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
      from: 'Kauseyah Alerts <orders@kauseyah.com>',
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
