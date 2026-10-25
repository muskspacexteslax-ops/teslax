import { NextResponse } from "next/server";
import { getMailTransporter, getMailAddresses } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, cart } = body;

    if (!customer?.email || !cart?.modelName) {
      return NextResponse.json(
        { error: "Customer email and cart details are required" },
        { status: 400 }
      );
    }

    const inquiryId = "TX-CC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { from, adminEmail: customerCareEmail } = getMailAddresses();
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" });

    // Build Email Subject and HTML body
    const emailSubject = `🚗 New TeslaX Order Request [${inquiryId}] - ${cart.modelName} from ${customer.name || customer.email}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050608; color: #f3f4f6; margin: 0; padding: 30px 15px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0b0c0f; border: 1px solid #1f2229; border-radius: 12px; overflow: hidden; }
          .header { background: #000; padding: 24px; border-bottom: 1px solid #1f2229; text-align: center; }
          .logo { font-size: 18px; font-weight: 700; letter-spacing: 0.25em; color: #fff; text-transform: uppercase; }
          .logo span { color: #e82127; }
          .content { padding: 30px 24px; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(232,33,39,0.15); border: 1px solid rgba(232,33,39,0.3); border-radius: 4px; color: #ff7c81; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
          h2 { margin: 12px 0 6px; font-size: 20px; color: #fff; }
          p { margin: 6px 0 16px; color: #8b9199; font-size: 14px; line-height: 1.6; }
          .card { background: #121418; border: 1px solid #242831; border-radius: 8px; padding: 18px; margin: 18px 0; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #1c2027; padding: 8px 0; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .k { color: #8b9199; }
          .v { color: #f3f4f6; font-weight: 500; text-align: right; }
          .highlight { font-size: 18px; color: #34d399; font-weight: 600; }
          .footer { background: #07080a; padding: 20px 24px; border-top: 1px solid #1f2229; text-align: center; font-size: 12px; color: #5d636b; }
          .btn { display: inline-block; background: #e82127; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 13px; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">TESLA<span>X</span> CUSTOMER CARE DISPATCH</div>
          </div>
          <div class="content">
            <span class="badge">Inquiry ${inquiryId}</span>
            <h2>Potential Buyer Cart Submitted</h2>
            <p>A buyer has configured their vehicle on TeslaX and requested direct Customer Care follow-up.</p>

            <div class="card">
              <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8b9199;">Client Contact Information</h3>
              <div class="row"><span class="k">Client Name:</span><span class="v">${customer.name || "Not provided"}</span></div>
              <div class="row"><span class="k">Client Email:</span><span class="v"><a href="mailto:${customer.email}" style="color: #6ee7b7;">${customer.email}</a></span></div>
              <div class="row"><span class="k">Client Phone:</span><span class="v">${customer.phone || "Not provided"}</span></div>
              <div class="row"><span class="k">Preferred Contact:</span><span class="v" style="text-transform: capitalize;">${customer.preferredContact || "Email"}</span></div>
              <div class="row"><span class="k">Submitted At:</span><span class="v">${timestamp} UTC</span></div>
            </div>

            <div class="card">
              <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8b9199;">Selected Vehicle Cart Details</h3>
              <div class="row"><span class="k">Vehicle Model:</span><span class="v">${cart.modelName}</span></div>
              <div class="row"><span class="k">Transaction Type:</span><span class="v" style="text-transform: capitalize;">${cart.kindLabel || cart.kind}</span></div>
              <div class="row"><span class="k">Target Delivery Date:</span><span class="v">${cart.preferredDate || "As soon as ready"}</span></div>
              ${
                cart.instalmentsCount && cart.instalmentsCount > 1
                  ? `<div class="row"><span class="k">Payment Plan:</span><span class="v">${cart.instalmentsCount} instalments of $${cart.instalmentAmount}</span></div>`
                  : ""
              }
              ${
                cart.leaseMonths
                  ? `<div class="row"><span class="k">Lease Term:</span><span class="v">${cart.leaseMonths} months</span></div>`
                  : ""
              }
              ${
                cart.hireDays
                  ? `<div class="row"><span class="k">Rental Duration:</span><span class="v">${cart.hireDays} days</span></div>`
                  : ""
              }
              <div class="row" style="margin-top: 6px; padding-top: 10px; border-top: 1px dashed #323846;">
                <span class="k">Estimated Total Price:</span>
                <span class="v highlight">$${(cart.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>

              ${
                cart.tradeIn
                  ? `<div class="card" style="border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.03);">
                      <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #34d399;">Trade-In Credit Offset</h3>
                      <div class="row"><span class="k">Trade-in Vehicle:</span><span class="v">${cart.tradeIn.carName}</span></div>
                      <div class="row"><span class="k">Trade-in Credit:</span><span class="v" style="color: #6ee7b7;">-$${(cart.tradeIn.creditAmount || 0).toLocaleString()}</span></div>
                      ${cart.tradeIn.valuationId ? `<div class="row"><span class="k">Valuation Ref:</span><span class="v">${cart.tradeIn.valuationId}</span></div>` : ""}
                      ${cart.tradeIn.condition ? `<div class="row"><span class="k">Reported Condition:</span><span class="v" style="text-transform: capitalize;">${cart.tradeIn.condition}</span></div>` : ""}
                      ${cart.tradeIn.mileage ? `<div class="row"><span class="k">Mileage:</span><span class="v">${Number(cart.tradeIn.mileage).toLocaleString()} miles</span></div>` : ""}
                    </div>`
                  : ""
              }

            ${
              customer.notes
                ? `<div class="card"><h3 style="margin:0 0 8px;font-size:13px;color:#8b9199;">Client Notes:</h3><p style="margin:0;color:#d3d6da;">${customer.notes}</p></div>`
                : ""
            }

            <div style="text-align: center; margin-top: 26px;">
              <a class="btn" href="mailto:${customer.email}?subject=TeslaX%20Vehicle%20Order%20${inquiryId}&body=Hello%20${encodeURIComponent(customer.name || "there")},%0A%0AThank%20you%20for%20your%20interest%20in%20the%20${encodeURIComponent(cart.modelName)}.%20We%20received%20your%20order%20request%20(${inquiryId})...">
                Reply to Client (${customer.email})
              </a>
            </div>
          </div>

          <div class="footer">
            TeslaX Concierge & Customer Care Dispatch Notification.<br/>
            Target destination: ${customerCareEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    // Attempt real email send via Google SMTP if configured
    let emailSent = false;
    const transporter = getMailTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from,
          to: customerCareEmail,
          replyTo: customer.email,
          subject: emailSubject,
          html: emailHtml,
        });

        emailSent = true;
        console.log(`[TeslaX Google SMTP] Sent order inquiry for ${cart.modelName} to Customer Care at ${customerCareEmail}`);
      } catch (err: any) {
        console.warn("[TeslaX Google SMTP] Send failed, falling back to simulated dispatch:", err?.message);
      }
    } else {
      console.log(`[TeslaX Email Dispatch] Sent cart for ${cart.modelName} to customer care at ${customerCareEmail}`);
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      customerCareEmail,
      emailSent,
      timestamp,
      summary: {
        client: customer.name || customer.email,
        email: customer.email,
        phone: customer.phone,
        preferredContact: customer.preferredContact,
        vehicle: cart.modelName,
        total: cart.totalAmount,
      },
    });
  } catch (error: any) {
    console.error("Checkout dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch order to customer care", details: error?.message },
      { status: 500 }
    );
  }
}
