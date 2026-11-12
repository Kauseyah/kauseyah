import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET: Display confirmation page WITHOUT immediately unsubscribing.
// Protects subscribers against email security crawlers (Defender ATP, Proofpoint, Gmail prefetch).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(
      renderMessagePage("Invalid Request", "Missing or invalid unsubscribe token.", "error"),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 400 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: subscriber, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email, status")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (error || !subscriber) {
      return new NextResponse(
        renderMessagePage(
          "Link Not Found or Expired",
          "We could not find an active subscription associated with this security token. You may already be unsubscribed.",
          "info"
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (subscriber.status === "unsubscribed") {
      return new NextResponse(
        renderMessagePage(
          "Already Unsubscribed",
          `The address <strong>${subscriber.email}</strong> is already unsubscribed from The Kauseyah Craft Journal.`,
          "info"
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Render Confirmation Form requiring user intent (RFC compliant)
    return new NextResponse(
      renderConfirmationPage(subscriber.email, token),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err) {
    return new NextResponse(
      renderMessagePage("Server Error", "A server error occurred. Please try again or contact support.", "error"),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 500 }
    );
  }
}

// POST: Performs immediate one-click suppression.
// Compliant with RFC 8058 One-Click Unsubscribe (for email clients) AND the GET confirmation form.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing unsubscribe token" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: subscriber, error: fetchError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, email, status")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (fetchError || !subscriber) {
      return NextResponse.json({ error: "Subscriber not found or token expired" }, { status: 404 });
    }

    // Immediate suppression
    const { error: updateError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Check if the request expects HTML (browser form POST) or JSON (RFC 8058 client)
    const acceptHeader = req.headers.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      return new NextResponse(
        renderMessagePage(
          "Unsubscribed Successfully",
          `You have been removed from The Kauseyah Craft Journal mailing list. No further emails will be sent to <strong>${subscriber.email}</strong>.`,
          "success"
        ),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Unsubscribed ${subscriber.email} successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

function renderConfirmationPage(email: string, token: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm Unsubscribe | The Kauseyah Craft Journal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #FFF8F3;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      color: #2D2825;
    }
    .card {
      background: #ffffff;
      max-width: 500px;
      width: 100%;
      border-radius: 20px;
      border: 1px solid #EADDCF;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0,0,0,0.04);
    }
    .logo {
      font-family: Georgia, serif;
      font-size: 22px;
      letter-spacing: 2px;
      color: #111111;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #FFF0E6;
      color: #FF6B00;
      line-height: 52px;
      font-size: 24px;
      margin: 0 auto 20px auto;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 12px 0;
      color: #111111;
      font-weight: 700;
    }
    p {
      color: #55504A;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .btn-unsubscribe {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      background: #111111;
      color: #ffffff;
      border: none;
      padding: 14px 28px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .btn-unsubscribe:hover {
      background: #D9381E;
    }
    .cancel-link {
      display: inline-block;
      margin-top: 18px;
      color: #8C827A;
      font-size: 12px;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Kauseyah</div>
    <div class="icon">✉</div>
    <h1>The Kauseyah Craft Journal</h1>
    <p>Are you sure you want to stop receiving stories on indigenous arts, weaver profiles, and handloom highlights for <strong>${email}</strong>?</p>
    <form method="POST" action="/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}">
      <button type="submit" class="btn-unsubscribe">Confirm Unsubscribe</button>
    </form>
    <a href="https://www.kauseyah.com" class="cancel-link">Never mind, keep me subscribed</a>
  </div>
</body>
</html>`;
}

function renderMessagePage(title: string, message: string, type: "success" | "error" | "info") {
  const badgeColors = {
    success: { bg: "#ECFDF5", text: "#059669", icon: "✓" },
    error: { bg: "#FEF2F2", text: "#DC2626", icon: "!" },
    info: { bg: "#EFF6FF", text: "#2563EB", icon: "ℹ" },
  }[type];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Kauseyah</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #FFF8F3;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      color: #2D2825;
    }
    .card {
      background: #ffffff;
      max-width: 500px;
      width: 100%;
      border-radius: 20px;
      border: 1px solid #EADDCF;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0,0,0,0.04);
    }
    .logo {
      font-family: Georgia, serif;
      font-size: 22px;
      letter-spacing: 2px;
      color: #111111;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .badge {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: ${badgeColors.bg};
      color: ${badgeColors.text};
      line-height: 50px;
      font-size: 22px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 12px 0;
      color: #111111;
    }
    p {
      color: #55504A;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    a.btn {
      display: inline-block;
      background: #FF6B00;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 50px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Kauseyah</div>
    <div class="badge">${badgeColors.icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://www.kauseyah.com" class="btn">Return to Kauseyah</a>
  </div>
</body>
</html>`;
}
