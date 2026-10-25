import { NextResponse } from "next/server";
import { getMailTransporter, getMailAddresses } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      shareCount,
      totalAmount,
      investorTier,
      preferredContact,
      notes,
    } = body;

    if (!email || !totalAmount) {
      return NextResponse.json(
        { error: "Email and investment amount are required" },
        { status: 400 }
      );
    }

    const inquiryId =
      "TX-EQ-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { from, adminEmail } = getMailAddresses();
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" });
    const displayName = name || email.split("@")[0] || "Prospective Investor";
    const formattedAmount = "$" + Number(totalAmount).toLocaleString("en-US");
    const formattedShares = Number(shareCount || 0).toLocaleString("en-US");

    // -------------------------------------------------------------
    // EMAIL 1: ADMIN / CUSTOMER SERVICE NOTIFICATION EMAIL
    // -------------------------------------------------------------
    const adminSubject = `📈 New TeslaX Stock Allocation Request [${inquiryId}] - ${formattedAmount} (${formattedShares} shares) from ${displayName}`;

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050608; color: #f3f4f6; margin: 0; padding: 30px 15px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0b0c0f; border: 1px solid #1f2229; border-radius: 12px; overflow: hidden; }
          .header { background: #000; padding: 24px; border-bottom: 1px solid #1f2229; text-align: center; }
          .logo { font-size: 18px; font-weight: 700; letter-spacing: 0.25em; color: #fff; text-transform: uppercase; }
          .logo span { color: #34d399; }
          .content { padding: 30px 24px; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(52,211,153,0.14); border: 1px solid rgba(52,211,153,0.35); border-radius: 4px; color: #34d399; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
          h2 { margin: 14px 0 6px; font-size: 20px; color: #fff; }
          p { margin: 6px 0 16px; color: #8b9199; font-size: 14px; line-height: 1.6; }
          .card { background: #121418; border: 1px solid #242831; border-radius: 8px; padding: 18px; margin: 18px 0; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #1c2027; padding: 9px 0; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .k { color: #8b9199; }
          .v { color: #f3f4f6; font-weight: 500; text-align: right; }
          .highlight { font-size: 18px; color: #34d399; font-weight: 600; }
          .footer { background: #07080a; padding: 20px 24px; border-top: 1px solid #1f2229; text-align: center; font-size: 12px; color: #5d636b; }
          .btn { display: inline-block; background: #34d399; color: #040507 !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">TESLA<span>X</span> CAPITAL &amp; EQUITY</div>
          </div>
          <div class="content">
            <span class="badge">Stock Allocation Request</span>
            <h2>New Investor Inquiry Received</h2>
            <p>A member has submitted an inquiry to acquire equity shares in TeslaX.</p>

            <div class="card">
              <div class="row"><span class="k">Inquiry ID:</span><span class="v mono" style="color: #fff;">${inquiryId}</span></div>
              <div class="row"><span class="k">Investor Name:</span><span class="v">${displayName}</span></div>
              <div class="row"><span class="k">Email:</span><span class="v"><a href="mailto:${email}" style="color: #6ee7b7;">${email}</a></span></div>
              ${phone ? `<div class="row"><span class="k">Phone / WhatsApp:</span><span class="v">${phone}</span></div>` : ""}
              <div class="row"><span class="k">Preferred Contact:</span><span class="v" style="text-transform: capitalize;">${preferredContact || "email"}</span></div>
              <div class="row"><span class="k">Target Allocation:</span><span class="v highlight">${formattedAmount}</span></div>
              <div class="row"><span class="k">Estimated Shares:</span><span class="v">${formattedShares} shares (@ ~$284.60)</span></div>
              <div class="row"><span class="k">Investor Tier:</span><span class="v">${investorTier || "Retail Member"}</span></div>
              <div class="row"><span class="k">Submission Time:</span><span class="v">${timestamp} UTC</span></div>
            </div>

            ${
              notes
                ? `<div class="card" style="margin-top: 12px;"><span class="k" style="display: block; margin-bottom: 6px;">Investor Message / Notes:</span><div style="font-size: 13px; color: #d1d5db; white-space: pre-wrap;">${notes}</div></div>`
                : ""
            }

            <div style="text-align: center; margin-top: 24px;">
              <a class="btn" href="mailto:${email}?subject=Re:%20TeslaX%20Equity%20Allocation%20[${inquiryId}]&body=Hello%20${encodeURIComponent(displayName)},%0A%0AThank%20you%20for%20your%20interest%20in%20allocating%20capital%20into%20TeslaX%20equity%20(${formattedAmount}).%20Our%20investor%20relations%20desk%20has%20logged%20your%20inquiry%20under%20reference%20${inquiryId}.%0A%0APlease%20let%20us%20know%20your%20availability%20for%20a%20brief%20call%20or%20to%20receive%20the%20term%20sheet.%0A%0ABest%20regards,%0ATeslaX%20Investor%20Relations">
                Reply / Contact Investor (${email}) →
              </a>
            </div>
          </div>

          <div class="footer">
            TeslaX Investor Relations &amp; Customer Care · Target destination: ${adminEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    // -------------------------------------------------------------
    // EMAIL 2: INVESTOR CONFIRMATION RECEIPT EMAIL
    // -------------------------------------------------------------
    const clientSubject = `📈 TeslaX Equity Allocation Request Received [${inquiryId}]`;

    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050608; color: #f3f4f6; margin: 0; padding: 30px 15px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0b0c0f; border: 1px solid #1f2229; border-radius: 12px; overflow: hidden; }
          .header { background: #000; padding: 24px; border-bottom: 1px solid #1f2229; text-align: center; }
          .logo { font-size: 18px; font-weight: 700; letter-spacing: 0.25em; color: #fff; text-transform: uppercase; }
          .logo span { color: #34d399; }
          .content { padding: 30px 24px; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(52,211,153,0.14); border: 1px solid rgba(52,211,153,0.35); border-radius: 4px; color: #34d399; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
          h2 { margin: 14px 0 6px; font-size: 20px; color: #fff; }
          p { margin: 6px 0 16px; color: #8b9199; font-size: 14px; line-height: 1.6; }
          .card { background: #121418; border: 1px solid #242831; border-radius: 8px; padding: 18px; margin: 18px 0; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #1c2027; padding: 9px 0; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .k { color: #8b9199; }
          .v { color: #f3f4f6; font-weight: 500; text-align: right; }
          .footer { background: #07080a; padding: 20px 24px; border-top: 1px solid #1f2229; text-align: center; font-size: 12px; color: #5d636b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">TESLA<span>X</span> INVESTOR RELATIONS</div>
          </div>
          <div class="content">
            <span class="badge">Allocation Logged</span>
            <h2>Thank You for Your Investment Inquiry</h2>
            <p>Hello <strong>${displayName}</strong>, we have received your request for equity allocation in TeslaX.</p>

            <div class="card">
              <div class="row"><span class="k">Reference ID:</span><span class="v mono" style="color: #fff;">${inquiryId}</span></div>
              <div class="row"><span class="k">Target Amount:</span><span class="v" style="color: #34d399; font-weight: 600;">${formattedAmount}</span></div>
              <div class="row"><span class="k">Estimated Shares:</span><span class="v">${formattedShares} shares</span></div>
              <div class="row"><span class="k">Status:</span><span class="v" style="color: #fbbf24;">Pending Concierge Review</span></div>
              <div class="row"><span class="k">Timestamp:</span><span class="v">${timestamp} UTC</span></div>
            </div>

            <p style="font-size: 13px; color: #717782;">
              Our Investor Relations concierge will review your allocation preferences and reach out via your chosen method (<strong>${preferredContact || "email"}</strong>) within 1 business day with subscription documentation and prospectus details.
            </p>
          </div>

          <div class="footer">
            If you have urgent questions regarding your allocation, please contact <a href="mailto:${adminEmail}" style="color: #34d399;">${adminEmail}</a> quoting reference <strong>${inquiryId}</strong>.
          </div>
        </div>
      </body>
      </html>
    `;

    // -------------------------------------------------------------
    // DISPATCH VIA GOOGLE SMTP IF CONFIGURED, OR SIMULATE/LOG
    // -------------------------------------------------------------
    let emailSent = false;
    const transporter = getMailTransporter();

    if (transporter) {
      try {
        // Send alert to Admin/Customer Care
        await transporter.sendMail({
          from,
          to: adminEmail,
          replyTo: email,
          subject: adminSubject,
          html: adminHtml,
        });

        // Send confirmation receipt to Investor
        await transporter.sendMail({
          from,
          to: email,
          subject: clientSubject,
          html: clientHtml,
        });

        emailSent = true;
        console.log(
          `[TeslaX Google SMTP] Dispatched investment inquiry ${inquiryId} to ${adminEmail} and receipt to ${email}`
        );
      } catch (err: any) {
        console.warn(
          "[TeslaX Google SMTP] Investment mail dispatch error, falling back to simulated log:",
          err?.message
        );
      }
    } else {
      console.log(
        `[TeslaX Investment Dispatch] 1. Alert sent to ADMIN at: ${adminEmail} for ${displayName} (${formattedAmount}, ${formattedShares} shares)`
      );
      console.log(
        `[TeslaX Investment Dispatch] 2. Receipt sent to INVESTOR at: ${email} for reference: ${inquiryId}`
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      adminEmail,
      emailSent,
      timestamp,
      summary: {
        investor: displayName,
        email,
        phone,
        shares: formattedShares,
        amount: formattedAmount,
      },
    });
  } catch (error: any) {
    console.error("Investment allocation error:", error);
    return NextResponse.json(
      { error: "Failed to submit investment inquiry", details: error?.message },
      { status: 500 }
    );
  }
}
